import { ChevronDownIcon } from '@navikt/aksel-icons';
import { Button, Dropdown, HStack, Loader } from '@navikt/ds-react';
import { useTildelOppgaver } from 'context/oppgave/TildelOppgaverContext';
import { avreserverOppgaveClient, plukkOppgaveClient } from 'lib/oppgaveClientApi';
import { OppgaveMedKontekst } from 'lib/types/oppgaveTypes';
import { isSuccess } from 'lib/utils/api';
import { byggKelvinURL } from 'lib/utils/request';
import { loggUmamiFrigiOppgave, loggUmamiGåTilBehandlingOgReserver, loggUmamiTildelOppgave } from 'lib/utils/umami';
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction, useTransition } from 'react';

import styles from './MineOppgaverMeny.module.css';

interface Props {
  oppgave: OppgaveMedKontekst;
  setFeilmelding: Dispatch<SetStateAction<string | undefined>>;
  setÅpenModal: Dispatch<SetStateAction<boolean>>;
  revalidateFunction: () => void;
}

export const MineOppgaverMeny = ({ oppgave, setFeilmelding, setÅpenModal, revalidateFunction }: Props) => {
  const [isPendingFrigi, startTransitionFrigi] = useTransition();
  const [isPendingBehandle, startTransitionBehandle] = useTransition();

  const { setOppgaveIder, visModal } = useTildelOppgaver();
  const router = useRouter();

  async function frigiOppgave(oppgaveId: number) {
    loggUmamiFrigiOppgave('MINE_OPPGAVER');
    startTransitionFrigi(async () => {
      const res = await avreserverOppgaveClient([oppgaveId]);

      if (isSuccess(res)) {
        if (revalidateFunction) {
          revalidateFunction();
        }
      } else if (res.status == 403) {
        setÅpenModal(true);
      } else {
        setFeilmelding(`Feil ved avreservering av oppgave: ${res.apiException.message}`);
      }
    });
  }

  async function plukkOgGåTilOppgave(oppgave: OppgaveMedKontekst) {
    loggUmamiGåTilBehandlingOgReserver('MINE_OPPGAVER');
    startTransitionBehandle(async () => {
      const plukketOppgave = await plukkOppgaveClient(oppgave.oppgaveMetadata.id, oppgave.oppgaveMetadata.versjon);
      if (isSuccess(plukketOppgave)) {
        router.push(byggKelvinURL(plukketOppgave.data.behandlingskontekst));
      } else if (plukketOppgave.status == 403) {
        setÅpenModal(true);
      } else {
        setFeilmelding(`Feil ved plukking av oppgave: ${plukketOppgave.apiException.message}`);
      }
    });
  }
  return (
    <div className={styles.comboButton}>
      <Button
        type={'button'}
        size={'small'}
        variant={'secondary'}
        onClick={() => plukkOgGåTilOppgave(oppgave)}
        loading={isPendingBehandle}
      >
        Behandle
      </Button>
      <Dropdown>
        <Button as={Dropdown.Toggle} size="small" variant="secondary">
          <HStack align={'center'}>
            {isPendingFrigi ? <Loader size={'xsmall'} /> : <ChevronDownIcon title="Meny" />}
          </HStack>
        </Button>
        <Dropdown.Menu>
          <Dropdown.Menu.GroupedList>
            <Dropdown.Menu.GroupedList.Item onClick={() => frigiOppgave(oppgave.oppgaveMetadata.id)}>
              Frigi oppgave
            </Dropdown.Menu.GroupedList.Item>
            <Dropdown.Menu.GroupedList.Item
              onClick={() => {
                loggUmamiTildelOppgave('MINE_OPPGAVER');
                setOppgaveIder([oppgave.oppgaveMetadata.id]);
                visModal();
              }}
            >
              Tildel oppgave
            </Dropdown.Menu.GroupedList.Item>
          </Dropdown.Menu.GroupedList>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};
