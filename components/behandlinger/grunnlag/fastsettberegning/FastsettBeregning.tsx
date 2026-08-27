'use client';

import { Heading } from '@navikt/ds-react';
import { isBefore, parse } from 'date-fns';
import { useSak } from 'hooks/SakHook';
import { useParamsMedType } from 'hooks/saksbehandling/BehandlingHook';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';
import { useVilkårskortVisning } from 'hooks/saksbehandling/visning/VisningHook';
import {
  BeregningstidspunktVurderingResponse,
  BeregningTidspunktGrunnlag,
  MellomlagretVurdering,
  ÅrsakBeregningstidspunkt,
  ÅrsakYtterligereNedsatt,
} from 'lib/types/types';
import { formaterDatoForBackend, formaterDatoForFrontend, sorterEtterNyesteDato } from 'lib/utils/date';
import { Behovstype, getStringEllerUndefined } from 'lib/utils/form';
import { loggUmamiVarighet, useUmamiStartTidspunkt } from 'lib/utils/umami/varighet';
import { erDatoFoerDato, erDatoIFremtiden, validerDato } from 'lib/validation/dateValidation';
import { SubmitEventHandler } from 'react';

import { Alert } from 'components/alert/Alert';
import { FormField, ValuePair } from 'components/form/FormField';
import { useConfigForm } from 'components/form/FormHook';
import { TidligereVurderinger } from 'components/tidligerevurderinger/TidligereVurderinger';
import { deepEqual } from 'components/tidligerevurderinger/TidligereVurderingerUtils';
import { VilkårskortMedFormOgMellomlagring } from 'components/vilkårskort/vilkårskortmedformogmellomlagring/VilkårskortMedFormOgMellomlagring';

import styles from './FastsettBeregning.module.css';
import { useLøsAvklaringsbehov } from 'hooks/saksbehandling/løsavklaringsbehov/useLøsAvklaringsbehov';

interface Props {
  grunnlag?: BeregningTidspunktGrunnlag;
  behandlingVersjon: number;
  readOnly: boolean;
  initialMellomlagretVurdering?: MellomlagretVurdering;
  visAarsakDropdowns: boolean;
}

// Kun nedsatt arbeidsevne (ikke ytterligere nedsatt, jf. § 11-28)
const ÅRSAK_TIL_BEREGNINGSTIDSPUNKT_SOLO_OPTIONS: ValuePair<ÅrsakBeregningstidspunkt | ''>[] = [
  { label: '', value: '' },
  { label: 'Sykemeldingsdato', value: 'SYKEMELDINGSDATO' },
  { label: 'Kravdato', value: 'KRAVDATO' },
  { label: 'Dato på legeerklæring', value: 'DATO_PAA_LEGEERKLÆRING' },
  { label: 'Henvist til behandling', value: 'HENVIST_TIL_BEHANDLING' },
  { label: 'Annet', value: 'ANNET' },
];

// Nedsatt arbeidsevne når det også skal vurderes ytterligere nedsatt, jf. § 11-28
const ÅRSAK_TIL_BEREGNINGSTIDSPUNKT_KOMBINERT_OPTIONS: ValuePair<ÅrsakBeregningstidspunkt | ''>[] = [
  { label: '', value: '' },
  { label: 'Uføretidspunkt', value: 'UFØRETIDSPUNKT' },
  { label: 'Annet', value: 'ANNET' },
];

const ÅRSAK_TIL_YTTERLIGERE_NEDSATT_OPTIONS: ValuePair<ÅrsakYtterligereNedsatt | ''>[] = [
  { label: '', value: '' },
  { label: 'Sykemeldingsdato', value: 'SYKEMELDINGSDATO' },
  { label: 'Kravdato', value: 'KRAVDATO' },
  { label: 'Dato på legeerklæring', value: 'DATO_PAA_LEGEERKLÆRING' },
  { label: 'Henvist til behandling', value: 'HENVIST_TIL_BEHANDLING' },
  { label: 'Annet', value: 'ANNET' },
];

