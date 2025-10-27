'use client';

import { Behovstype, getStringEllerUndefined } from 'lib/utils/form';
import { formaterDatoForBackend, formaterDatoForFrontend } from 'lib/utils/date';
import {
  BeregningstidspunktVurderingResponse,
  BeregningTidspunktGrunnlag,
  MellomlagretVurdering,
} from 'lib/types/types';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { FormEvent } from 'react';
import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import { isBefore, parse } from 'date-fns';
import { erDatoFoerDato, erDatoIFremtiden, validerDato } from 'lib/validation/dateValidation';
import styles from './FastsettBeregning.module.css';
import { Alert, Heading } from '@navikt/ds-react';
import { useConfigForm } from 'components/form/FormHook';
import { FormField, ValuePair } from 'components/form/FormField';
import { useSak } from 'hooks/SakHook';
import { TidligereVurderinger } from 'components/tidligerevurderinger/TidligereVurderinger';
import { deepEqual } from 'components/tidligerevurderinger/TidligereVurderingerUtils';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';
import { useVilkårskortVisning } from 'hooks/saksbehandling/visning/VisningHook';
import { VilkårskortMedFormOgMellomlagringNyVisning } from 'components/vilkårskort/vilkårskortmedformogmellomlagringnyvisning/VilkårskortMedFormOgMellomlagringNyVisning';

interface Props {
  grunnlag?: BeregningTidspunktGrunnlag;
  behandlingVersjon: number;
  readOnly: boolean;
  initialMellomlagretVurdering?: MellomlagretVurdering;
}

interface FormFields {
  nedsattArbeidsevneDatobegrunnelse: string;
  nedsattArbeidsevneDato: string;
  ytterligereNedsattArbeidsevneDato?: string;
  ytterligereNedsattArbeidsevneDatobegrunnelse?: string;
}

type DraftFormFields = Partial<FormFields>;

