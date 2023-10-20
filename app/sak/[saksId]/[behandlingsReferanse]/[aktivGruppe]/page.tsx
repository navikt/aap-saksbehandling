import { OppgaveKolonne } from 'components/oppgavekolonne/OppgaveKolonne';

import { StegGruppe } from 'lib/types/types';
import { notFound } from 'next/navigation';

const grupper: StegGruppe[] = ['ALDER', 'SYKDOM', 'VEDTAK'];

const Page = async ({ params }: { params: { behandlingsReferanse: string; aktivGruppe: StegGruppe } }) => {
  if (!grupper.includes(decodeURI(params.aktivGruppe) as StegGruppe)) {
    notFound();
  }

  return (
    <OppgaveKolonne
      behandlingsReferanse={params.behandlingsReferanse ?? ''}
      aktivGruppe={decodeURI(params.aktivGruppe) as StegGruppe}
    />
  );
};

export default Page;
