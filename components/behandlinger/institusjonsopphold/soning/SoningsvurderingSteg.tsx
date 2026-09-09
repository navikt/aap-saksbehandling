import { Soningsvurdering } from './Soningsvurdering';
import { hentMellomlagring } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { Behovstype } from 'lib/utils/form';
import { StegData } from 'lib/utils/steg';
import { Soningsgrunnlag } from 'lib/types/types';

interface Props {
  behandlingsreferanse: string;
  stegData: StegData;
  grunnlag: Soningsgrunnlag;
}

/**
 * Antar at kalleren (Institusjonsopphold.tsx) allerede har avgjort at steget skal vises
 * basert på grunnlaget. Denne komponenten henter kun mellomlagring, som er avhengig av
 * `totalReadOnly`, og rendrer selve vilkårskortet.
 */
export const SoningsvurderingSteg = async ({ behandlingsreferanse, stegData, grunnlag }: Props) => {
  const totalReadOnly = stegData.readOnly || !grunnlag.harTilgangTilÅSaksbehandle;
  const initialMellomlagretVurdering = await hentMellomlagring(
    behandlingsreferanse,
    Behovstype.AVKLAR_SONINGSFORRHOLD,
    totalReadOnly,
    stegData.erIkkePåVent
  );

  return (
    <Soningsvurdering
      behandlingsversjon={stegData.behandlingVersjon}
      grunnlag={grunnlag}
      readOnly={totalReadOnly}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
    />
  );
};
