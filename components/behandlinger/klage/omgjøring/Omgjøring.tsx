import { hentFlyt } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { getStegSomSkalVises } from 'lib/utils/steg';
import { isError } from 'lib/utils/api';
import { StegSuspense } from 'components/stegsuspense/StegSuspense';
import { OmgjøringMedDataFetching } from 'components/behandlinger/klage/omgjøring/OmgjøringMedDataFetching';
import { TypeBehandling } from 'lib/types/types';

interface Props {
  saksnummer: string;
  behandlingsreferanse: string;
}

export const Omgjøring = async ({ saksnummer, behandlingsreferanse }: Props) => {
  const flyt = await hentFlyt(behandlingsreferanse);
  if (isError(flyt)) {
    return <ApiException apiResponses={[flyt]} />;
  }
  const stegSomSkalVises = getStegSomSkalVises('OMGJØRING', flyt.data);
  const behandlingVersjon = flyt.data.behandlingVersjon;

  return (
    <GruppeSteg
      prosessering={flyt.data.prosessering}
      visning={flyt.data.visning}
      behandlingReferanse={behandlingsreferanse}
      behandlingVersjon={flyt.data.behandlingVersjon}
      aktivtSteg={flyt.data.aktivtSteg}
    >
      {stegSomSkalVises.includes('OMGJØRING') && (
        <StegSuspense>
          <OmgjøringMedDataFetching
            saksnummer={saksnummer}
            behandlingsreferanse={behandlingsreferanse}
            behandlingVersjon={behandlingVersjon}
            readOnly={flyt.data.visning.saksbehandlerReadOnly}
            erAktivtSteg={flyt.data.aktivtSteg == 'KLAGEBEHANDLING_NAY'}
            typeBehandling={flyt.data.visning.typeBehandling as TypeBehandling}
          />
        </StegSuspense>
      )}
    </GruppeSteg>
  );
};
