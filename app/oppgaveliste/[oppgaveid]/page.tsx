import { OppgaveKomplett } from 'lib/types/oppgavebehandling';
import { fetchProxy } from 'lib/services/fetchProxy';
import { mockOppgave } from 'mocks/mockOppgave';
import { isLocal } from 'lib/utils/environment';

const oppgavestyringApiBaseUrl = process.env.OPPGAVESTYRING_API_BASE_URL;
const oppgavestyringApiScope = process.env.OPPGAVESTYRING_API_SCOPE ?? '';

const hentOppgave = async (id: string): Promise<OppgaveKomplett> => {
  if (isLocal()) {
    return mockOppgave;
  }
  return await fetchProxy<OppgaveKomplett>(`${oppgavestyringApiBaseUrl}/oppgaver/${id}`, oppgavestyringApiScope, 'GET');
};

const Page = async ({ params }: { params: { oppgaveid: string } }) => {
  const res = await hentOppgave(params.oppgaveid);
  return (
    <section>
      <div>status: {res.status}</div>
      <div>endretTidspunkt: {res.endretTidspunkt}</div>
      <div>aktivDato: {res.aktivDato}</div>
      <div>aktoerId: {res.aktoerId}</div>
      <div>behandlesAvApplikasjon: {res.behandlesAvApplikasjon}</div>
      <div>behandlingstema: {res.behandlingstema}</div>
      <div>behandlingstype: {res.behandlingstype}</div>
      <div>beskrivelse: {res.beskrivelse}</div>
      <div>endretAv: {res.endretAv}</div>
      <div>endretAvEnhetsnr: {res.endretAvEnhetsnr}</div>
      <div>ferdigstiltTidspunkt: {res.ferdigstiltTidspunkt}</div>
      <div>fristFerdigstillelse: {res.fristFerdigstillelse}</div>
      <div>mappeId: {res.mappeId}</div>
      <div>journalpostId: {res.journalpostId}</div>
      <div>oppgavetype: {res.oppgavetype}</div>
      <div>opprettetAv: {res.opprettetAv}</div>
      <div>opprettetAvEnhetsnr: {res.opprettetAvEnhetsnr}</div>
      <div>orgnr: {res.orgnr}</div>
      <div>opprettetTidspunkt: {res.opprettetTidspunkt}</div>
      <div>tema: {res.tema}</div>
      <div>prioritet: {res.prioritet}</div>
      <div>tildeltEnhetsnr: {res.tildeltEnhetsnr}</div>
      <div>versjon: {res.versjon}</div>
      <div>tilordnetRessurs: {res.tilordnetRessurs}</div>
      <div>id: {res.id}</div>
    </section>
  );
};

export default Page;
