'use client';

import { Behovstype, getStringEllerUndefined } from 'lib/utils/form';
import { formaterDatoForBackend, formaterDatoForFrontend, sorterEtterNyesteDato } from 'lib/utils/date';
import {
  BeregningstidspunktVurderingResponse,
  BeregningTidspunktGrunnlag,
  MellomlagretVurdering,
} from 'lib/types/types';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { SubmitEventHandler } from 'react';
import { useParamsMedType } from 'hooks/saksbehandling/BehandlingHook';
import { isBefore, parse } from 'date-fns';
import { erDatoFoerDato, erDatoIFremtiden, validerDato } from 'lib/validation/dateValidation';
import styles from './FastsettBeregning.module.css';
import { Heading } from '@navikt/ds-react';
import { useConfigForm } from 'components/form/FormHook';
import { FormField, ValuePair } from 'components/form/FormField';
import { useSak } from 'hooks/SakHook';
import { TidligereVurderinger } from 'components/tidligerevurderinger/TidligereVurderinger';
import { deepEqual } from 'components/tidligerevurderinger/TidligereVurderingerUtils';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';
import { useVilkårskortVisning } from 'hooks/saksbehandling/visning/VisningHook';
import { VilkårskortMedFormOgMellomlagring } from 'components/vilkårskort/vilkårskortmedformogmellomlagring/VilkårskortMedFormOgMellomlagring';
import { loggUmamiVarighet, useUmamiStartTidspunkt } from 'lib/utils/umami';
import { Alert } from 'components/alert/Alert';

interface Props {
  grunnlag?: BeregningTidspunktGrunnlag;
  behandlingVersjon: number;
  readOnly: boolean;
  initialMellomlagretVurdering?: MellomlagretVurdering;
}

const ÅRSAK_TIL_BEREGNINGSTIDSPUNKT_OPTIONS = [
  { label: '', value: '' },
  { label: 'Sykemeldingsdato', value: 'SYKEMELDINGSDATO' },
  { label: 'Kravdato', value: 'KRAVDATO' },
  { label: 'Dato på legeerklæring', value: 'DATO_PAA_LEGEERKLÆRING' },
  { label: 'Henvist til behandling', value: 'HENVIST_TIL_BEHANDLING' },
  { label: '16 år som beregningstidspunkt', value: 'SEKSTEN_ÅR_SOM_BEREGNINGSTIDSPUNKT' },
  { label: 'Annet', value: 'ANNET' },
];

const ÅRSAK_TIL_YTTERLIGERE_NEDSATT_OPTIONS = [
  { label: '', value: '' },
  { label: 'Uføretidspunkt', value: 'UFØRETIDSPUNKT' },
  { label: 'Ytterligere nedsatt', value: 'YTTERLIGERE_NEDSATT' },
  { label: 'Økt uføregrad', value: 'ØKT_UFØREGRAD' },
  { label: 'Ikke betydning / ikke relevant', value: 'IKKE_BETYDNING_IKKE_RELEVANT' },
  { label: 'Annet', value: 'ANNET' },
];

interface FormFields {
  nedsattArbeidsevneDatobegrunnelse: string;
  nedsattArbeidsevneDato: string;
  årsak: string;
  ytterligereNedsattArbeidsevneDato?: string;
  ytterligereNedsattArbeidsevneDatobegrunnelse?: string;
  ytterligereNedsattÅrsak?: string;
}

type DraftFormFields = Partial<FormFields>;

