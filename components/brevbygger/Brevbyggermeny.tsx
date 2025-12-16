import { ChevronDownIcon, RecycleIcon, TrashIcon } from '@navikt/aksel-icons';
import { ActionMenu, Button } from '@navikt/ds-react';

interface Props {
  visAvbryt: boolean;
  oppdaterBrevmal: () => void;
  settIkkeSendBrevModalOpen: (value: boolean) => void;
}

export const Brevbyggermeny = ({ visAvbryt, oppdaterBrevmal, settIkkeSendBrevModalOpen }: Props) => {
  return (
    <ActionMenu>
      <ActionMenu.Trigger>
        <Button variant="secondary-neutral" icon={<ChevronDownIcon aria-hidden />} iconPosition="right">
          Andre handlinger
        </Button>
      </ActionMenu.Trigger>
      <ActionMenu.Content>
        <ActionMenu.Item icon={<RecycleIcon />} onSelect={() => oppdaterBrevmal()}>
          Oppdater brevmal
        </ActionMenu.Item>
        {visAvbryt && (
          <ActionMenu.Item variant="danger" icon={<TrashIcon />} onSelect={() => settIkkeSendBrevModalOpen(true)}>
            Ikke send brev
          </ActionMenu.Item>
        )}
      </ActionMenu.Content>
    </ActionMenu>
  );
};
