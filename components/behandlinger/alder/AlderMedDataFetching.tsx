import { hentAlderGrunnlag, hentFlyt } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { Alder } from 'components/behandlinger/alder/Alder';
import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';

interface Props {
  behandlingsReferanse: string;
}

export const AlderMedDataFetching = async ({ behandlingsReferanse }: Props) => {
  const grunnlag = await hentAlderGrunnlag(behandlingsReferanse);
  const flyt = await hentFlyt(behandlingsReferanse);

  return (
    <GruppeSteg
      behandlingVersjon={flyt.behandlingVersjon}
      behandlingReferanse={behandlingsReferanse}
      prosessering={flyt.prosessering}
      visVenteKort={flyt.visning.visVentekort}
    >
      <Alder grunnlag={grunnlag} />
    </GruppeSteg>
  );
};