export const FastsettBeregning = ({ grunnlag, behandlingVersjon, readOnly, initialMellomlagretVurdering }: Props) => {
  const { behandlingsreferanse } = useParamsMedType();
  const { sak } = useSak();

  const { løsBehovOgGåTilNesteSteg, status, isLoading, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('FASTSETT_BEREGNINGSTIDSPUNKT');

  const { visningActions, formReadOnly, visningModus } = useVilkårskortVisning(
    readOnly,
    'FASTSETT_BEREGNINGSTIDSPUNKT',
    initialMellomlagretVurdering
  );
  const umamiStartTidspunkt = useUmamiStartTidspunkt(visningModus);

  const defaultValues: DraftFormFields = initialMellomlagretVurdering
    ? JSON.parse(initialMellomlagretVurdering.data)
    : mapVurderingToDraftFormFields(grunnlag?.vurdering);

  const { formFields, form } = useConfigForm<FormFields>(
    {
      nedsattArbeidsevneDatobegrunnelse: {
        type: 'textarea',
        label: 'Vilkårsvurdering',
        defaultValue: defaultValues.nedsattArbeidsevneDatobegrunnelse,
        rules: { required: 'Du må skrive en begrunnelse for når brukeren fikk nedsatt arbeidsevne' },
      },
      nedsattArbeidsevneDato: {
        type: 'date_input',
        label: 'Datoen da arbeidsevnen ble nedsatt',
        defaultValue: defaultValues.nedsattArbeidsevneDato,
        rules: {
          validate: (value) => {
            const valideringsresultat = validerDato(value as string);
            const datoErFremITid = erDatoIFremtiden(value as string);

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
        options: ÅRSAK_TIL_BEREGNINGSTIDSPUNKT_OPTIONS,
        defaultValue: defaultValues.årsak,
        rules: { required: 'Du må velge årsak til beregningstidspunkt' },
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
            const valideringsresultat = validerDato(value as string);
            if (valideringsresultat) {
              return valideringsresultat;
            }

            if (value && isBefore(new Date(value as string), new Date(formValues.nedsattArbeidsevneDato))) {
              return 'Ytterligere nedsatt dato kan ikke være før datoen arbeidsevnen ble nedsatt';
            }
          },
        },
      },
      ytterligereNedsattÅrsak: {
        type: 'select',
        label: 'Årsak til ytterligere nedsatt tidspunkt',
        options: ÅRSAK_TIL_YTTERLIGERE_NEDSATT_OPTIONS,
        defaultValue: defaultValues.ytterligereNedsattÅrsak,
        rules: { required: 'Du må velge årsak til ytterligere nedsatt tidspunkt' },
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
      løsBehovOgGåTilNesteSteg(
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
              årsak: data.årsak || undefined,
              ytterligereNedsattÅrsak: data.ytterligereNedsattÅrsak || undefined,
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

  const historiskeVurderinger = grunnlag?.historiskeVurderinger.sort((a, b) => {
    return sorterEtterNyesteDato(a.vurderingerMeta.vurdertAv?.dato ?? '', b.vurderingerMeta.vurdertAv?.dato ?? '');
  });

  return (
    <VilkårskortMedFormOgMellomlagring
      heading={heading}
      steg={'FASTSETT_BEREGNINGSTIDSPUNKT'}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      vilkårTilhørerNavKontor={false}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      status={status}
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
          buildFelter={byggFelter}
          getErGjeldende={(v) => deepEqual(v, historiskeVurderinger.at(0))}
          getVurdertAvIdent={(v) => v.vurderingerMeta.vurdertAv?.ident ?? ''}
          getVurdertDato={(v) => v.vurderingerMeta.vurdertAv?.dato ?? ''}
          getFomDato={(v) => v.vurderingerMeta.vurdertAv?.dato}
          grupperPåOpprettetDato={true}
        />
      )}

      <FormField form={form} formField={formFields.nedsattArbeidsevneDatobegrunnelse} className="begrunnelse" />
      <FormField form={form} formField={formFields.nedsattArbeidsevneDato} />
      <FormField form={form} formField={formFields.årsak} />
      {grunnlag?.skalVurdereYtterligere && (
        <div className={styles.ytterligerenedsattfelter}>
          <Heading size={'small'}>Tidspunktet da arbeidsevnen ble ytterligere nedsatt § 11-28</Heading>
          <FormField form={form} formField={formFields.ytterligereNedsattArbeidsevneDatobegrunnelse} />
          <FormField form={form} formField={formFields.ytterligereNedsattArbeidsevneDato} />
          <FormField form={form} formField={formFields.ytterligereNedsattÅrsak} />
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
    nedsattArbeidsevneDatobegrunnelse: vurdering?.begrunnelse,
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
    nedsattArbeidsevneDatobegrunnelse: '',
    nedsattArbeidsevneDato: '',
    årsak: '',
    ytterligereNedsattArbeidsevneDato: '',
    ytterligereNedsattArbeidsevneDatobegrunnelse: '',
    ytterligereNedsattÅrsak: '',
  };
}

const byggFelter = (vurdering: BeregningstidspunktVurderingResponse): ValuePair[] => [
  {
    label: 'Vilkårsvurdering',
    value: vurdering.begrunnelse,
  },
  {
    label: 'Datoen da arbeidsevnen ble nedsatt',
    value: vurdering.nedsattArbeidsevneDato ? formaterDatoForFrontend(vurdering.nedsattArbeidsevneDato) : '-',
  },
  {
    label: 'Årsak til beregningstidspunkt',
    value: ÅRSAK_TIL_BEREGNINGSTIDSPUNKT_OPTIONS.find((o) => o.value === vurdering.årsak)?.label ?? '-',
  },
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
  {
    label: 'Årsak til ytterligere nedsatt tidspunkt',
    value:
      ÅRSAK_TIL_YTTERLIGERE_NEDSATT_OPTIONS.find((o) => o.value === vurdering.ytterligereNedsattÅrsak)?.label ?? '-',
  },
];
