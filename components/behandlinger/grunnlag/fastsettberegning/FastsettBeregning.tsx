'use client';

import { FormField, useConfigForm } from '@navikt/aap-felles-react';
import { Form } from 'components/form/Form';
import { Behovstype, getStringEllerUndefined } from 'lib/utils/form';
import { formaterDatoForBackend, formaterDatoForFrontend } from 'lib/utils/date';
import { BeregningTidspunktGrunnlag } from 'lib/types/types';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { FormEvent } from 'react';
import { useBehandlingsReferanse } from 'hooks/BehandlingHook';
import { isBefore, parse } from 'date-fns';
import { validerDato } from 'lib/validation/dateValidation';
import { Veiledning } from 'components/veiledning/Veiledning';
import styles from './FastsettBeregning.module.css';
import { Heading } from '@navikt/ds-react';
import { CalendarIcon } from '@navikt/aksel-icons';
import { VilkårsKortForUvisstEnhet } from 'components/vilkårskort/VilkårskortForUvisstEnhet';

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
  const { løsBehovOgGåTilNesteSteg, status, isLoading } = useLøsBehovOgGåTilNesteSteg('FASTSETT_BEREGNINGSTIDSPUNKT');

  const { formFields, form } = useConfigForm<FormFields>(
    {
      nedsattArbeidsevneDatobegrunnelse: {
        type: 'textarea',
        label: 'Vurder når innbygger fikk nedsatt arbeidsevne',
        defaultValue: getStringEllerUndefined(grunnlag?.vurdering?.begrunnelse),
        rules: { required: 'Du må skrive en begrunnelse for når innbygger fikk nedsatt arbeidsevne' },
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
        label: 'Vurder når innbygger fikk ytterligere nedsatt arbeidsevne',
        defaultValue: getStringEllerUndefined(grunnlag?.vurdering?.ytterligereNedsattBegrunnelse),
        rules: { required: 'Du må skrive en begrunnelse for når innbygger fikk ytterligere nedsatt arbeidsevne' },
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
      console.log(data);
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
    ? 'Beregningstidspunkt nedsatt arbeidsevne og ytterligere nedsatt arbeidsevne § 11-5'
    : 'Beregningstidspunkt nedsatt arbeidsevne § 11-5';

  return (
    <VilkårsKortForUvisstEnhet heading={heading} steg={'FASTSETT_BEREGNINGSTIDSPUNKT'} icon={<CalendarIcon />}>
      <Form
        steg={'FASTSETT_BEREGNINGSTIDSPUNKT'}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        status={status}
        visBekreftKnapp={!readOnly}
      >
        <Veiledning header={'Slik vurderes vilkåret for tidspunkt for nedsatt arbeidsevne'} />
        <FormField form={form} formField={formFields.nedsattArbeidsevneDatobegrunnelse} className="begrunnelse" />
        <FormField form={form} formField={formFields.nedsattArbeidsevneDato} />

        {grunnlag?.skalVurdereYtterligere && (
          <div className={styles.ytterligerenedsattfelter}>
            <Heading size={'small'}>Tidspunkt arbeidsevne ble ytterligere nedsatt § 11-28</Heading>
            <Veiledning header={'Slik vurderes vilkåret for tidspunkt for ytterligere nedsatt arbeidsevne'} />
            <FormField
              form={form}
              formField={formFields.ytterligereNedsattArbeidsevneDatobegrunnelse}
              className={'begrunnelse'}
            />
            <FormField form={form} formField={formFields.ytterligereNedsattArbeidsevneDato} />
          </div>
        )}
      </Form>
    </VilkårsKortForUvisstEnhet>
  );
};
