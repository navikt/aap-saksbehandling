import { TypeBehandling } from '../../../../../lib/types/types';
import { KlagebehandlingVurderingKontor } from './KlagebehandlingVurderingKontor';

interface Props {
  behandlingsreferanse: string;
  behandlingVersjon: number;
  readOnly: boolean;
  typeBehandling: TypeBehandling;
  erAktivtSteg: boolean;
}

export const KlagebehandlingVurderingKontorMedDataFetching = async ({
  behandlingVersjon,
  readOnly,
  typeBehandling,
  erAktivtSteg,
}: Props) => {
  // TODO: Hent grunnlag

  return (
    <KlagebehandlingVurderingKontor
      behandlingVersjon={behandlingVersjon}
      readOnly={readOnly}
      typeBehandling={typeBehandling}
      erAktivtSteg={erAktivtSteg}
    />
  );
};
