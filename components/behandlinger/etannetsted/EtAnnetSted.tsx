import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { hentFlyt } from 'lib/services/saksbehandlingservice/saksbehandlingService';

type Props = {
  behandlingsreferanse: string;
};

export const EtAnnetSted = async ({ behandlingsreferanse }: Props) => {
  const flyt = await hentFlyt(behandlingsreferanse);
  return (
    <GruppeSteg
      prosessering={flyt.prosessering}
      visVenteKort={flyt.visning.visVentekort}
      behandlingReferanse={behandlingsreferanse}
      behandlingVersjon={flyt.behandlingVersjon}
    >
      <div>Institusjonsopphold</div>
    </GruppeSteg>
  );
};
