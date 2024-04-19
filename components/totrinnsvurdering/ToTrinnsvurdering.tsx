'use client';

import { FatteVedtakGrunnlag, ToTrinnsVurdering } from 'lib/types/types';
import { ToTrinnsvurderingForm } from 'components/totrinnsvurdering/totrinnsvurderingform/ToTrinnsvurderingForm';

import styles from 'components/totrinnsvurdering/ToTrinnsvurdering.module.css';
import { useState } from 'react';
import { Button } from '@navikt/ds-react';
import { løsBehov } from 'lib/clientApi';
import { Behovstype } from 'lib/utils/form';
import { useParams } from 'next/navigation';
import { ToTrinnsvurderingHistorikk } from 'components/totrinnsvurdering/totrinnsvurderinghistorikk/ToTrinnsvurderingHistorikk';

interface Props {
  fatteVedtakGrunnlag: FatteVedtakGrunnlag;
  behandlingsReferanse: string;
  readOnly: boolean;
}

export const ToTrinnsvurdering = ({ fatteVedtakGrunnlag, behandlingsReferanse, readOnly }: Props) => {
  const params = useParams();
  const [toTrinnskontrollVurderinger, setToTrinnskontrollVurderinger] = useState<ToTrinnsVurdering[]>([]);

  return (
    <div className={styles.toTrinnsKontroll}>
      <div>
        {fatteVedtakGrunnlag.historikk.map((historikk, index) => (
          <ToTrinnsvurderingHistorikk key={index} historikk={historikk} erFørsteElementILiten={index === 0} />
        ))}
      </div>

      {fatteVedtakGrunnlag.vurderinger.map((vurdering) => (
        <ToTrinnsvurderingForm
          toTrinnsVurdering={vurdering}
          key={vurdering.definisjon}
          lagreToTrinnskontroll={(toTrinnskontroll) =>
            setToTrinnskontrollVurderinger([...toTrinnskontrollVurderinger, toTrinnskontroll])
          }
          link={`/sak/${params.saksId}/${behandlingsReferanse}/${behovstypeTilVilkårskortLink(vurdering.definisjon as Behovstype)}`}
          readOnly={readOnly}
        />
      ))}

      {!readOnly && (
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
      )}
    </div>
  );
};

function behovstypeTilVilkårskortLink(behovstype: Behovstype): string {
  switch (behovstype) {
    case Behovstype.AVKLAR_SYKDOM_KODE:
      return 'SYKDOM/#AVKLAR_SYKDOM';
    case Behovstype.AVKLAR_BISTANDSBEHOV_KODE:
      return 'SYKDOM/#VURDER_BISTANDSBEHOV';
    case Behovstype.FASTSETT_BEREGNINGSTIDSPUNKT_KODE:
      return 'GRUNNLAG/#FASTSETT_BEREGNINGSTIDSPUNKT';
    case Behovstype.FRITAK_MELDEPLIKT_KODE:
      return 'SYKDOM/#FRITAK_MELDEPLIKT';
    case Behovstype.FASTSETT_ARBEIDSEVNE_KODE:
      return 'SYKDOM/#FASTSETT_ARBEIDSEVNE';
    case Behovstype.VURDER_SYKEPENGEERSTATNING_KODE:
      return 'SYKDOM/#VURDER_SYKEPENGEERSTATNING';
    default:
      return 'SYKDOM';
  }
}
