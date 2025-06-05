import { hentFlyt } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { getStegSomSkalVises } from 'lib/utils/steg';
import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { StegSuspense } from 'components/stegsuspense/StegSuspense';
import { EffektuerAvvistPåFormkravMedDatafetching } from 'components/behandlinger/klage/effektuerklageavvistpåformkrav/EffektuerAvvistPåFormkravMedDatafetching';

interface Props {
  behandlingsreferanse: string;
}

export const KlageAvvistPåFormkrav = async ({ behandlingsreferanse }: Props) => {
  const flyt = await hentFlyt(behandlingsreferanse);
  if (isError(flyt)) {
    return <ApiException apiResponses={[flyt]} />;
  }
  const stegSomSkalVises = getStegSomSkalVises('KLAGE_AVVIST_PÅ_FORMKRAV', flyt.data);
  const behandlingVersjon = flyt.data.behandlingVersjon;

  return (
    <GruppeSteg
      prosessering={flyt.data.prosessering}
      visning={flyt.data.visning}
      behandlingReferanse={behandlingsreferanse}
      behandlingVersjon={flyt.data.behandlingVersjon}
      aktivtSteg={flyt.data.aktivtSteg}
    >
      {stegSomSkalVises.includes('EFFEKTUER_AVVIST_PÅ_FORMKRAV') && (
        <StegSuspense>
          <EffektuerAvvistPåFormkravMedDatafetching
            behandlingsreferanse={behandlingsreferanse}
            behandlingVersjon={behandlingVersjon}
            readOnly={flyt.data.visning.saksbehandlerReadOnly}
          ></EffektuerAvvistPåFormkravMedDatafetching>
        </StegSuspense>
      )}
    </GruppeSteg>
  );
};