// Supersett av labels, inkl. verdier som ikke lenger kan velges, brukt for å vise historiske vurderinger korrekt
const ALLE_ÅRSAK_TIL_BEREGNINGSTIDSPUNKT_LABELS: ValuePair[] = [
  ...ÅRSAK_TIL_BEREGNINGSTIDSPUNKT_SOLO_OPTIONS,
  { label: 'Uføretidspunkt', value: 'UFØRETIDSPUNKT' },
  { label: '16 år som beregningstidspunkt', value: 'SEKSTEN_ÅR_SOM_BEREGNINGSTIDSPUNKT' },
];

const ALLE_ÅRSAK_TIL_YTTERLIGERE_NEDSATT_LABELS: ValuePair[] = [
  ...ÅRSAK_TIL_YTTERLIGERE_NEDSATT_OPTIONS,
  { label: 'Uføretidspunkt', value: 'UFØRETIDSPUNKT' },
  { label: 'Ytterligere nedsatt', value: 'YTTERLIGERE_NEDSATT' },
  { label: 'Økt uføregrad', value: 'ØKT_UFØREGRAD' },
  { label: 'Ikke betydning / ikke relevant', value: 'IKKE_BETYDNING_IKKE_RELEVANT' },
];

export const defaultNedsattArbeidsevneBegrunnelseOverskrifter = ['Relevant faktum', 'Vurdering', 'Konklusjon'];

export const defaultNedsattArbeidsevneBegrunnelse = defaultNedsattArbeidsevneBegrunnelseOverskrifter.join('\n\n');

interface FormFields {
  nedsattArbeidsevneDatobegrunnelse: string;
  nedsattArbeidsevneDato: string;
  årsak: string;
  ytterligereNedsattArbeidsevneDato?: string;
  ytterligereNedsattArbeidsevneDatobegrunnelse?: string;
  ytterligereNedsattÅrsak?: string;
}

type DraftFormFields = Partial<FormFields>;

