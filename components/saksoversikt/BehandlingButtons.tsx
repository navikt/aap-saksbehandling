import { Behandlingsstatus, SaksInfo } from 'lib/types/types';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { Button, HStack } from '@navikt/ds-react';
import { isLocal } from 'lib/utils/environment';
import { BestillBrevTestKnapp } from 'components/behandlinger/brev/BestillBrevTestKnapp';
import { EyeIcon } from '@navikt/aksel-icons';

export const BehandlingButtons = ({
  sak,
  behandlingsReferanse,
  behandlingsstatus,
}: {
  sak: SaksInfo;
  behandlingsReferanse: string;
  behandlingsstatus: Behandlingsstatus;
}) => {
  const router = useRouter();
  const [isPendingBehandling, startTransitionBehandling] = useTransition();
  const behandlingErÅpen = behandlingsstatus === 'OPPRETTET' || behandlingsstatus === 'UTREDES';

  async function gåTilBehandling(behandlingsReferanse: string) {
    startTransitionBehandling(async () => {
      router.push(`/saksbehandling/sak/${sak.saksnummer}/${behandlingsReferanse}`);
    });
  }

  return (
    <HStack gap="2" justify="end">
      {isLocal() && <BestillBrevTestKnapp behandlingReferanse={behandlingsReferanse} />}
      <Button
        size="small"
        type={'button'}
        icon={!behandlingErÅpen && <EyeIcon />}
        onClick={() => gåTilBehandling(behandlingsReferanse)}
        variant={behandlingErÅpen ? 'primary' : 'secondary'}
        loading={isPendingBehandling}
      >
        {behandlingErÅpen ? 'Åpne' : 'Vis'}
      </Button>
    </HStack>
  );
};
