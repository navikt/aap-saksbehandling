import { SaksopplysningerKort } from 'components/behandlinger/brev/skriveBrev/SaksopplysningerKort';
import styles from './SaksopplysningerKolonne.module.css';
import { Label } from '@navikt/ds-react';
import { RefusjonskravGrunnlag, SykdomsvurderingBrevGrunnlag } from 'lib/types/types';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { parse } from 'date-fns';

interface Props {
  refusjonGrunnlag: RefusjonskravGrunnlag;
  sykdomsvurderingBrevGrunnlag?: SykdomsvurderingBrevGrunnlag;
}

export const SaksopplysningerKolonne = ({ refusjonGrunnlag, sykdomsvurderingBrevGrunnlag }: Props) => {
  const gjeldendeSykdomsvurderingForBrev = sykdomsvurderingBrevGrunnlag?.vurdering?.vurdering;
  const refusjonVurderinger = refusjonGrunnlag.gjeldendeVurderinger;

  return (
    <div className={styles.kolonne}>
      <Label as="p">Vilkårsvurderinger</Label>

      {gjeldendeSykdomsvurderingForBrev && (
        <SaksopplysningerKort
          tittel="Individuell begrunnelse for §§ 11-5 og 11-6"
          begrunnelse={gjeldendeSykdomsvurderingForBrev}
        />
      )}
      {refusjonVurderinger &&
        refusjonVurderinger.length > 0 &&
        refusjonVurderinger
          .filter((refusjonVurdering) => refusjonVurdering.harKrav === true)
          .map((refusjonVurdering, index) => {
            return (
              <SaksopplysningerKort
                key={refusjonVurdering.navKontor ?? index}
                tittel={`Refusjonskrav ${refusjonVurdering.navKontor}`}
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
            );
          })}
    </div>
  );
};
