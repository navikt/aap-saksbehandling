import { SaksopplysningerKort } from 'components/behandlinger/brev/skriveBrev/SaksopplysningerKort';
import styles from './SaksopplysningerKolonne.module.css';
import { Label } from '@navikt/ds-react';
import { RefusjonskravGrunnlag, SykdomsvurderingBrevGrunnlag, RefusjonkravVurderingResponse } from 'lib/types/types';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { parse } from 'date-fns';

interface Props {
  refusjonGrunnlag: RefusjonskravGrunnlag;
  sykdomsvurderingBrevGrunnlag?: SykdomsvurderingBrevGrunnlag;
}

// Using own groupBy for now.. replace with ES2024's Map.groupBy later..
function groupByPreES2024<T, K>(array: T[], getKey: (item: T) => K): Map<K, T[]> {
  const result = new Map<K, T[]>();
  for (const item of array) {
    const key = getKey(item);
    if (!result.has(key)) {
      result.set(key, []);
    }
    result.get(key)!.push(item);
  }
  return result;
}

export const SaksopplysningerKolonne = ({ refusjonGrunnlag, sykdomsvurderingBrevGrunnlag }: Props) => {
  const gjeldendeSykdomsvurderingForBrev = sykdomsvurderingBrevGrunnlag?.vurdering?.vurdering;
  const refusjonVurderinger = refusjonGrunnlag?.gjeldendeVurderinger?.filter(vurdering => vurdering.harKrav === true);
  const refusjonVurderingerNavKontorGruppert : Map<string, RefusjonkravVurderingResponse[]> =
    (refusjonVurderinger && refusjonVurderinger.length > 0) ?
        groupByPreES2024(refusjonVurderinger, (vurdering) => vurdering.navKontor) : new Map();

  return (
    <div className={styles.kolonne}>
      <Label as="p">Vilkårsvurderinger</Label>

      {gjeldendeSykdomsvurderingForBrev && (
        <SaksopplysningerKort
          tittel="Individuell begrunnelse for §§ 11-5 og 11-6"
          begrunnelse={gjeldendeSykdomsvurderingForBrev}
        />
      )}
      {refusjonVurderinger
          && refusjonVurderinger.length > 0 && (
              <SaksopplysningerKort
                tittel={`Refusjonskrav`}
                begrunnelse={`Det er refusjonskrav mot sosialstønad. Refusjonskravet gjelder:
                             ${Array.from(refusjonVurderingerNavKontorGruppert.entries())
                                 .map(([navKontor, vurderinger]) => `
${navKontor}${vurderinger
    .map(vurdering => `
          ${
            vurdering.fom
              ? formaterDatoForFrontend(parse(vurdering.fom, 'yyyy-MM-dd', new Date()))
              : '-'
          } til ${
             vurdering.tom
               ? formaterDatoForFrontend(parse(vurdering.tom, 'yyyy-MM-dd', new Date()))
               : ''
          }`).join('')}
                                 `).join('')
                             }
                `}
              />
        )
      }
    </div>
  );
};
