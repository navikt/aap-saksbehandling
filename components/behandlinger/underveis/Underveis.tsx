import { AktivitetspliktMedDatafetching } from 'components/behandlinger/underveis/aktivitetsplikt/AktivitetspliktMedDatafetching';
import { UnderveisgrunnlagMedDataFetching } from 'components/behandlinger/underveis/underveisgrunnlag/UnderveisgrunnlagMedDatafetching';
import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { hentFlyt } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { getStegSomSkalVises } from 'lib/utils/steg';
import { SamordningGraderingMedDatafetching } from './samordninggradering/SamordningGraderingMedDatafetching';

interface Props {
  behandlingsreferanse: string;
}

export const Underveis = async ({ behandlingsreferanse }: Props) => {
  const flyt = await hentFlyt(behandlingsreferanse);
  const stegSomSkalVises = getStegSomSkalVises('UNDERVEIS', flyt);

  return (
    <GruppeSteg
      behandlingVersjon={flyt.behandlingVersjon}
      behandlingReferanse={behandlingsreferanse}
      prosessering={flyt.prosessering}
      visning={flyt.visning}
    >
      {stegSomSkalVises.includes('EFFEKTUER_11_7') && (
        <AktivitetspliktMedDatafetching
          behandlingsreferanse={behandlingsreferanse}
          behandlingVersjon={flyt.behandlingVersjon}
          readOnly={flyt.visning.saksbehandlerReadOnly}
        />
      )}
      <SamordningGraderingMedDatafetching
        behandlingsreferanse={behandlingsreferanse}
        behandlingVersjon={flyt.behandlingVersjon}
        readOnly={flyt.visning.saksbehandlerReadOnly}
      />
      <UnderveisgrunnlagMedDataFetching behandlingsreferanse={behandlingsreferanse} />
    </GruppeSteg>
  );
};
