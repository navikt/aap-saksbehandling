import { Avslag11_27Grunnlag, BehandlingFlytOgTilstand } from 'lib/types/types';
import { getStegSomSkalVises } from 'lib/utils/steg';
import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { StegSuspense } from 'components/stegsuspense/StegSuspense';
import { useParamsMedType } from 'hooks/saksbehandling/BehandlingHook';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { useVilkårskortVisning } from 'hooks/saksbehandling/visning/VisningHook';
import { useUmamiStartTidspunkt } from 'lib/utils/umami';
import { AvslagAndreYtelserMedDataFetching } from 'components/behandlinger/samordning/avslag11_27/AvslagAndreYtelserMedDataFetching';
import { UseFormReturn } from 'react-hook-form';
import { Avslag11_27FormFields } from 'components/behandlinger/samordning/avslag11_27/Avslag11_27';

interface props {
  form: UseFormReturn<Avslag11_27FormFields>;
  behandlingVersjon: number;
  readOnly: boolean;
  grunnlag: Avslag11_27Grunnlag;
  flyt: BehandlingFlytOgTilstand;
}

export const Avslag11_27Vurdering = async ({ form, grunnlag, readOnly, behandlingVersjon, flyt }: props) => {
  const { behandlingsreferanse } = useParamsMedType();
  const { løsBehovOgGåTilNesteSteg, isLoading, status, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('AVSLAG_11_27');

  const { visningModus, visningActions, formReadOnly } = useVilkårskortVisning(readOnly, 'AVSLAG_11_27', undefined);

  const stegSomSkalVises = getStegSomSkalVises('AVSLAG_11_27', flyt);
  const umamiStartTidspunkt = useUmamiStartTidspunkt(visningModus);

  return (
    <GruppeSteg
      prosessering={flyt.prosessering}
      visning={flyt.visning}
      behandlingReferanse={behandlingsreferanse}
      behandlingVersjon={behandlingVersjon}
      aktivtSteg={flyt.aktivtSteg}
    >
      {stegSomSkalVises.includes('AVSLAG_11_27') && (
        <StegSuspense>
          <AvslagAndreYtelserMedDataFetching
            behandlingsreferanse={behandlingsreferanse}
            behandlingVersjon={behandlingVersjon}
            readOnly={flyt.visning.saksbehandlerReadOnly}
          />
        </StegSuspense>
      )}
    </GruppeSteg>
  );
};
