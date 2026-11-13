import { BodyShort, Button, Dialog } from '@navikt/ds-react';
import { TrashIcon } from '@navikt/aksel-icons';
import { useForm } from 'react-hook-form';
import { TextAreaWrapper } from 'components/form/textareawrapper/TextAreaWrapper';

interface Props {
  isOpen: boolean;
  onDelete: (form: IkkeSendFields) => void;
  onClose: () => void;
}
export interface IkkeSendFields {
  begrunnelse: string;
}

export const IkkeSendBrevModal = ({ isOpen, onClose, onDelete }: Props) => {
  const localForm = useForm<IkkeSendFields>();
  const { control, handleSubmit, trigger } = localForm;
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <Dialog.Popup width="large" closeOnOutsideClick={false}>
        <Dialog.Header>
          <Dialog.Title>Ikke send brev</Dialog.Title>
        </Dialog.Header>
        <Dialog.Body>
          <BodyShort spacing>
            Denne handlingen skal kun brukes i tilfeller hvor det ikke er behov for å sende brev til bruker.
          </BodyShort>
          <TextAreaWrapper
            label={'Begrunnelse'}
            name={'begrunnelse'}
            control={control}
            rules={{ required: 'Du må gi en begrunnelse for hvorfor brevet ikke skal sendes.' }}
            onChangeCustom={async () => {
              await trigger('begrunnelse');
            }}
          />
        </Dialog.Body>
        <Dialog.Footer>
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
        </Dialog.Footer>
      </Dialog.Popup>
    </Dialog>
  );
};
