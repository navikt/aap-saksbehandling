import { Button, Modal } from '@navikt/ds-react';
import { FormField } from 'components/form/FormField';
import { useConfigForm } from 'components/form/FormHook';

import styles from './TrekkSøknad.module.css';
import { XMarkOctagonIcon } from '@navikt/aksel-icons';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const TrekkSøknad = ({ isOpen, onClose }: Props) => {
  const { form, formFields } = useConfigForm({
    begrunnelse: {
      type: 'textarea',
      label: 'Begrunnelse',
      rules: { required: 'Du må begrunne hvorfor søknaden skal trekkes' },
    },
  });

  return (
    <Modal
      header={{ icon: <XMarkOctagonIcon title="" fontSize="1.5rem" />, heading: 'Trekk søknad' }}
      open={isOpen}
      onClose={onClose}
      className={styles.modal}
    >
      <Modal.Body>
        <form id={'trekkSøknad'} onSubmit={form.handleSubmit(async (data) => console.log(data))}>
          <FormField form={form} formField={formFields.begrunnelse} />
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button form={'trekkSøknad'} className={'fit-content'}>
          Trekk søknad
        </Button>
        <Button variant={'secondary'} onClick={onClose} type="button">
          Avbryt
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
