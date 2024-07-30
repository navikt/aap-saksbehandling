import { Sykdomsvurdering } from 'components/behandlinger/sykdom/sykdomsvurdering/Sykdomsvurdering';
import { hentAlleDokumenterPåSak, hentSykdomsGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { SykdomsvurderingMedYrkesskade } from 'components/behandlinger/sykdom/sykdomsvurdering/SykdomsvurderingMedYrkesskade';
import { DokumentInfo, SykdomsGrunnlag } from 'lib/types/types';

interface Props {
  saksId: string;
  behandlingsReferanse: string;
  behandlingVersjon: number;
  readOnly: boolean;
}

export interface SykdomProps {
  behandlingVersjon: number;
  grunnlag: SykdomsGrunnlag;
  readOnly: boolean;
  tilknyttedeDokumenter: DokumentInfo[];
}

export const SykdomsvurderingMedDataFetching = async ({
  behandlingsReferanse,
  behandlingVersjon,
  readOnly,
  saksId,
}: Props) => {
  const [grunnlag, tilknyttedeDokumenter] = await Promise.all([
    hentSykdomsGrunnlag(behandlingsReferanse),
    hentAlleDokumenterPåSak(saksId),
  ]);

  return grunnlag.skalVurdereYrkesskade ? (
    <SykdomsvurderingMedYrkesskade
      grunnlag={grunnlag}
      readOnly={readOnly}
      behandlingVersjon={behandlingVersjon}
      tilknyttedeDokumenter={tilknyttedeDokumenter}
    />
  ) : (
    <Sykdomsvurdering
      grunnlag={grunnlag}
      readOnly={readOnly}
      behandlingVersjon={behandlingVersjon}
      tilknyttedeDokumenter={tilknyttedeDokumenter}
    />
  );
};
