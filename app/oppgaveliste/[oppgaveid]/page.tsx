import { OppgaveKomplett } from 'lib/types/oppgavebehandling';
import { fetchProxy } from 'lib/services/fetchProxy';
import { mockOppgave } from 'mocks/mockOppgave';
import { isLocal } from 'lib/utils/environment';

import styles from './page.module.css';
import { Kort } from 'components/oppgavebehandling/kort/Kort';
import { ReactNode } from 'react';

const oppgavestyringApiBaseUrl = process.env.OPPGAVESTYRING_API_BASE_URL;
const oppgavestyringApiScope = process.env.OPPGAVESTYRING_API_SCOPE ?? '';

const hentOppgave = async (id: string): Promise<OppgaveKomplett> => {
  if (isLocal()) {
    return mockOppgave;
  }
  return await fetchProxy<OppgaveKomplett>(`${oppgavestyringApiBaseUrl}/oppgaver/${id}`, oppgavestyringApiScope, 'GET');
};

const Row = ({ label, value }: { label: string; value: ReactNode }) => (
  <tr>
    <td>{label}</td>
    <td>{value}</td>
  </tr>
);

const Page = async ({ params }: { params: { oppgaveid: string } }) => {
  const res = await hentOppgave(params.oppgaveid);
  return (
    <main className={styles.content}>
      <Kort>
        <table>
          <thead>
            <tr>
              <th>Felt</th>
              <th>Verdi</th>
            </tr>
          </thead>
          <tbody>
            <Row label={'status'} value={res.status} />
            <Row label={'endretTidspunkt'} value={res.endretTidspunkt} />
            <Row label={'aktivDato'} value={res.aktivDato} />
            <Row label={'aktoerId'} value={res.aktoerId} />
            <Row label={'behandlesAvApplikasjon'} value={res.behandlesAvApplikasjon} />
            <Row label={'behandlingstema'} value={res.behandlingstema} />
            <Row label={'behandlingstype'} value={res.behandlingstype} />
            <Row label={'beskrivelse'} value={res.beskrivelse} />
            <Row label={'endretAv'} value={res.endretAv} />
            <Row label={'endretAvEnhetsnr'} value={res.endretAvEnhetsnr} />
            <Row label={'ferdigstiltTidspunkt'} value={res.ferdigstiltTidspunkt} />
            <Row label={'fristFerdigstillelse'} value={res.fristFerdigstillelse} />
            <Row label={'mappeId'} value={res.mappeId} />
            <Row label={'journalpostId'} value={res.journalpostId} />
            <Row label={'oppgavetype'} value={res.oppgavetype} />
            <Row label={'opprettetAv'} value={res.opprettetAv} />
            <Row label={'opprettetAvEnhetsnr'} value={res.opprettetAvEnhetsnr} />
            <Row label={'orgnr'} value={res.orgnr} />
            <Row label={'opprettetTidspunkt'} value={res.opprettetTidspunkt} />
            <Row label={'tema'} value={res.tema} />
            <Row label={'prioritet'} value={res.prioritet} />
            <Row label={'tildeltEnhetsnr'} value={res.tildeltEnhetsnr} />
            <Row label={'versjon'} value={res.versjon} />
            <Row label={'tilordnetRessurs'} value={res.tilordnetRessurs} />
            <Row label={'id'} value={res.id} />
          </tbody>
        </table>
      </Kort>
    </main>
  );
};

export default Page;
