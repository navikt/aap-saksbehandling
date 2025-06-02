import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { hentFlyt } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { TypeBehandling } from 'lib/types/types';
import { getStegSomSkalVises } from 'lib/utils/steg';
import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { StegSuspense } from 'components/stegsuspense/StegSuspense';
import { KlagebehandlingVurderingNayMedDataFetching } from 'components/behandlinger/klage/klagebehandlingnay/KlagebehandlingVurderingNayMedDataFetching';
import { KlagebehandlingOppsummeringMedDataFetching } from 'components/behandlinger/klage/klagebehandlingoppsummering/KlagebehandlingOppsummeringMedDataFetching';

interface Props {
  behandlingsreferanse: string;
}

export const KlagebehandlingNay = async ({ behandlingsreferanse }: Props) => {
  const flyt = await hentFlyt(behandlingsreferanse);
  if (isError(flyt)) {
    return <ApiException apiResponses={[flyt]} />;
  }
  const stegSomSkalVises = getStegSomSkalVises('KLAGEBEHANDLING_NAY', flyt.data);
  const behandlingVersjon = flyt.data.behandlingVersjon;

  return (
    <GruppeSteg
      prosessering={flyt.data.prosessering}
      visning={flyt.data.visning}
      behandlingReferanse={behandlingsreferanse}
      behandlingVersjon={flyt.data.behandlingVersjon}
      aktivtSteg={flyt.data.aktivtSteg}
    >
      {stegSomSkalVises.includes('KLAGEBEHANDLING_NAY') && (
        <StegSuspense>
          <KlagebehandlingVurderingNayMedDataFetching
            behandlingsreferanse={behandlingsreferanse}
            behandlingVersjon={behandlingVersjon}
            readOnly={flyt.data.visning.saksbehandlerReadOnly}
            erAktivtSteg={flyt.data.aktivtSteg == 'KLAGEBEHANDLING_NAY'}
            typeBehandling={flyt.data.visning.typeBehandling as TypeBehandling}
          />
        </StegSuspense>
      )}
      {stegSomSkalVises.includes('KLAGEBEHANDLING_OPPSUMMERING') && (
        <StegSuspense>
          <KlagebehandlingOppsummeringMedDataFetching
            behandlingsreferanse={behandlingsreferanse}
            behandlingVersjon={behandlingVersjon}
            readOnly={flyt.data.visning.saksbehandlerReadOnly}
            erAktivtSteg={flyt.data.aktivtSteg == 'KLAGEBEHANDLING_OPPSUMMERING'}
            typeBehandling={flyt.data.visning.typeBehandling as TypeBehandling}
          />
        </StegSuspense>
      )}
    </GruppeSteg>
  );
};
