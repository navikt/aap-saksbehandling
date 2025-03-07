import { SaksopplysningerKort } from 'components/behandlinger/brev/skriveBrev/SaksopplysningerKort';
import styles from './SaksopplysningerKolonne.module.css';
import { Label } from '@navikt/ds-react';
import { BistandsGrunnlag, SykdomsGrunnlag } from 'lib/types/types';

interface Props {
  sykdomsgrunnlag: SykdomsGrunnlag;
  bistandsbehovGrunnlag: BistandsGrunnlag;
}

export const SaksopplysningerKolonne = ({ sykdomsgrunnlag, bistandsbehovGrunnlag }: Props) => {
  const gjeldendeSykdomsvurdering = sykdomsgrunnlag.sykdomsvurderinger[sykdomsgrunnlag.sykdomsvurderinger.length - 1];
  const gjeldendeBistandsbehov = bistandsbehovGrunnlag.vurdering;
  return (
    <div className={styles.kolonne}>
      <Label as="p">Vilkårsvurderinger</Label>
      {gjeldendeSykdomsvurdering && (
        <SaksopplysningerKort
          tittel="§11-5 Nedsatt arbeidsevne og krav til årsakssammenheng"
          begrunnelse={gjeldendeSykdomsvurdering.begrunnelse}
        />
      )}
      {gjeldendeBistandsbehov && (
        <SaksopplysningerKort
          tittel="§11-6 Behov for bistand til å skaffe seg eller beholde arbeid"
          begrunnelse={gjeldendeBistandsbehov.begrunnelse}
        />
      )}
    </div>
  );
};