export const FastsettBeregning = ({
  grunnlag,
  behandlingVersjon,
  readOnly,
  initialMellomlagretVurdering,
  visAarsakDropdowns,
}: Props) => {
  const { behandlingsreferanse } = useParamsMedType();
  const { sak } = useSak();

  const { løsAvklaringsbehov, løsAvklaringsbehovStatus, løsAvklaringsbehovIsLoading, løsAvklaringsbehovError } =
    useLøsAvklaringsbehov('FASTSETT_BEREGNINGSTIDSPUNKT');

  const { visningActions, formReadOnly, visningModus } = useVilkårskortVisning(
    readOnly,
    'FASTSETT_BEREGNINGSTIDSPUNKT',
    initialMellomlagretVurdering
  );
  const umamiStartTidspunkt = useUmamiStartTidspunkt(visningModus);

  const defaultValues: DraftFormFields = initialMellomlagretVurdering
    ? JSON.parse(initialMellomlagretVurdering.data)
    : mapVurderingToDraftFormFields(grunnlag?.vurdering);

  const årsakTilBeregningstidspunktOptions = grunnlag?.skalVurdereYtterligere
    ? ÅRSAK_TIL_BEREGNINGSTIDSPUNKT_KOMBINERT_OPTIONS
    : ÅRSAK_TIL_BEREGNINGSTIDSPUNKT_SOLO_OPTIONS;

  const { formFields, form } = useConfigForm<FormFields>(
    {
      nedsattArbeidsevneDatobegrunnelse: {
        type: 'textarea',
        label: 'Vilkårsvurdering',
        defaultValue: defaultValues.nedsattArbeidsevneDatobegrunnelse,
        rules: {
          required: 'Du må skrive en begrunnelse for når brukeren fikk nedsatt arbeidsevne',
          validate: {
            kanIkkeVæreDefaultBegrunnelse: (value) =>
              (value as string).trim() !== defaultNedsattArbeidsevneBegrunnelse.trim() ||
              'Du må skrive en egen vilkårsvurdering',
          },
        },
      },
      nedsattArbeidsevneDato: {
        type: 'date_input',
        label: 'Datoen da arbeidsevnen ble nedsatt',
        defaultValue: defaultValues.nedsattArbeidsevneDato,
        rules: {
          validate: (value) => {
            const valideringsresultat = validerDato(value);
            const datoErFremITid = erDatoIFremtiden(value);

            if (valideringsresultat) {
              return valideringsresultat;
            } else if (datoErFremITid) {
              return 'Du kan ikke registrere tidspunkt frem i tid.';
            }
          },
        },
      },
      årsak: {
        type: 'select',
        label: 'Årsak til beregningstidspunkt',
        options: årsakTilBeregningstidspunktOptions,
        defaultValue: defaultValues.årsak,
        rules: visAarsakDropdowns ? { required: 'Du må velge årsak til beregningstidspunkt.' } : {},
      },
      ytterligereNedsattArbeidsevneDatobegrunnelse: {
        type: 'textarea',
        label: 'Vurder når brukeren fikk ytterligere nedsatt arbeidsevne',
        defaultValue: defaultValues.ytterligereNedsattArbeidsevneDatobegrunnelse,
        rules: { required: 'Du må skrive en begrunnelse for når brukeren fikk ytterligere nedsatt arbeidsevne' },
      },
      ytterligereNedsattArbeidsevneDato: {
        type: 'date_input',
        label: 'Datoen da arbeidsevnen ble ytterligere nedsatt',
        defaultValue: defaultValues.ytterligereNedsattArbeidsevneDato,
        rules: {
          validate: (value, formValues) => {
            const valideringsresultat = validerDato(value);
            if (valideringsresultat) {
              return valideringsresultat;
            }

            if (value && isBefore(new Date(value), new Date(formValues.nedsattArbeidsevneDato))) {
              return 'Ytterligere nedsatt dato kan ikke være før datoen arbeidsevnen ble nedsatt';
            }
          },
        },
      },
      ytterligereNedsattÅrsak: {
        type: 'select',
        label: 'Årsak til ytterligere nedsatt tidspunkt.',
        options: ÅRSAK_TIL_YTTERLIGERE_NEDSATT_OPTIONS,
        defaultValue: defaultValues.ytterligereNedsattÅrsak,
        rules: visAarsakDropdowns ? { required: 'Du må velge årsak til ytterligere nedsatt tidspunkt.' } : {},
      },
    },
    { readOnly: formReadOnly }
  );

  const { mellomlagretVurdering, nullstillMellomlagretVurdering, slettMellomlagring } = useMellomlagring(
    Behovstype.FASTSETT_BEREGNINGSTIDSPUNKT_KODE,
    initialMellomlagretVurdering,
    form
  );

  const handleSubmit: SubmitEventHandler = (event) => {
    form.handleSubmit((data) => {
      løsAvklaringsbehov(
        {
          behandlingVersjon: behandlingVersjon,
          behov: {
            behovstype: Behovstype.FASTSETT_BEREGNINGSTIDSPUNKT_KODE,
            beregningVurdering: {
              begrunnelse: data.nedsattArbeidsevneDatobegrunnelse,
              nedsattArbeidsevneDato: formaterDatoForBackend(
                parse(data.nedsattArbeidsevneDato, 'dd.MM.yyyy', new Date())
              ),
              ytterligereNedsattArbeidsevneDato: data.ytterligereNedsattArbeidsevneDato
                ? formaterDatoForBackend(parse(data.ytterligereNedsattArbeidsevneDato, 'dd.MM.yyyy', new Date()))
                : undefined,
              ytterligereNedsattBegrunnelse: data?.ytterligereNedsattArbeidsevneDatobegrunnelse,
              årsak: (data.årsak || undefined) as ÅrsakBeregningstidspunkt | undefined,
              ytterligereNedsattÅrsak: (data.ytterligereNedsattÅrsak || undefined) as
                | ÅrsakYtterligereNedsatt
                | undefined,
            },
          },
          referanse: behandlingsreferanse,
        },
        () => {
          loggUmamiVarighet('STEG_FASTSETT_BEREGNINGSTIDSPUNKT_VARIGHET', umamiStartTidspunkt, Date.now());
          visningActions.onBekreftClick();
          nullstillMellomlagretVurdering();
        }
      );
    })(event);
  };

  const heading = grunnlag?.skalVurdereYtterligere
    ? '§ 11-19 Tidspunktet da arbeidsevnen ble nedsatt, jf. § 11-5 og § 11-28'
    : '§ 11-19 Tidspunktet da arbeidsevnen ble nedsatt, jf. § 11-5';

  const erBeregningsTidspunktEtterVirkningsTidspunkt =
    sak.virkningsTidspunkt !== null &&
    sak.virkningsTidspunkt &&
    form.watch('nedsattArbeidsevneDato') &&
    erDatoFoerDato(formaterDatoForFrontend(sak.virkningsTidspunkt), form.watch('nedsattArbeidsevneDato'));

  const erBeregningsTidspunktEtterSøknadstidspunkt =
    sak.periode.fom &&
    form.watch('nedsattArbeidsevneDato') &&
    erDatoFoerDato(formaterDatoForFrontend(sak.periode.fom), form.watch('nedsattArbeidsevneDato'));

  const historiskeVurderinger = grunnlag?.historiskeVurderinger.sort((a, b) => {
    return sorterEtterNyesteDato(a.vurderingerMeta.vurdertAv?.dato ?? '', b.vurderingerMeta.vurdertAv?.dato ?? '');
  });

  return (
    <VilkårskortMedFormOgMellomlagring
      heading={heading}
      steg={'FASTSETT_BEREGNINGSTIDSPUNKT'}
      onSubmit={handleSubmit}
      isLoading={løsAvklaringsbehovIsLoading}
      vilkårTilhørerNavKontor={false}
      løsBehovOgGåTilNesteStegError={løsAvklaringsbehovError}
      status={løsAvklaringsbehovStatus}
      vurderingerMeta={grunnlag?.vurdering?.vurderingerMeta}
      mellomlagretVurdering={mellomlagretVurdering}
      onDeleteMellomlagringClick={() => {
        slettMellomlagring(() =>
          form.reset(grunnlag?.vurdering ? mapVurderingToDraftFormFields(grunnlag.vurdering) : emptyDraftFormFields())
        );
      }}
      visningModus={visningModus}
      visningActions={visningActions}
      formReset={() => form.reset(mellomlagretVurdering ? JSON.parse(mellomlagretVurdering.data) : undefined)}
    >
      {!!historiskeVurderinger?.length && (
        <TidligereVurderinger
          data={historiskeVurderinger}
          buildFelter={(vurdering) => byggFelter(vurdering, visAarsakDropdowns)}
          getErGjeldende={(v) => deepEqual(v, historiskeVurderinger.at(0))}
          getVurdertAvIdent={(v) => v.vurderingerMeta.vurdertAv?.ident ?? ''}
          getVurdertDato={(v) => v.vurderingerMeta.vurdertAv?.dato ?? ''}
          getFomDato={(v) => v.vurderingerMeta.vurdertAv?.dato}
          grupperPåOpprettetDato={true}
        />
      )}

      <FormField form={form} formField={formFields.nedsattArbeidsevneDatobegrunnelse} className="begrunnelse" />
      <FormField form={form} formField={formFields.nedsattArbeidsevneDato} />
      {erBeregningsTidspunktEtterSøknadstidspunkt && (
        <Alert variant={'warning'}>
          Du har satt beregningsdato etter søknadsdato. Hvis det er korrekt kan du bekrefte vilkåret.
        </Alert>
      )}
      {visAarsakDropdowns && (
        <div style={{ maxWidth: '90ch' }}>
          <FormField form={form} formField={formFields.årsak} />
        </div>
      )}
      {grunnlag?.skalVurdereYtterligere && (
        <div className={styles.ytterligerenedsattfelter}>
          <Heading size={'small'}>Tidspunktet da arbeidsevnen ble ytterligere nedsatt § 11-28</Heading>
          <FormField form={form} formField={formFields.ytterligereNedsattArbeidsevneDatobegrunnelse} />
          <FormField form={form} formField={formFields.ytterligereNedsattArbeidsevneDato} />
          {visAarsakDropdowns && <FormField form={form} formField={formFields.ytterligereNedsattÅrsak} />}
        </div>
      )}
      {erBeregningsTidspunktEtterVirkningsTidspunkt && (
        <Alert variant={'warning'}>
          Sjekk om beregningstidspunkt skal være datert etter tidspunkt for foreløpig virkningstidspunkt
        </Alert>
      )}
    </VilkårskortMedFormOgMellomlagring>
  );
};

