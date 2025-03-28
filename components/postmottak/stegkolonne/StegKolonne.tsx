import { StegSuspense } from 'components/stegsuspense/StegSuspense';
import { StegGruppe } from 'lib/types/postmottakTypes';
import { AvklarTemaMedDataFetching } from 'components/postmottak/avklartema/AvklarTemaMedDataFetching';
import { AvklarSakMedDataFetching } from 'components/postmottak/avklarsak/AvklarSakMedDataFetching';
import { OverleveringMedDataFetching } from 'components/postmottak/overlevering/OverleveringMedDataFetching';
import { DigitaliserDokumentMedDatafetching } from 'components/postmottak/digitaliserdokument/DigitaliserDokumentMedDatafetching';
import { FullførtOppgaveModal } from 'components/postmottak/fullførtoppgavemodal/FullførtOppgaveModal';

interface Props {
  aktivGruppe: StegGruppe;
  behandlingsreferanse: string;
}

// TODO Ikke gå videre til VIDERESEND, men bli værende på AVKLAR_SAK
// TODO Ikke gå videre til IVERKSETTES, men bli værende på OVERLEVER_TIL_FAGSYSTEM
export const StegKolonne = ({ aktivGruppe, behandlingsreferanse }: Props) => {
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
      {aktivGruppe === 'VIDERESEND' && <FullførtOppgaveModal successMessage={'Dokumentet er journalført'} />}
      {aktivGruppe === 'IVERKSETTES' && (
        <FullførtOppgaveModal successMessage={'Dokumentet er kategorisert og sendt.'} />
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