export const FastsettBeregning = ({ grunnlag, behandlingVersjon, readOnly, initialMellomlagretVurdering }: Props) => {
  const behandlingsReferanse = useBehandlingsReferanse();
  const { sak } = useSak();

  const { løsBehovOgGåTilNesteSteg, status, isLoading, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('FASTSETT_BEREGNINGSTIDSPUNKT');

  const { mellomlagretVurdering, nullstillMellomlagretVurdering, lagreMellomlagring, slettMellomlagring } =
    useMellomlagring(Behovstype.FASTSETT_BEREGNINGSTIDSPUNKT_KODE, initialMellomlagretVurdering);

  const { visningActions, formReadOnly, visningModus } = useVilkårskortVisning(
    readOnly,
    'FASTSETT_GRUNNLAG',
    mellomlagretVurdering
  );

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
    },
    { readOnly: formReadOnly }
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit(
      (data) => {
        løsBehovOgGåTilNesteSteg({
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
            },
          },
          referanse: behandlingsReferanse,
        });
      },
      () => nullstillMellomlagretVurdering()
    )(event);
  };

  const heading = grunnlag?.skalVurdereYtterligere
    ? '§ 11-19 Tidspunktet da arbeidsevnen ble nedsatt, jf. § 11-5 og § 11-28'
    : '§ 11-19 Tidspunktet da arbeidsevnen ble nedsatt, jf. § 11-5';

  const erBeregningsTidspunktEtterVirkningsTidspunkt =
    sak.virkningsTidspunkt !== null &&
    sak.virkningsTidspunkt &&
    form.watch('nedsattArbeidsevneDato') &&
    erDatoFoerDato(formaterDatoForFrontend(sak.virkningsTidspunkt), form.watch('nedsattArbeidsevneDato'));

  const historiskeVurderinger = grunnlag?.historiskeVurderinger;

  return (
    <VilkårskortMedFormOgMellomlagringNyVisning
      heading={heading}
      steg={'FASTSETT_BEREGNINGSTIDSPUNKT'}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      vilkårTilhørerNavKontor={false}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      status={status}
      visBekreftKnapp={!readOnly}
      vurdertAvAnsatt={grunnlag?.vurdering?.vurdertAv}
      mellomlagretVurdering={mellomlagretVurdering}
      onLagreMellomLagringClick={() => lagreMellomlagring(form.watch())}
      onDeleteMellomlagringClick={() => {
        slettMellomlagring(() =>
          form.reset(grunnlag?.vurdering ? mapVurderingToDraftFormFields(grunnlag.vurdering) : emptyDraftFormFields())
        );
      }}
      readOnly={readOnly}
      visningModus={visningModus}
      visningActions={visningActions}
    >
      {!!historiskeVurderinger?.length && (
        <TidligereVurderinger
          data={historiskeVurderinger}
          buildFelter={byggFelter}
          getErGjeldende={(v) => deepEqual(v, historiskeVurderinger[historiskeVurderinger.length - 1])}
          getFomDato={(v) => v.vurderingenGjelderFra ?? v.vurdertAv.dato}
          getVurdertAvIdent={(v) => v.vurdertAv.ident}
          getVurdertDato={(v) => v.vurdertAv.dato}
        />
      )}

      <FormField form={form} formField={formFields.nedsattArbeidsevneDatobegrunnelse} className="begrunnelse" />
      <FormField form={form} formField={formFields.nedsattArbeidsevneDato} />
      {grunnlag?.skalVurdereYtterligere && (
        <div className={styles.ytterligerenedsattfelter}>
          <Heading size={'small'}>Tidspunktet da arbeidsevnen ble ytterligere nedsatt § 11-28</Heading>
          <FormField
            form={form}
            formField={formFields.ytterligereNedsattArbeidsevneDatobegrunnelse}
            className={'begrunnelse'}
          />
          <FormField form={form} formField={formFields.ytterligereNedsattArbeidsevneDato} />
        </div>
      )}
      {erBeregningsTidspunktEtterVirkningsTidspunkt && (
        <Alert variant={'warning'} size={'small'}>
          Sjekk om beregningstidspunkt skal være datert etter tidspunkt for foreløpig virkningstidspunkt
        </Alert>
      )}
    </VilkårskortMedFormOgMellomlagringNyVisning>
  );
};

function mapVurderingToDraftFormFields(vurdering: BeregningTidspunktGrunnlag['vurdering']): DraftFormFields {
  return {
    nedsattArbeidsevneDatobegrunnelse: vurdering?.begrunnelse,
    nedsattArbeidsevneDato: vurdering?.nedsattArbeidsevneDato
      ? formaterDatoForFrontend(vurdering.nedsattArbeidsevneDato)
      : undefined,
    ytterligereNedsattArbeidsevneDatobegrunnelse: getStringEllerUndefined(vurdering?.ytterligereNedsattBegrunnelse),
    ytterligereNedsattArbeidsevneDato: vurdering?.ytterligereNedsattArbeidsevneDato
      ? formaterDatoForFrontend(vurdering.ytterligereNedsattArbeidsevneDato)
      : undefined,
  };
}

function emptyDraftFormFields(): DraftFormFields {
  return {
    nedsattArbeidsevneDatobegrunnelse: '',
    nedsattArbeidsevneDato: '',
    ytterligereNedsattArbeidsevneDato: '',
    ytterligereNedsattArbeidsevneDatobegrunnelse: '',
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
    label: 'Vurder når brukeren fikk ytterligere nedsatt arbeidsevne',
    value: vurdering.ytterligereNedsattBegrunnelse || '-',
  },
  {
    label: 'Datoen da arbeidsevnen ble ytterligere nedsatt',
    value: vurdering.ytterligereNedsattArbeidsevneDato
      ? formaterDatoForFrontend(vurdering.ytterligereNedsattArbeidsevneDato)
      : '-',
  },
];
