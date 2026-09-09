import { hentMellomlagring } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { Behovstype } from 'lib/utils/form';
import { StegData } from 'lib/utils/steg';
import { Helseinstitusjon } from 'components/behandlinger/institusjonsopphold/helseinstitusjon/Helseinstitusjon';
import { HelseinstitusjonGrunnlag } from 'lib/types/types';

type Props = {
  behandlingsreferanse: string;
  stegData: StegData;
  grunnlag: HelseinstitusjonGrunnlag;
};

/**
 * Antar at kalleren (Institusjonsopphold.tsx) allerede har avgjort at steget skal vises
 * basert på grunnlaget. Denne komponenten henter kun mellomlagring, som er avhengig av
 * `totalReadOnly`, og rendrer selve vilkårskortet.
 */
export const HelseinstitusjonSteg = async ({ behandlingsreferanse, stegData, grunnlag }: Props) => {
  const totalReadOnly = stegData.readOnly || !grunnlag.harTilgangTilÅSaksbehandle;
  const initialMellomlagretVurdering = await hentMellomlagring(
    behandlingsreferanse,
    Behovstype.AVKLAR_HELSEINSTITUSJON,
    totalReadOnly,
    stegData.erIkkePåVent
  );

  return (
    <Helseinstitusjon
      grunnlag={grunnlag}
      readOnly={totalReadOnly}
      behandlingVersjon={stegData.behandlingVersjon}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
    />
  );
};
