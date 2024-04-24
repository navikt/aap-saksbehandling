'use client';

import { FatteVedtakGrunnlag, ToTrinnsVurdering } from 'lib/types/types';
import { ToTrinnsvurderingForm } from 'components/totrinnsvurdering/totrinnsvurderingform/ToTrinnsvurderingForm';

import styles from 'components/totrinnsvurdering/ToTrinnsvurdering.module.css';
import { useState } from 'react';
import { BodyShort, Button, Label, Link, ToggleGroup } from '@navikt/ds-react';
import { Behovstype, mapBehovskodeTilBehovstype } from 'lib/utils/form';
import { useParams } from 'next/navigation';
import { ToTrinnsvurderingHistorikk } from 'components/totrinnsvurdering/totrinnsvurderinghistorikk/ToTrinnsvurderingHistorikk';
import { løsBehov } from 'lib/clientApi';
import { ClockDashedIcon, PersonGavelFillIcon } from '@navikt/aksel-icons';

interface Props {
  fatteVedtakGrunnlag: FatteVedtakGrunnlag;
  behandlingsReferanse: string;
  readOnly: boolean;
}

export interface ToTrinnsVurderingFormFields {
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

  const initialValue: ToTrinnsVurderingFormFields[] = fatteVedtakGrunnlag.vurderinger.map((vurdering) => {
    return {
      definisjon: vurdering.definisjon,
      harBlittRedigert: false,
    };
  });

  const [toTrinnskontrollVurderinger, setToTrinnskontrollVurderinger] =
    useState<ToTrinnsVurderingFormFields[]>(initialValue);
  const [toggleGroupValue, setToggleGroupValue] = useState<string>(readOnly ? 'historikk' : 'totrinnsvurdering');

  const [errors, setErrors] = useState<ToTrinnsvurderingError[]>([]);

  const handleInputChange = (index: number, name: keyof ToTrinnsVurderingFormFields, value: any) => {
    setToTrinnskontrollVurderinger((prevState) =>
      prevState.map((field, id) => (id === index ? { ...field, [name]: value, harBlittRedigert: true } : field))
    );
  };

  return (
    <div className={styles.toTrinnsKontroll}>
      {readOnly && (
        <>
          <Label size={'small'}>Siste vurderinger fra beslutter</Label>
          {fatteVedtakGrunnlag.vurderinger
            .filter((vurdering) => vurdering.godkjent !== undefined && vurdering.begrunnelse !== undefined)
            .map((vurdering, index) => {
              return (
                <div
                  key={index}
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
                    <Link
                      href={`/sak/${params.saksId}/${behandlingsReferanse}/${behovstypeTilVilkårskortLink(vurdering.definisjon as Behovstype)}`}
                    >
                      <BodyShort size={'small'}>
                        {mapBehovskodeTilBehovstype(vurdering.definisjon as Behovstype)}
                      </BodyShort>
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
              );
            })}
        </>
      )}
      <ToggleGroup
        size={'small'}
        defaultValue="lest"
        onChange={(value) => setToggleGroupValue(value)}
        value={toggleGroupValue}
      >
        <ToggleGroup.Item value="totrinnsvurdering" style={{ display: 'flex', flexDirection: 'column' }}>
          <PersonGavelFillIcon aria-hidden />
          <span>Totrinn</span>
        </ToggleGroup.Item>
        <ToggleGroup.Item value="historikk">
          <ClockDashedIcon aria-hidden />
          Historikk
        </ToggleGroup.Item>
      </ToggleGroup>

      {toggleGroupValue === 'historikk' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {fatteVedtakGrunnlag.historikk.map((historikk, index) => (
            <ToTrinnsvurderingHistorikk key={index} historikk={historikk} erFørsteElementILiten={index === 0} />
          ))}
        </div>
      )}

      {toggleGroupValue === 'totrinnsvurdering' && (
        <>
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

          <Button
            size={'medium'}
            onClick={async () => {
              const validerteToTrinnsvurderinger = validerTotrinnsvurderinger(toTrinnskontrollVurderinger);
              if (errors.length === 0 && validerteToTrinnsvurderinger && validerteToTrinnsvurderinger.length > 0) {
                await løsBehov({
                  behandlingVersjon: 0,
                  behov: {
                    behovstype: Behovstype.FATTE_VEDTAK_KODE,
                    vurderinger: validerteToTrinnsvurderinger,
                  },
                  referanse: behandlingsReferanse,
                });
              }
            }}
          >
            Send inn
          </Button>
        </>
      )}
    </div>
  );

  function validerTotrinnsvurderinger(
    toTrinnsvurdering: ToTrinnsVurderingFormFields[]
  ): ToTrinnsVurdering[] | undefined {
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
