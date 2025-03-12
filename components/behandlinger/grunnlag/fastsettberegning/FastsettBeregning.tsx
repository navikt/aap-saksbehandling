'use client';

import { Form } from 'components/form/Form';
import { Behovstype, getStringEllerUndefined } from 'lib/utils/form';
import { formaterDatoForBackend, formaterDatoForFrontend } from 'lib/utils/date';
import { BeregningTidspunktGrunnlag } from 'lib/types/types';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { FormEvent } from 'react';
import { useBehandlingsReferanse } from 'hooks/BehandlingHook';
import { isBefore, parse } from 'date-fns';
import { validerDato } from 'lib/validation/dateValidation';
import styles from './FastsettBeregning.module.css';
import { Heading } from '@navikt/ds-react';
import { CalendarIcon } from '@navikt/aksel-icons';
import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { useConfigForm } from 'components/form/FormHook';
import { FormField } from 'components/form/FormField';

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
  const { løsBehovOgGåTilNesteSteg, status, resetStatus, isLoading } =
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
            if (valideringsresultat) {
              return valideringsresultat;
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

  return (
    <VilkårsKort heading={heading} steg={'FASTSETT_BEREGNINGSTIDSPUNKT'} icon={<CalendarIcon aria-hidden />}>
      <Form
        steg={'FASTSETT_BEREGNINGSTIDSPUNKT'}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        status={status}
        resetStatus={resetStatus}
        visBekreftKnapp={!readOnly}
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
      </Form>
    </VilkårsKort>
  );
};
