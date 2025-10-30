import { StegSuspense } from 'components/stegsuspense/StegSuspense';
import { StegGruppe } from 'lib/types/postmottakTypes';
import { AvklarTemaMedDataFetching } from 'components/postmottak/avklartema/AvklarTemaMedDataFetching';
import { AvklarSakMedDataFetching } from 'components/postmottak/avklarsak/AvklarSakMedDataFetching';
import { OverleveringMedDataFetching } from 'components/postmottak/overlevering/OverleveringMedDataFetching';
import { DigitaliserDokumentMedDatafetching } from 'components/postmottak/digitaliserdokument/DigitaliserDokumentMedDatafetching';
import { FullførtOppgaveModal } from 'components/postmottak/fullførtoppgavemodal/FullførtOppgaveModal';
import { hentFlyt } from 'lib/services/postmottakservice/postmottakservice';
import { isSuccess } from 'lib/utils/api';

interface Props {
  aktivGruppe: StegGruppe;
  behandlingsreferanse: string;
}

export const StegKolonne = async ({ aktivGruppe, behandlingsreferanse }: Props) => {
  if (['VIDERESEND', 'IVERKSETTES'].includes(aktivGruppe)) {
    const flyt = await hentFlyt(behandlingsreferanse);
    if (isSuccess(flyt)) {
      const nesteBehandlingId = flyt.data.nesteBehandlingId;
      const typeBehandling = flyt.data.visning.typeBehandling;

      return <FullførtOppgaveModal nesteBehandlingId={nesteBehandlingId} typeBehandling={typeBehandling} />;
    }
  }
  return (
    <>
      {aktivGruppe === 'AVKLAR_TEMA' && (
        <StegSuspense>
          <AvklarTemaMedDataFetching behandlingsreferanse={behandlingsreferanse} />
        </StegSuspense>
      )}
      {aktivGruppe === 'AVKLAR_SAK' && (
        <StegSuspense>
          <AvklarSakMedDataFetching behandlingsreferanse={behandlingsreferanse} />
        </StegSuspense>
      )}
      {aktivGruppe === 'DIGITALISER' && (
        <StegSuspense>
          <DigitaliserDokumentMedDatafetching behandlingsreferanse={behandlingsreferanse} />
        </StegSuspense>
      )}
      {aktivGruppe === 'OVERLEVER_TIL_FAGSYSTEM' && (
        <StegSuspense>
          <OverleveringMedDataFetching behandlingsreferanse={behandlingsreferanse} />
        </StegSuspense>
      )}
    </>
  );
};
