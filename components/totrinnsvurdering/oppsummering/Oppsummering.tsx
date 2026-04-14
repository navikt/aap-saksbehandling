import { ToTrinnsVurdering } from 'lib/types/types';
import { BodyShort, Label } from '@navikt/ds-react';
import { Behovstype, mapBehovskodeTilBehovstype } from 'lib/utils/form';
import Link from 'next/link';

import styles from './Oppsummering.module.css';
import { mapGrunnTilString } from 'lib/utils/oversettelser';
import { byggVilkårskortLenke } from 'lib/utils/vilkårskort';
import { useBehandlingsReferanse, useSaksnummer } from 'hooks/saksbehandling/BehandlingHook';

interface Props {
  vurderinger: ToTrinnsVurdering[];
  erKvalitetssikrer: boolean;
}

export const Oppsummering = ({ vurderinger, erKvalitetssikrer }: Props) => {
  const [saksnummer, behandlingsreferanse] = [useSaksnummer(), useBehandlingsReferanse()];

  return (
    <div className={styles.oppsummering}>
      <Label size={'small'}>{`Siste vurderinger fra ${erKvalitetssikrer ? 'kvalitetssikrer' : 'beslutter'}`}</Label>
      {vurderinger.map((vurdering) => (
        <div key={vurdering.definisjon} className={styles.beslutteroppsummering}>
          <div>
            <Label size={'small'}>Vilkår</Label>
            <Link href={byggVilkårskortLenke(saksnummer, behandlingsreferanse, vurdering.definisjon as Behovstype)}>
              <BodyShort size={'small'}>{mapBehovskodeTilBehovstype(vurdering.definisjon as Behovstype)}</BodyShort>
            </Link>
          </div>

          <div>
            <Label size={'small'}>Godkjent?</Label>
            <BodyShort size={'small'}>{vurdering.godkjent ? 'Ja' : 'Nei'}</BodyShort>
          </div>

          {vurdering.begrunnelse != '' && (
            <div>
              <Label size={'small'}>Begrunnelse</Label>
              <BodyShort size={'small'} className={styles.begrunnelse}>
                {vurdering.begrunnelse}
              </BodyShort>
            </div>
          )}

          {vurdering.grunner && vurdering.grunner?.length > 0 && (
            <div>
              <Label size={'small'}>Grunner</Label>
              {vurdering.grunner.map((grunn, index) => (
                <BodyShort key={index} size={'small'}>
                  {grunn.årsak !== 'ANNET' ? mapGrunnTilString(grunn.årsak) : grunn.årsakFritekst}
                </BodyShort>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
