import { SaksopplysningerKort } from 'components/behandlinger/brev/skriveBrev/SaksopplysningerKort';
import styles from './SaksopplysningerKolonne.module.css';
import { Label } from '@navikt/ds-react';
import { BistandsGrunnlag, RefusjonskravGrunnlag, SykdomsGrunnlag } from 'lib/types/types';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { parse } from 'date-fns';

interface Props {
  sykdomsgrunnlag: SykdomsGrunnlag;
  bistandsbehovGrunnlag: BistandsGrunnlag;
  refusjonGrunnlag: RefusjonskravGrunnlag;
}

export const SaksopplysningerKolonne = ({ sykdomsgrunnlag, bistandsbehovGrunnlag, refusjonGrunnlag }: Props) => {
  const gjeldendeSykdomsvurdering = sykdomsgrunnlag.sykdomsvurderinger[sykdomsgrunnlag.sykdomsvurderinger.length - 1];
  const gjeldendeBistandsbehov = bistandsbehovGrunnlag.vurdering;
  const refusjonVurdering = refusjonGrunnlag.gjeldendeVurderinger?.[0];

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
      {refusjonVurdering?.harKrav && (
        <SaksopplysningerKort
          tittel="Refusjonskrav"
          begrunnelse={`Det er refusjonskrav mot sosialhjelp. Refusjonskravet gjelder fra 
                  ${
                    refusjonVurdering.fom
                      ? formaterDatoForFrontend(parse(refusjonVurdering.fom, 'yyyy-MM-dd', new Date()))
                      : '-'
                  }
                  ${
                    refusjonVurdering.tom
                      ? `til ${formaterDatoForFrontend(parse(refusjonVurdering.tom, 'yyyy-MM-dd', new Date()))}`
                      : ''
                  }`}
        />
      )}
    </div>
  );
};
