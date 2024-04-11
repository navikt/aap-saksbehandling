'use client';

import { FatteVedtakGrunnlag, ToTrinnsVurdering } from 'lib/types/types';
import { ToTrinnsKontrollForm } from 'components/totrinsskontroll/totrinnskontrollform/ToTrinnsKontrollForm';

import styles from 'components/totrinsskontroll/ToTrinnsKontroll.module.css';
import { useState } from 'react';
import { Button } from '@navikt/ds-react';
import { løsBehov } from 'lib/clientApi';
import { Behovstype } from 'lib/utils/form';

interface Props {
  fatteVedtakGrunnlag: FatteVedtakGrunnlag;
  behandlingsReferanse: string;
}

export const ToTrinnsKontroll = ({ fatteVedtakGrunnlag, behandlingsReferanse }: Props) => {
  const [toTrinnskontrollVurderinger, setToTrinnskontrollVurderinger] = useState<ToTrinnsVurdering[]>([]);

  return (
    <div className={styles.toTrinnsKontroll}>
      {fatteVedtakGrunnlag.vurderinger.map((vurderinger) => (
        <ToTrinnsKontrollForm
          definisjon={vurderinger.definisjon}
          key={vurderinger.definisjon}
          lagreToTrinnskontroll={(toTrinnskontroll) =>
            setToTrinnskontrollVurderinger([...toTrinnskontrollVurderinger, toTrinnskontroll])
          }
        />
      ))}
      <Button
        size={'medium'}
        onClick={async () => {
          await løsBehov({
            behandlingVersjon: 0,
            behov: {
              behovstype: Behovstype.FATTE_VEDTAK_KODE,
              vurderinger: toTrinnskontrollVurderinger,
            },
            referanse: behandlingsReferanse,
          });
        }}
      >
        Send inn to-trinnskontroll!
      </Button>
    </div>
  );
};
