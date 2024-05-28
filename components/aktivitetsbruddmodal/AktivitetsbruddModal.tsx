import { HourglassBottomFilledIcon } from '@navikt/aksel-icons';
import styles from './AktivitetsbruddModal.module.css';
import React, { Dispatch } from 'react';
import { Button, Modal } from '@navikt/ds-react';
import { FormField } from 'components/input/formfield/FormField';
import { JaEllerNei, JaEllerNeiOptions } from 'lib/utils/form';
import { useConfigForm } from 'hooks/FormHook';

interface Props {
  isOpen: boolean;
  setIsOpen: Dispatch<boolean>;
}
interface FormFields {
  begrunnelse: string;
  aktivitetspliktOppfylt: string;
  grunn?: string;
  paragraf?: string;
  forhåndsVarsel?: string;
  dato?: Date;
}
export const AktivitetsbruddModal = ({ isOpen, setIsOpen }: Props) => {
  const { form, formFields } = useConfigForm<FormFields>({
    begrunnelse: {
      type: 'textarea',
      label: 'Begrunnelse',
      description: 'Skriv begrunnelse og henvis til kilde/dokumentasjon',
      rules: { required: 'Du må begrunne' },
    },
    aktivitetspliktOppfylt: {
      type: 'radio',
      label: 'Er aktivitetsplikt oppfylt?',
      rules: { required: 'Du må svare på om vilkåret er oppfyllt' },
      options: JaEllerNeiOptions,
    },
    grunn: {
      type: 'checkbox',
      label: 'Årsak',
      options: [
        'Ikke møtt til møte med Nav (§§ 11-8, 11-9)',
        'Ikke møtt i behandling (§§ 11-8, 11-9)',
        'Ikke møtt i tiltak (§§ 11-8, 11-9)',
        'Bruker har ikke sendt inn dokumentasjon som Nav har bedt om (§§ 11-8, 11-9)',
        'Ikke bidratt til egen avklaring (§ 11-7)',
      ],
    },
    forhåndsVarsel: {
      type: 'radio',
      label: 'Skal det sendes forhåndsvarsel til AAP-mottager',
      options: JaEllerNeiOptions,
    },
    paragraf: {
      type: 'radio',
      label: 'Hvilken paragraf?',
      options: ['§ 11-7', '§ 11-8', '§ 11-9'],
    },
    dato: {
      type: 'date',
      label: 'Dato',
    },
  });
  const aktivitetspliktOppfylt = form.watch('aktivitetspliktOppfylt');
  const buttonText = 'Send inn';
  return (
    <Modal
      open={isOpen}
      onClose={() => setIsOpen(false)}
      header={{ heading: 'Vurder aktivitetsplikt', icon: <HourglassBottomFilledIcon /> }}
      className={styles.settBehandlingPåVentModal}
    >
      <Modal.Body>
        <form className={styles.aktivitetForm}>
          <FormField form={form} formField={formFields.aktivitetspliktOppfylt} />
          <FormField form={form} formField={formFields.dato} />
          {aktivitetspliktOppfylt === JaEllerNei.Nei && (
            <>
              <FormField form={form} formField={formFields.grunn} />
              <FormField form={form} formField={formFields.begrunnelse} />
              <FormField form={form} formField={formFields.paragraf} />
              <FormField form={form} formField={formFields.forhåndsVarsel} />
            </>
          )}
          <Button className={'fit-content-button'}>{buttonText}</Button>
        </form>
      </Modal.Body>
    </Modal>
  );
};
