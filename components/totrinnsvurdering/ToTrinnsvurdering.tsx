'use client';

import { FatteVedtakGrunnlag, ToTrinnsVurdering } from 'lib/types/types';
import { ToTrinnsvurderingForm } from 'components/totrinnsvurdering/totrinnsvurderingform/ToTrinnsvurderingForm';

import styles from 'components/totrinnsvurdering/ToTrinnsvurdering.module.css';
import { useState } from 'react';
import { Button } from '@navikt/ds-react';
import { Behovstype } from 'lib/utils/form';
import { useParams } from 'next/navigation';
import { ToTrinnsvurderingHistorikk } from 'components/totrinnsvurdering/totrinnsvurderinghistorikk/ToTrinnsvurderingHistorikk';
import { løsBehov } from 'lib/clientApi';

interface Props {
  fatteVedtakGrunnlag: FatteVedtakGrunnlag;
  behandlingsReferanse: string;
  readOnly: boolean;
}

export interface Something {
  godkjent?: string;
  begrunnelse?: string;
  grunn?: string[];
  harBlittRedigert: boolean;
  definisjon: string;
}

export interface ToTrinnsvurderingError {
  definisjon: string;
  felt: string;
  message: string;
}

export const ToTrinnsvurdering = ({ fatteVedtakGrunnlag, behandlingsReferanse, readOnly }: Props) => {
  const params = useParams();

  // @ts-ignore
  const initialValue: Something[] = fatteVedtakGrunnlag.vurderinger.map((vurdering) => {
    return {
      definisjon: vurdering.definisjon,
      begrunnelse: vurdering.begrunnelse,
      godkjent: vurdering.godkjent,
      harBlittRedigert: false,
    };
  });

  const [toTrinnskontrollVurderinger, setToTrinnskontrollVurderinger] = useState<Something[]>(initialValue);
  const [errors, setErrors] = useState<ToTrinnsvurderingError[]>([]);

  console.log('toTrinnskontrollVurderinger', toTrinnskontrollVurderinger);
  console.log('errors', errors);

  const handleInputChange = (index: number, name: keyof Something, value: any) => {
    setToTrinnskontrollVurderinger((prevState) =>
      prevState.map((field, id) => (id === index ? { ...field, [name]: value, harBlittRedigert: true } : field))
    );
  };

  return (
    <div className={styles.toTrinnsKontroll}>
      <div>
        {fatteVedtakGrunnlag.historikk.map((historikk, index) => (
          <ToTrinnsvurderingHistorikk key={index} historikk={historikk} erFørsteElementILiten={index === 0} />
        ))}
      </div>

      {toTrinnskontrollVurderinger.map((vurdering, index) => (
        <ToTrinnsvurderingForm
          key={vurdering.definisjon}
          toTrinnsvurdering={vurdering}
          oppdaterVurdering={handleInputChange}
          errors={errors.filter((error) => error.definisjon === vurdering.definisjon)}
          index={index}
          link={`/sak/${params.saksId}/${behandlingsReferanse}/${behovstypeTilVilkårskortLink(vurdering.definisjon as Behovstype)}`}
          readOnly={readOnly}
        />
      ))}

      {!readOnly && (
        <Button
          size={'medium'}
          onClick={async () => {
            const validatedToTrinnsvurderinger = validerTotrinnsvurderinger(toTrinnskontrollVurderinger);
            if (errors.length === 0 && validatedToTrinnsvurderinger && validatedToTrinnsvurderinger.length > 0) {
              await løsBehov({
                behandlingVersjon: 0,
                behov: {
                  behovstype: Behovstype.FATTE_VEDTAK_KODE,
                  vurderinger: validatedToTrinnsvurderinger,
                },
                referanse: behandlingsReferanse,
              });
            }
          }}
        >
          Send inn
        </Button>
      )}
    </div>
  );

  function validerTotrinnsvurderinger(toTrinnsvurdering: Something[]): ToTrinnsVurdering[] | undefined {
    setErrors([]);
    const errors: ToTrinnsvurderingError[] = [];
    const validatedVurderinger: ToTrinnsVurdering[] = [];

    toTrinnsvurdering.forEach((vurdering) => {
      if (vurdering.harBlittRedigert) {
        if (vurdering.godkjent === 'true') {
          validatedVurderinger.push({
            definisjon: vurdering.definisjon,
            godkjent: true,
          });
        } else if (vurdering.godkjent === 'false' && vurdering.begrunnelse && vurdering.grunn) {
          validatedVurderinger.push({
            definisjon: vurdering.definisjon,
            godkjent: false,
            begrunnelse: vurdering.begrunnelse,
          });
        } else {
          if (vurdering.begrunnelse === undefined) {
            errors.push({ felt: 'begrunnelse', definisjon: vurdering.definisjon, message: 'Du må gi en begrunnelse' });
          }
          if (vurdering.grunn === undefined) {
            errors.push({ felt: 'grunn', definisjon: vurdering.definisjon, message: 'Du må oppgi en grunn' });
          }
        }
      }
    });

    console.log(validatedVurderinger);
    setErrors(errors);

    return errors.length > 0 ? undefined : validatedVurderinger;
  }
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
