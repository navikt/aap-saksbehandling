import { SaksInfo } from 'lib/types/types';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { Button, HStack } from '@navikt/ds-react';
import { isLocal } from 'lib/utils/environment';
import { BestillBrevTestKnapp } from 'components/behandlinger/brev/BestillBrevTestKnapp';
import { ExternalLinkIcon, EyeIcon } from '@navikt/aksel-icons';
import { BehandlingsflytEllerPostmottakBehandling } from './types';

const lokalBrevBestillingKnapp = isLocal();
export const BehandlingButtons = ({
  sak,
  behandling,
}: {
  sak: SaksInfo;
  behandling: BehandlingsflytEllerPostmottakBehandling;
}) => {
  const router = useRouter();
  const [isPendingBehandling, startTransitionBehandling] = useTransition();
  const behandlingErÅpen = behandling.behandling.status === 'OPPRETTET' || behandling.behandling.status === 'UTREDES';
  async function gåTilBehandling(behandlingsReferanse: string) {
    startTransitionBehandling(async () => {
      const internUrl = `/saksbehandling/sak/${sak.saksnummer}/${behandlingsReferanse}`;
      router.push(internUrl);
    });
  }

  async function gåTilPostmottakBehandling(behandlingsReferanse: string) {
    startTransitionBehandling(async () => {
      const internUrl = `/postmottak/${behandlingsReferanse}`;
      router.push(internUrl);
    });
  }

  return (
    <HStack gap="2" justify="end">
      {lokalBrevBestillingKnapp && <BestillBrevTestKnapp behandlingReferanse={behandling.behandling.referanse} />}
      {behandling.kilde === 'BEHANDLINGSFLYT' && behandling.behandling.eksternSaksbehandlingsløsningUrl ? (
        <Button
          as="a"
          type={'button'}
          size="small"
          href={behandling.behandling.eksternSaksbehandlingsløsningUrl}
          target="_blank"
          rel="noreferrer noopener"
          loading={isPendingBehandling}
          variant={behandlingErÅpen ? 'primary' : 'secondary'}
          icon={<ExternalLinkIcon aria-hidden />}
          title={'Gå til behandling'}
        >
          {behandlingErÅpen ? 'Åpne' : 'Vis'}
        </Button>
      ) : behandling.kilde === 'BEHANDLINGSFLYT' ? (
        <Button
          size="small"
          type={'button'}
          icon={!behandlingErÅpen && <EyeIcon />}
          onClick={() => gåTilBehandling(behandling.behandling.referanse)}
          variant={behandlingErÅpen ? 'primary' : 'secondary'}
          loading={isPendingBehandling}
        >
          {behandlingErÅpen ? 'Åpne' : 'Vis'}
        </Button>
      ) : (
        <Button
          size="small"
          type={'button'}
          icon={!behandlingErÅpen && <EyeIcon />}
          onClick={() => gåTilPostmottakBehandling(behandling.behandling.referanse)}
          variant={behandlingErÅpen ? 'primary' : 'secondary'}
          loading={isPendingBehandling}
        >
          {behandlingErÅpen ? 'Åpne' : 'Vis'}
        </Button>
      )}
    </HStack>
  );
};