function mapVurderingToDraftFormFields(vurdering: BeregningTidspunktGrunnlag['vurdering']): DraftFormFields {
  return {
    nedsattArbeidsevneDatobegrunnelse: vurdering?.begrunnelse ?? defaultNedsattArbeidsevneBegrunnelse,
    nedsattArbeidsevneDato: vurdering?.nedsattArbeidsevneDato
      ? formaterDatoForFrontend(vurdering.nedsattArbeidsevneDato)
      : undefined,
    årsak: vurdering?.årsak ?? undefined,
    ytterligereNedsattArbeidsevneDatobegrunnelse: getStringEllerUndefined(vurdering?.ytterligereNedsattBegrunnelse),
    ytterligereNedsattArbeidsevneDato: vurdering?.ytterligereNedsattArbeidsevneDato
      ? formaterDatoForFrontend(vurdering.ytterligereNedsattArbeidsevneDato)
      : undefined,
    ytterligereNedsattÅrsak: vurdering?.ytterligereNedsattÅrsak ?? undefined,
  };
}

function emptyDraftFormFields(): DraftFormFields {
  return {
    nedsattArbeidsevneDatobegrunnelse: defaultNedsattArbeidsevneBegrunnelse,
    nedsattArbeidsevneDato: '',
    årsak: '',
    ytterligereNedsattArbeidsevneDato: '',
    ytterligereNedsattArbeidsevneDatobegrunnelse: '',
    ytterligereNedsattÅrsak: '',
  };
}

