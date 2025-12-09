import { BehandlingInfo, SaksInfo } from 'lib/types/types';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { Button, HStack } from '@navikt/ds-react';
import { isLocal } from 'lib/utils/environment';
import { BestillBrevTestKnapp } from 'components/behandlinger/brev/BestillBrevTestKnapp';
import { ExternalLinkIcon, EyeIcon } from '@navikt/aksel-icons';

const lokalBrevBestillingKnapp = isLocal();
export const BehandlingButtons = ({ sak, behandling }: { sak: SaksInfo; behandling: BehandlingInfo }) => {
  const router = useRouter();
  const [isPendingBehandling, startTransitionBehandling] = useTransition();
  const behandlingErÅpen = behandling.status === 'OPPRETTET' || behandling.status === 'UTREDES';
  async function gåTilBehandling(behandlingsReferanse: string) {
    startTransitionBehandling(async () => {
      const internUrl = `/saksbehandling/sak/${sak.saksnummer}/${behandlingsReferanse}`;
      router.push(internUrl);
    });
  }

  return (
    <HStack gap="2" justify="end">
      {lokalBrevBestillingKnapp && <BestillBrevTestKnapp behandlingReferanse={behandling.referanse} />}
      {behandling.eksternSaksbehandlingsløsningUrl ? (
        <Button
          as="a"
          type={'button'}
          size="small"
          href={behandling.eksternSaksbehandlingsløsningUrl}
          target="_blank"
          rel="noreferrer noopener"
          loading={isPendingBehandling}
          variant={behandlingErÅpen ? 'primary' : 'secondary'}
          icon={<ExternalLinkIcon aria-hidden />}
          title={'Gå til behandling'}
        >
          {behandlingErÅpen ? 'Åpne' : 'Vis'}
        </Button>
      ) : (
        <Button
          size="small"
          type={'button'}
          icon={!behandlingErÅpen && <EyeIcon />}
          onClick={() => gåTilBehandling(behandling.referanse)}
          variant={behandlingErÅpen ? 'primary' : 'secondary'}
          loading={isPendingBehandling}
        >
          {behandlingErÅpen ? 'Åpne' : 'Vis'}
        </Button>
      )}
    </HStack>
  );
};
