import { UnderveisgrunnlagMedDataFetching } from 'components/behandlinger/underveis/underveisgrunnlag/UnderveisgrunnlagMedDatafetching';
import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { hentFlyt } from 'lib/services/saksbehandlingservice/saksbehandlingService';

interface Props {
  behandlingsreferanse: string;
}

export const Underveis = async ({ behandlingsreferanse }: Props) => {
  const flyt = await hentFlyt(behandlingsreferanse);

  return (
    <GruppeSteg
      behandlingVersjon={flyt.behandlingVersjon}
      behandlingReferanse={behandlingsreferanse}
      prosessering={flyt.prosessering}
      visVenteKort={flyt.visning.visVentekort}
    >
      <UnderveisgrunnlagMedDataFetching behandlingsreferanse={behandlingsreferanse} />
    </GruppeSteg>
  );
};
