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

  const [isLoading, setIsLoading] = useState(false);
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
            grunner: [],
          });
        } else if (vurdering.godkjent === 'false' && vurdering.begrunnelse && vurdering.grunner) {
          validatedVurderinger.push({
            definisjon: vurdering.definisjon,
            godkjent: false,
            begrunnelse: vurdering.begrunnelse,
            grunner: vurdering.grunner.map((grunn) => {
              return {
                årsak: grunn,
                årsakFritekst: grunn === 'ANNET' ? vurdering.årsakFritekst : undefined,
              };
            }),
          });
        } else {
          if (!vurdering.begrunnelse) {
            errors.push({ felt: 'begrunnelse', definisjon: vurdering.definisjon, message: 'Du må gi en begrunnelse' });
          }
          if (!vurdering.grunner) {
            errors.push({ felt: 'grunner', definisjon: vurdering.definisjon, message: 'Du må oppgi en grunn' });
          }
          if (vurdering.grunner?.find((grunn) => grunn === 'ANNET') && !vurdering.årsakFritekst) {
            errors.push({ felt: 'årsakFritekst', definisjon: vurdering.definisjon, message: 'Du må skrive en grunn' });
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

      {!readOnly && (
        <Button
          size={'medium'}
          loading={isLoading}
          onClick={async () => {
            setIsLoading(true);
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
            setIsLoading(false);
          }}
        >
          Send inn
        </Button>
      )}
    </>
  );
};
