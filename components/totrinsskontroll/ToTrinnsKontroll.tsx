'use client';

import { FatteVedtakGrunnlag, HistorikkAksjon, ToTrinnsVurdering } from 'lib/types/types';
import { ToTrinnsKontrollForm } from 'components/totrinsskontroll/totrinnskontrollform/ToTrinnsKontrollForm';

import styles from 'components/totrinsskontroll/ToTrinnsKontroll.module.css';
import { useState } from 'react';
import { BodyShort, Button, Label } from '@navikt/ds-react';
import { løsBehov } from 'lib/clientApi';
import { Behovstype } from 'lib/utils/form';
import { formaterDatoTidForVisning } from '@navikt/aap-felles-utils-client';
import { useParams } from 'next/navigation';

interface Props {
  fatteVedtakGrunnlag: FatteVedtakGrunnlag;
  behandlingsReferanse: string;
  readOnly: boolean;
}

export const ToTrinnsKontroll = ({ fatteVedtakGrunnlag, behandlingsReferanse, readOnly }: Props) => {
  const params = useParams();
  const [toTrinnskontrollVurderinger, setToTrinnskontrollVurderinger] = useState<ToTrinnsVurdering[]>([]);

  return (
    <div className={styles.toTrinnsKontroll}>
      <Label size={'medium'}>Historikk</Label>
      <div>
        {fatteVedtakGrunnlag.historikk.map((historikk, index) => (
          <div key={index} className={index === 0 ? styles.historikkTopp : styles.historikkImidten}>
            <Label size={'small'}>{mapAksjonTilString(historikk.aksjon)}</Label>
            <BodyShort size={'small'}>
              {formaterDatoTidForVisning(historikk.tidspunkt)} {historikk.avIdent}
            </BodyShort>
          </div>
        ))}
      </div>

      {fatteVedtakGrunnlag.vurderinger.map((vurdering) => (
        <ToTrinnsKontrollForm
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

function mapAksjonTilString(aksjon: HistorikkAksjon): string {
  switch (aksjon) {
    case 'RETURNERT_FRA_BESLUTTER':
      return 'Returnert fra beslutter';
    case 'FATTET_VEDTAK':
      return 'Fattet vedtak';
    case 'SENDT_TIL_BESLUTTER':
      return 'Sendt til beslutter';
  }
}
