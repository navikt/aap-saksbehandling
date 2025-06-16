'use client';

import { Behovstype, getStringEllerUndefined } from 'lib/utils/form';
import { formaterDatoForBackend, formaterDatoForFrontend } from 'lib/utils/date';
import { BeregningTidspunktGrunnlag } from 'lib/types/types';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { FormEvent } from 'react';
import { useBehandlingsReferanse } from 'hooks/BehandlingHook';
import { isBefore, parse } from 'date-fns';
import { erDatoFoerDato, erDatoIFremtiden, validerDato } from 'lib/validation/dateValidation';
import styles from './FastsettBeregning.module.css';
import { Alert, Heading } from '@navikt/ds-react';
import { useConfigForm } from 'components/form/FormHook';
import { FormField } from 'components/form/FormField';
import { VilkårsKortMedForm } from 'components/vilkårskort/vilkårskortmedform/VilkårsKortMedForm';
import { useSak } from '../../../../hooks/SakHook';

interface Props {
  grunnlag?: BeregningTidspunktGrunnlag;
  behandlingVersjon: number;
  readOnly: boolean;
}

interface FormFields {
  nedsattArbeidsevneDatobegrunnelse: string;
  nedsattArbeidsevneDato: string;
  ytterligereNedsattArbeidsevneDato?: string;
  ytterligereNedsattArbeidsevneDatobegrunnelse?: string;
}

export const FastsettBeregning = ({ grunnlag, behandlingVersjon, readOnly }: Props) => {
  const behandlingsReferanse = useBehandlingsReferanse();
  const { sak } = useSak();

  const { løsBehovOgGåTilNesteSteg, status, isLoading, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('FASTSETT_BEREGNINGSTIDSPUNKT');

  const { formFields, form } = useConfigForm<FormFields>(
    {
      nedsattArbeidsevneDatobegrunnelse: {
        type: 'textarea',
        label: 'Vilkårsvurdering',
        defaultValue: getStringEllerUndefined(grunnlag?.vurdering?.begrunnelse),
        rules: { required: 'Du må skrive en begrunnelse for når bruker fikk nedsatt arbeidsevne' },
      },
      nedsattArbeidsevneDato: {
        type: 'date_input',
        label: 'Dato når arbeidsevnen ble nedsatt',
        defaultValue: grunnlag?.vurdering?.nedsattArbeidsevneDato
          ? formaterDatoForFrontend(grunnlag?.vurdering.nedsattArbeidsevneDato)
          : undefined,
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
        label: 'Vurder når bruker fikk ytterligere nedsatt arbeidsevne',
        defaultValue: getStringEllerUndefined(grunnlag?.vurdering?.ytterligereNedsattBegrunnelse),
        rules: { required: 'Du må skrive en begrunnelse for når bruker fikk ytterligere nedsatt arbeidsevne' },
      },
      ytterligereNedsattArbeidsevneDato: {
        type: 'date_input',
        label: 'Dato arbeidsevnen ble ytterligere nedsatt',
        defaultValue: grunnlag?.vurdering?.ytterligereNedsattArbeidsevneDato
          ? formaterDatoForFrontend(grunnlag?.vurdering.ytterligereNedsattArbeidsevneDato)
          : undefined,
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
    { readOnly: readOnly }
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit((data) => {
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
    })(event);
  };

  const heading = grunnlag?.skalVurdereYtterligere
    ? '§ 11-19 Tidspunktet for når arbeidsevnen ble nedsatt, jf. § 11-5 og § 11-28'
    : '§ 11-19 Tidspunktet for når arbeidsevnen ble nedsatt, jf. § 11-5';

  const erBeregningsTidspunktEtterVirkningsTidspunkt =
    sak.virkningsTidspunkt !== null &&
    sak.virkningsTidspunkt &&
    form.watch('nedsattArbeidsevneDato') &&
    erDatoFoerDato(formaterDatoForFrontend(sak.virkningsTidspunkt), form.watch('nedsattArbeidsevneDato'));

  return (
    <VilkårsKortMedForm
      heading={heading}
      steg={'FASTSETT_BEREGNINGSTIDSPUNKT'}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      vilkårTilhørerNavKontor={false}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      status={status}
      visBekreftKnapp={!readOnly}
      erAktivtSteg={true}
      vurdertAvAnsatt={grunnlag?.vurdering?.vurdertAv}
    >
      <FormField form={form} formField={formFields.nedsattArbeidsevneDatobegrunnelse} className="begrunnelse" />
      <FormField form={form} formField={formFields.nedsattArbeidsevneDato} />

      {grunnlag?.skalVurdereYtterligere && (
        <div className={styles.ytterligerenedsattfelter}>
          <Heading size={'small'}>Tidspunkt arbeidsevne ble ytterligere nedsatt § 11-28</Heading>
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
    </VilkårsKortMedForm>
  );
};
