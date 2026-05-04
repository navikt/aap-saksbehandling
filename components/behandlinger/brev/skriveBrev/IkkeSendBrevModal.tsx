import { BodyShort, Button, Modal } from '@navikt/ds-react';
import { TrashIcon } from '@navikt/aksel-icons';
import { useForm } from 'react-hook-form';
import { TextAreaWrapper } from 'components/form/textareawrapper/TextAreaWrapper';
import { useFeatureFlag } from 'context/UnleashContext';

interface Props {
  isOpen: boolean;
  onDelete: (form: IkkeSendFields) => void;
  onClose: () => void;
}
export interface IkkeSendFields {
  begrunnelse: string;
}

export const IkkeSendBrevModal = ({ isOpen, onClose, onDelete }: Props) => {
  const krevBegrunnelse = useFeatureFlag('BegrunnelseForIkkeSendBrev');
  const localForm = useForm<IkkeSendFields>();
  const { control, handleSubmit, trigger } = localForm;
  return (
    <Modal open={isOpen} onClose={onClose} header={{ heading: 'Ikke send brev' }}>
      <Modal.Body>
        <BodyShort spacing>
          Denne handlingen skal kun brukes i tilfeller hvor det ikke er behov for å sende brev til bruker.
        </BodyShort>
        {krevBegrunnelse && (
          <TextAreaWrapper
            label={'Begrunnelse'}
            name={'begrunnelse'}
            control={control}
            rules={{ required: 'Du må gi en begrunnelse for hvorfor brevet ikke skal sendes.' }}
            onChangeCustom={async () => {
              await trigger('begrunnelse');
            }}
          />
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose}>Lukk</Button>
        <Button
          data-color="danger"
          variant="primary"
          icon={<TrashIcon />}
          onClick={async () => {
            const isValid = await trigger();
            if (isValid) {
              await handleSubmit(onDelete)();
            }
          }}
        >
          Ikke send brev
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
