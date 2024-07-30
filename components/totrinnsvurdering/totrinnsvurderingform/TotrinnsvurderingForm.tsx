import { TotrinnnsvurderingFelter } from 'components/totrinnsvurdering/totrinnsvurderingform/beslutterform/TotrinnnsvurderingFelter';
import { Behovstype } from 'lib/utils/form';
import { Alert, Button } from '@navikt/ds-react';
import { FatteVedtakGrunnlag, KvalitetssikringGrunnlag, ToTrinnsVurdering } from 'lib/types/types';
import {
  behovstypeTilVilkårskortLink,
  ToTrinnsvurderingError,
  ToTrinnsVurderingFormFields,
} from 'components/totrinnsvurdering/ToTrinnsvurdering';
import { useState } from 'react';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';

interface Props {
  grunnlag: FatteVedtakGrunnlag | KvalitetssikringGrunnlag;
  link: string;
  erKvalitetssikring: boolean;
  readOnly: boolean;
  behandlingsReferanse: string;
  behandlingVersjon: number;
}

export const TotrinnsvurderingForm = ({
  grunnlag,
  link,
  readOnly,
  behandlingsReferanse,
  behandlingVersjon,
  erKvalitetssikring,
}: Props) => {
  const { løsBehovOgGåTilNesteSteg, isLoading } = useLøsBehovOgGåTilNesteSteg(
    erKvalitetssikring ? 'KVALITETSSIKRING' : 'FATTE_VEDTAK'
  );
  const initialValue: ToTrinnsVurderingFormFields[] = grunnlag.vurderinger.map((vurdering) => {
    return {
      definisjon: vurdering.definisjon,
      harBlittRedigert: false,
    };
  });

  const [toTrinnsvurderingErrors, setToTrinnsvurderingErrors] = useState<ToTrinnsvurderingError[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [vurderinger, setVurderinger] = useState<ToTrinnsVurderingFormFields[]>(initialValue);

  const handleInputChange = (index: number, name: keyof ToTrinnsVurderingFormFields, value: string | string[]) => {
    setVurderinger((prevState) =>
      prevState.map((field, id) => (id === index ? { ...field, [name]: value, harBlittRedigert: true } : field))
    );
  };

  function validerTotrinnsvurderinger(
    toTrinnsvurdering: ToTrinnsVurderingFormFields[]
  ): ToTrinnsVurdering[] | undefined {
    setToTrinnsvurderingErrors([]);
    setErrorMessage(undefined);
    const errors: ToTrinnsvurderingError[] = [];
    const validatedVurderinger: ToTrinnsVurdering[] = [];

    const harIkkeBlittVurdert = toTrinnsvurdering.every((vurdering) => !vurdering.harBlittRedigert);

    if (harIkkeBlittVurdert) {
      setErrorMessage('Du må gjøre minst én vurdering.');
    }

    toTrinnsvurdering.forEach((vurdering) => {
      if (vurdering.harBlittRedigert) {
        if (vurdering.godkjent === 'true') {
          validatedVurderinger.push({
            definisjon: vurdering.definisjon,
            godkjent: true,
            grunner: [],
          });
        } else if (
          vurdering.godkjent === 'false' &&
          vurdering.begrunnelse &&
          vurdering.grunner &&
          vurdering.grunner.length > 0
        ) {
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
          if (!vurdering.grunner || vurdering.grunner.length === 0) {
            errors.push({ felt: 'grunner', definisjon: vurdering.definisjon, message: 'Du må oppgi en grunn' });
          }
          if (vurdering.grunner?.find((grunn) => grunn === 'ANNET') && !vurdering.årsakFritekst) {
            errors.push({ felt: 'årsakFritekst', definisjon: vurdering.definisjon, message: 'Du må skrive en grunn' });
          }
        }
      }
    });

    setToTrinnsvurderingErrors(errors);

    return errors.length > 0 ? undefined : validatedVurderinger;
  }

  return (
    <>
      {vurderinger.map((vurdering, index) => (
        <TotrinnnsvurderingFelter
          key={vurdering.definisjon}
          toTrinnsvurdering={vurdering}
          erKvalitetssikring={erKvalitetssikring}
          oppdaterVurdering={handleInputChange}
          errors={toTrinnsvurderingErrors.filter((error) => error.definisjon === vurdering.definisjon)}
          index={index}
          link={`${link}/${behovstypeTilVilkårskortLink(vurdering.definisjon as Behovstype)}`}
          readOnly={readOnly}
        />
      ))}

      {!readOnly && (
        <Button
          size={'medium'}
          className={'fit-content-button'}
          loading={isLoading}
          onClick={async () => {
            const validerteToTrinnsvurderinger = validerTotrinnsvurderinger(vurderinger);
            if (
              toTrinnsvurderingErrors.length === 0 &&
              validerteToTrinnsvurderinger &&
              validerteToTrinnsvurderinger.length > 0
            ) {
              løsBehovOgGåTilNesteSteg({
                behandlingVersjon: behandlingVersjon,
                behov: {
                  behovstype: erKvalitetssikring ? Behovstype.KVALITETSSIKRING_KODE : Behovstype.FATTE_VEDTAK_KODE,
                  vurderinger: validerteToTrinnsvurderinger,
                },
                referanse: behandlingsReferanse,
              });
            }
          }}
        >
          Send inn
        </Button>
      )}
      {errorMessage && <Alert variant={'error'}>{errorMessage}</Alert>}
    </>
  );
};
