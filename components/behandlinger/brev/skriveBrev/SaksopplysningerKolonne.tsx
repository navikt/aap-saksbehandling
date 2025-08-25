import { SaksopplysningerKort } from 'components/behandlinger/brev/skriveBrev/SaksopplysningerKort';
import styles from './SaksopplysningerKolonne.module.css';
import { Label } from '@navikt/ds-react';
import {
  BistandsGrunnlag,
  RefusjonskravGrunnlag,
  SykdomsGrunnlag,
  SykdomsvurderingBrevGrunnlag,
} from 'lib/types/types';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { parse } from 'date-fns';
import { isDev, isLocal, isProd } from 'lib/utils/environment';

interface Props {
  sykdomsgrunnlag: SykdomsGrunnlag;
  bistandsbehovGrunnlag: BistandsGrunnlag;
  refusjonGrunnlag: RefusjonskravGrunnlag;
  sykdomsvurderingBrevGrunnlag?: SykdomsvurderingBrevGrunnlag;
}

export const SaksopplysningerKolonne = ({
  sykdomsgrunnlag,
  bistandsbehovGrunnlag,
  refusjonGrunnlag,
  sykdomsvurderingBrevGrunnlag,
}: Props) => {
  const gjeldendeSykdomsvurdering = sykdomsgrunnlag.sykdomsvurderinger[sykdomsgrunnlag.sykdomsvurderinger.length - 1];
  const gjeldendeBistandsbehov = bistandsbehovGrunnlag.vurdering;
  const gjeldendeSykdomsvurderingForBrev = sykdomsvurderingBrevGrunnlag?.vurdering?.vurdering;
  const refusjonVurdering = refusjonGrunnlag.gjeldendeVurdering;

  return (
    <div className={styles.kolonne}>
      <Label as="p">Vilkårsvurderinger</Label>
      {/* TODO fjern toggles når verifisert */}
      {isProd() && gjeldendeSykdomsvurdering && (
        <SaksopplysningerKort
          tittel="§11-5 Nedsatt arbeidsevne og krav til årsakssammenheng"
          begrunnelse={gjeldendeSykdomsvurdering.begrunnelse}
        />
      )}
      {/* TODO fjern toggles når verifisert */}
      {isProd() && gjeldendeBistandsbehov && (
        <SaksopplysningerKort
          tittel="§11-6 Behov for bistand til å skaffe seg eller beholde arbeid"
          begrunnelse={gjeldendeBistandsbehov.begrunnelse}
        />
      )}
      {/* TODO fjern toggles når verifisert */}
      {(isDev() || isLocal()) && gjeldendeSykdomsvurderingForBrev && (
        <SaksopplysningerKort
          tittel="Individuell begrunnelse for §§ 11-5 og 11-6"
          begrunnelse={gjeldendeSykdomsvurderingForBrev}
        />
      )}
      {refusjonVurdering?.harKrav && (
        <SaksopplysningerKort
          tittel="Refusjonskrav"
          begrunnelse={`Det er refusjonskrav mot sosialstønad. Refusjonskravet gjelder fra 
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
