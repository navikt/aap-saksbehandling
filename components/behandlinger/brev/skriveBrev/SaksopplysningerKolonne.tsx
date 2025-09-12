import { SaksopplysningerKort } from 'components/behandlinger/brev/skriveBrev/SaksopplysningerKort';
import styles from './SaksopplysningerKolonne.module.css';
import { Label } from '@navikt/ds-react';
import { Aktivitetsplikt11_7Grunnlag, RefusjonskravGrunnlag, SykdomsvurderingBrevGrunnlag } from 'lib/types/types';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { parse } from 'date-fns';

interface Props {
  refusjonGrunnlag: RefusjonskravGrunnlag;
  sykdomsvurderingBrevGrunnlag?: SykdomsvurderingBrevGrunnlag;
  aktivitetsplikt11_7Grunnlag?: Aktivitetsplikt11_7Grunnlag;
}

export const SaksopplysningerKolonne = ({
  refusjonGrunnlag,
  sykdomsvurderingBrevGrunnlag,
  aktivitetsplikt11_7Grunnlag,
}: Props) => {
  const gjeldendeSykdomsvurderingForBrev = sykdomsvurderingBrevGrunnlag?.vurdering?.vurdering;
  const refusjonVurdering = refusjonGrunnlag.gjeldendeVurdering;
  const aktivitetspliktVurdering = aktivitetsplikt11_7Grunnlag?.vurdering;

  return (
    <div className={styles.kolonne}>
      <Label as="p">Vilkårsvurderinger</Label>

      {gjeldendeSykdomsvurderingForBrev && (
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
      {aktivitetspliktVurdering && (
        <SaksopplysningerKort tittel="Vurdering § 11-7" begrunnelse={aktivitetspliktVurdering.begrunnelse} />
      )}
    </div>
  );
};