const finnÅrsakLabel = (options: ValuePair[], value: string | null | undefined): string =>
  options.find((option) => option.value === value)?.label || '-';

const byggFelter = (vurdering: BeregningstidspunktVurderingResponse, visAarsak: boolean): ValuePair[] => [
  {
    label: 'Vilkårsvurdering',
    value: vurdering.begrunnelse,
  },
  {
    label: 'Datoen da arbeidsevnen ble nedsatt',
    value: vurdering.nedsattArbeidsevneDato ? formaterDatoForFrontend(vurdering.nedsattArbeidsevneDato) : '-',
  },
  ...(visAarsak
    ? [
        {
          label: 'Årsak til beregningstidspunkt.',
          value: finnÅrsakLabel(ALLE_ÅRSAK_TIL_BEREGNINGSTIDSPUNKT_LABELS, vurdering.årsak),
        },
      ]
    : []),
  {
    label: 'Vurder når brukeren fikk ytterligere nedsatt arbeidsevne',
    value: vurdering.ytterligereNedsattBegrunnelse || '-',
  },
  {
    label: 'Datoen da arbeidsevnen ble ytterligere nedsatt',
    value: vurdering.ytterligereNedsattArbeidsevneDato
      ? formaterDatoForFrontend(vurdering.ytterligereNedsattArbeidsevneDato)
      : '-',
  },
  ...(visAarsak
    ? [
        {
          label: 'Årsak til ytterligere nedsatt tidspunkt.',
          value: finnÅrsakLabel(ALLE_ÅRSAK_TIL_YTTERLIGERE_NEDSATT_LABELS, vurdering.ytterligereNedsattÅrsak),
        },
      ]
    : []),
];
