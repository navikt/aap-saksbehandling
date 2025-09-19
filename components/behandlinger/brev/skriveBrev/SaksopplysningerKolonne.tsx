import { SaksopplysningerKort } from 'components/behandlinger/brev/skriveBrev/SaksopplysningerKort';
import styles from './SaksopplysningerKolonne.module.css';
import { Label } from '@navikt/ds-react';
import {
  RefusjonkravVurderingResponse,
  Aktivitetsplikt11_7Grunnlag,
  RefusjonskravGrunnlag,
  SykdomsvurderingBrevGrunnlag,
} from 'lib/types/types';
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
  const aktivitetspliktVurdering = aktivitetsplikt11_7Grunnlag?.vurdering;
  const refusjonVurderinger = refusjonGrunnlag?.gjeldendeVurderinger?.filter((vurdering) => vurdering.harKrav === true);
  const refusjonVurderingerGruppertPerNavKontor: Map<string, RefusjonkravVurderingResponse[]> =
    refusjonVurderinger && refusjonVurderinger.length > 0
      ? Map.groupBy(refusjonVurderinger, (vurdering) => vurdering.navKontor)
      : new Map();

  return (
    <div className={styles.kolonne}>
      <Label as="p">Vilkårsvurderinger</Label>

      {gjeldendeSykdomsvurderingForBrev && (
        <SaksopplysningerKort
          tittel="Individuell begrunnelse for §§ 11-5 og 11-6"
          begrunnelse={gjeldendeSykdomsvurderingForBrev}
        />
      )}
      {refusjonVurderinger && refusjonVurderinger.length > 0 && (
        <SaksopplysningerKort tittel={`Refusjonskrav`}>
          <dl>
            {Array.from(refusjonVurderingerGruppertPerNavKontor.entries()).map(([navKontor, vurderinger]) => (
              <div className={styles.refusjonskrav} key={navKontor}>
                <dt className={styles.liste_tittel}>{navKontor}</dt>
                {vurderinger.map((vurdering, index) => (
                  <dd key={index}>
                    {vurdering.fom ? formaterDatoForFrontend(parse(vurdering.fom, 'yyyy-MM-dd', new Date())) : '-'} til{' '}
                    {vurdering.tom ? formaterDatoForFrontend(parse(vurdering.tom, 'yyyy-MM-dd', new Date())) : ''}
                  </dd>
                ))}
              </div>
            ))}
          </dl>
        </SaksopplysningerKort>
      )}
      {aktivitetspliktVurdering && (
        <SaksopplysningerKort tittel="Vurdering § 11-7" begrunnelse={aktivitetspliktVurdering.begrunnelse} />
      )}
    </div>
  );
};
