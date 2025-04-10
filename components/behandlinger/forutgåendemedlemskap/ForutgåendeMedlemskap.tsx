import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import {
  hentFlyt,
  hentForutgåendeMedlemskapGrunnlag,
  hentForutgåendeMedlemskapsVurdering,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { getStegSomSkalVises } from 'lib/utils/steg';
import { ManuellVurderingForutgåendeMedlemskapMedDatafetching } from 'components/behandlinger/forutgåendemedlemskap/manuellvurderingforutgåendemedlemskap/ManuellVurderingForutgåendeMedlemskapMedDatafetching';
import { ForutgåendemedlemskapOverstyringswrapper } from 'components/behandlinger/forutgåendemedlemskap/ForutgåendemedlemskapOverstyringswrapper';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError } from 'lib/utils/api';

interface Props {
  behandlingsReferanse: string;
}
export const ForutgåendeMedlemskap = async ({ behandlingsReferanse }: Props) => {
  const [flyt, grunnlag, automatiskVurdering] = await Promise.all([
    hentFlyt(behandlingsReferanse),
    hentForutgåendeMedlemskapGrunnlag(behandlingsReferanse),
    hentForutgåendeMedlemskapsVurdering(behandlingsReferanse),
  ]);
  if (isError(grunnlag) || isError(automatiskVurdering)) {
    return <ApiException apiResponses={[grunnlag, automatiskVurdering]} />;
  }

  const stegSomSkalVises = getStegSomSkalVises('MEDLEMSKAP', flyt);

  const behandlingsVersjon = flyt.behandlingVersjon;
  const saksBehandlerReadOnly = flyt.visning.saksbehandlerReadOnly;
  const visOverstyrKnapp = automatiskVurdering.data.kanBehandlesAutomatisk && stegSomSkalVises.length === 0;

  const readOnly = saksBehandlerReadOnly || !grunnlag.data.harTilgangTilÅSaksbehandle;

  return (
    <GruppeSteg
      prosessering={flyt.prosessering}
      visning={flyt.visning}
      behandlingReferanse={behandlingsReferanse}
      behandlingVersjon={behandlingsVersjon}
      aktivtSteg={flyt.aktivtSteg}
    >
      <ForutgåendemedlemskapOverstyringswrapper
        behandlingsReferanse={behandlingsReferanse}
        behandlingVersjon={behandlingsVersjon}
        readOnly={readOnly}
        automatiskVurdering={automatiskVurdering.data}
        stegSomSkalVises={stegSomSkalVises}
        visOverstyrKnapp={visOverstyrKnapp}
      >
        {stegSomSkalVises.includes('VURDER_MEDLEMSKAP') && (
          <ManuellVurderingForutgåendeMedlemskapMedDatafetching
            grunnlag={grunnlag.data}
            behandlingVersjon={behandlingsVersjon}
            readOnly={readOnly}
          />
        )}
      </ForutgåendemedlemskapOverstyringswrapper>
    </GruppeSteg>
  );
};
