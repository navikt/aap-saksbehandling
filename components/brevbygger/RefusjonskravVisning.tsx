import { InfoCard } from '@navikt/ds-react';
import { Dato } from 'lib/types/Dato';
import { RefusjonkravVurderingResponse, RefusjonskravGrunnlag } from 'lib/types/types';

import styles from './RefusjonskravVisning.module.css';

interface Props {
  refusjonskravgrunnlag?: RefusjonskravGrunnlag;
}

export const RefusjonskravVisning = ({ refusjonskravgrunnlag }: Props) => {
  const refusjonVurderinger = refusjonskravgrunnlag?.gjeldendeVurderinger?.filter(
    (vurdering) => vurdering.harKrav === true
  );

  if (!refusjonVurderinger?.length) {
    return null;
  }

  const refusjonVurderingerGruppertPerNavKontor: Map<string, RefusjonkravVurderingResponse[]> =
    refusjonVurderinger && refusjonVurderinger.length > 0
      ? Map.groupBy(refusjonVurderinger, (vurdering) => vurdering.navKontor)
      : new Map();

  return (
    <InfoCard data-color="meta-purple" size="small">
      <InfoCard.Header>Refusjonskrav</InfoCard.Header>
      <InfoCard.Content>
        <dl className={styles.refusjonsliste}>
          {Array.from(refusjonVurderingerGruppertPerNavKontor.entries()).map(([navKontor, vurderinger]) => (
            <div className={styles.refusjonskrav} key={navKontor}>
              <dt className={styles.liste_tittel}>{navKontor}</dt>
              {vurderinger.map((vurdering, index) => (
                <dd key={index}>
                  {vurdering.fom ? new Dato(vurdering.fom).formaterForFrontend() : '-'} til{' '}
                  {vurdering.tom ? new Dato(vurdering.tom).formaterForFrontend() : ''}
                </dd>
              ))}
            </div>
          ))}
        </dl>
      </InfoCard.Content>
    </InfoCard>
  );
};
