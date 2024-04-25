import { BeslutterForm } from 'components/totrinnsvurdering/totrinnsvurderingform/beslutterform/BeslutterForm';
import { Behovstype } from 'lib/utils/form';
import { Button } from '@navikt/ds-react';
import { løsBehov } from 'lib/clientApi';
import { FatteVedtakGrunnlag, ToTrinnsVurdering } from 'lib/types/types';
import {
  behovstypeTilVilkårskortLink,
  ToTrinnsvurderingError,
  ToTrinnsVurderingFormFields,
} from 'components/totrinnsvurdering/ToTrinnsvurdering';
import { useState } from 'react';

interface Props {
  fatteVedtakGrunnlag: FatteVedtakGrunnlag;
  link: string;
  readOnly: boolean;
  behandlingsReferanse: string;
}

export const TotrinnsvurderingForm = ({ fatteVedtakGrunnlag, link, readOnly, behandlingsReferanse }: Props) => {
  const initialValue: ToTrinnsVurderingFormFields[] = fatteVedtakGrunnlag.vurderinger.map((vurdering) => {
    return {
      definisjon: vurdering.definisjon,
      harBlittRedigert: false,
    };
  });

  const [errors, setErrors] = useState<ToTrinnsvurderingError[]>([]);
  const [vurderinger, setVurderinger] = useState<ToTrinnsVurderingFormFields[]>(initialValue);

  const handleInputChange = (index: number, name: keyof ToTrinnsVurderingFormFields, value: string | string[]) => {
    setVurderinger((prevState) =>
      prevState.map((field, id) => (id === index ? { ...field, [name]: value, harBlittRedigert: true } : field))
    );
  };

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

  return (
    <>
      {vurderinger.map((vurdering, index) => (
        <BeslutterForm
          key={vurdering.definisjon}
          toTrinnsvurdering={vurdering}
          oppdaterVurdering={handleInputChange}
          errors={errors.filter((error) => error.definisjon === vurdering.definisjon)}
          index={index}
          link={`${link}/${behovstypeTilVilkårskortLink(vurdering.definisjon as Behovstype)}`}
          readOnly={readOnly}
        />
      ))}

      <Button
        size={'medium'}
        onClick={async () => {
          const validerteToTrinnsvurderinger = validerTotrinnsvurderinger(vurderinger);
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
  );
};
