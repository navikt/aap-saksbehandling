import { TypeBehandling } from '../../../../lib/types/types';
import { KlagebehandlingVurderingNay } from './KlagebehandlingVurderingNay';

interface Props {
  behandlingsreferanse: string;
  behandlingVersjon: number;
  readOnly: boolean;
  typeBehandling: TypeBehandling;
  erAktivtSteg: boolean;
}

export const KlagebehandlingVurderingNayMedDataFetching = async ({
  behandlingVersjon,
  readOnly,
  typeBehandling,
  erAktivtSteg,
}: Props) => {
  // TODO: Hent grunnlag

  return (
    <KlagebehandlingVurderingNay
      behandlingVersjon={behandlingVersjon}
      readOnly={readOnly}
      typeBehandling={typeBehandling}
      erAktivtSteg={erAktivtSteg}
    />
  );
};
