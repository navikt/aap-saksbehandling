import { ToTrinnsVurdering } from 'lib/types/types';
import { BodyShort, Label } from '@navikt/ds-react';
import { Behovstype, mapBehovskodeTilBehovstype } from 'lib/utils/form';
import { behovstypeTilVilkårskortLink } from 'components/totrinnsvurdering/ToTrinnsvurdering';
import Link from 'next/link';

interface Props {
  vurderinger: ToTrinnsVurdering[];
  link: string;
}

export const Oppsummering = ({ vurderinger, link }: Props) => {
  return (
    <div>
      <Label size={'small'}>Siste vurderinger fra beslutter</Label>
      {vurderinger.map((vurdering) => (
        <div
          key={vurdering.definisjon}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            border: '2px solid black',
            padding: '1rem',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Label size={'small'}>Vilkår</Label>
            <Link href={`${link}/${behovstypeTilVilkårskortLink(vurdering.definisjon as Behovstype)}`}>
              <BodyShort size={'small'}>{mapBehovskodeTilBehovstype(vurdering.definisjon as Behovstype)}</BodyShort>
            </Link>
          </div>

          <div>
            <Label size={'small'}>godkjent?</Label>
            <BodyShort size={'small'}>{vurdering.godkjent ? 'Ja' : 'Nei'}</BodyShort>
          </div>

          {vurdering.begrunnelse && (
            <div>
              <Label size={'small'}>Begrunnelse</Label>
              <BodyShort size={'small'}>{vurdering.begrunnelse}</BodyShort>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
