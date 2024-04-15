'use client';

import { FatteVedtakGrunnlag, ToTrinnsVurdering } from 'lib/types/types';
import { ToTrinnsKontrollForm } from 'components/totrinsskontroll/totrinnskontrollform/ToTrinnsKontrollForm';

import styles from 'components/totrinsskontroll/ToTrinnsKontroll.module.css';
import stylesHello from './totrinnskontrollform/ToTrinnsKontrollForm.module.css';
import { useState } from 'react';
import { BodyShort, Button, Label } from '@navikt/ds-react';
import { løsBehov } from 'lib/clientApi';
import { Behovstype } from 'lib/utils/form';
import { formaterDatoTidForVisning } from '@navikt/aap-felles-utils-client';

interface Props {
  fatteVedtakGrunnlag: FatteVedtakGrunnlag;
  behandlingsReferanse: string;
  sendtTilbakeFraBeslutter: boolean;
}

export const ToTrinnsKontroll = ({ fatteVedtakGrunnlag, behandlingsReferanse, sendtTilbakeFraBeslutter }: Props) => {
  const [toTrinnskontrollVurderinger, setToTrinnskontrollVurderinger] = useState<ToTrinnsVurdering[]>([]);

  return (
    <div className={styles.toTrinnsKontroll}>
      <div className={stylesHello.form}>
        <Label size={'medium'}>Historikk</Label>
        {fatteVedtakGrunnlag.historikk.map((historikk, index) => (
          <div key={index}>
            <BodyShort size={'small'}>
              {historikk.avIdent} {formaterDatoTidForVisning(historikk.tidspunkt)}
            </BodyShort>
          </div>
        ))}
      </div>

      {fatteVedtakGrunnlag.vurderinger.map((vurderinger) => (
        <ToTrinnsKontrollForm
          definisjon={vurderinger.definisjon}
          key={vurderinger.definisjon}
          lagreToTrinnskontroll={(toTrinnskontroll) =>
            setToTrinnskontrollVurderinger([...toTrinnskontrollVurderinger, toTrinnskontroll])
          }
          sendtTilbakeFraBeslutter={sendtTilbakeFraBeslutter}
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
        Send inn
      </Button>
    </div>
  );
};
