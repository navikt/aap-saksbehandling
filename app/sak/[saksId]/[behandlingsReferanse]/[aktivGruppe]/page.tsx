import { OppgaveKolonne } from 'components/oppgavekolonne/OppgaveKolonne';

import { StegGruppe } from 'lib/types/types';

const Page = async ({
  params,
}: {
  params: { behandlingsReferanse: string; aktivGruppe: StegGruppe; saksId: string };
}) => {
  // const forberedBehandlingResponse = await forberedBehandlingOgVentPåProsessering(params.behandlingsReferanse);
  //
  // if (forberedBehandlingResponse && forberedBehandlingResponse.status === 'FEILET') {
  //   return <FlytProsesseringAlert flytProsessering={forberedBehandlingResponse} />;
  // }

  return (
    <OppgaveKolonne
      saksId={params.saksId}
      behandlingsReferanse={params.behandlingsReferanse ?? ''}
      aktivGruppe={decodeURI(params.aktivGruppe) as StegGruppe}
    />
  );
};

export default Page;
