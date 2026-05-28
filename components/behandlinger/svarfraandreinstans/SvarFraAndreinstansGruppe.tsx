import { getStegSomSkalVises } from 'lib/utils/steg';
import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { StegSuspense } from 'components/stegsuspense/StegSuspense';
import { SvarFraAndreinstansMedDatafetching } from 'components/behandlinger/svarfraandreinstans/SvarFraAndreinstansMedDatafetching';
import { BehandlingFlytOgTilstand } from 'lib/types/types';

interface Props {
  behandlingsreferanse: string;
  flyt: BehandlingFlytOgTilstand;
}

export const SvarFraAndreinstansGruppe = async ({ behandlingsreferanse, flyt }: Props) => {
  const stegSomSkalVises = getStegSomSkalVises('SVAR_FRA_ANDREINSTANS', flyt);

  return (
    <GruppeSteg
      prosessering={flyt.prosessering}
      visning={flyt.visning}
      behandlingReferanse={behandlingsreferanse}
      behandlingVersjon={flyt.behandlingVersjon}
      aktivtSteg={flyt.aktivtSteg}
    >
      {stegSomSkalVises.includes('SVAR_FRA_ANDREINSTANS') && (
        <StegSuspense>
          <SvarFraAndreinstansMedDatafetching
            behandlingsreferanse={behandlingsreferanse}
            readOnly={flyt.visning.saksbehandlerReadOnly}
            behandlingVersjon={flyt.behandlingVersjon}
          />
        </StegSuspense>
      )}
    </GruppeSteg>
  );
};
