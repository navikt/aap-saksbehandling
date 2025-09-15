import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { hentFlyt } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isError } from 'lib/utils/api';
import { getStegSomSkalVises } from 'lib/utils/steg';
import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { StegSuspense } from 'components/stegsuspense/StegSuspense';
import { Vurder11_7MedDataFetching } from './Vurder11_7/Vurder11_7MedDataFetching';
import { BrevKortMedDataFetching } from 'components/brev/BrevKortMedDataFetching';

interface Props {
  behandlingsreferanse: string;
}

export const Aktivitetsplikt11_7 = async ({ behandlingsreferanse }: Props) => {
  const flyt = await hentFlyt(behandlingsreferanse);
  if (isError(flyt)) {
    return <ApiException apiResponses={[flyt]} />;
  }

  const stegSomSkalVises = getStegSomSkalVises('AKTIVITETSPLIKT_11_7', flyt.data);
  const behandlingVersjon = flyt.data.behandlingVersjon;

  return (
    <GruppeSteg
      prosessering={flyt.data.prosessering}
      visning={flyt.data.visning}
      behandlingReferanse={behandlingsreferanse}
      behandlingVersjon={behandlingVersjon}
      aktivtSteg={flyt.data.aktivtSteg}
      brevForhåndsvisning={flyt.data.aktivGruppe !== 'AKTIVITETSPLIKT_11_7'}
    >
      {stegSomSkalVises.includes('VURDER_AKTIVITETSPLIKT_11_7') && (
        <StegSuspense>
          <Vurder11_7MedDataFetching
            behandlingsreferanse={behandlingsreferanse}
            behandlingVersjon={behandlingVersjon}
            readOnly={flyt.data.visning.saksbehandlerReadOnly}
          />
        </StegSuspense>
      )}
      {flyt.data.visning.visBrevkort && flyt.data.aktivGruppe === 'AKTIVITETSPLIKT_11_7' && (
        <BrevKortMedDataFetching
          behandlingReferanse={behandlingsreferanse}
          visAvbryt={false}
          behandlingVersjon={behandlingVersjon}
          aktivtSteg={flyt.data.aktivtSteg}
        />
      )}
    </GruppeSteg>
  );
};
