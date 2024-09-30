import { Radio } from '@navikt/ds-react';
import { JaEllerNei } from 'lib/utils/form';

import { BarnetilleggFormFields } from 'components/behandlinger/barnetillegg/barnetilleggvurdering/BarnetilleggVurdering';
import { UseFormReturn } from 'react-hook-form';
import { TextAreaWrapper, TextFieldWrapper } from '@navikt/aap-felles-react';
import { RadioGroupWrapper } from 'components/input/RadioGroupWrapper';

import 'components/barn/manueltbarnvurderingfelter/ManueltBarnVurderingFelter.css';
import { erDatoFoerDato, erDatoIFremtiden, validerDato } from 'lib/validation/dateValidation';

interface Props {
  ident: string;
  barneTilleggIndex: number;
  vurderingIndex: number;
  readOnly: boolean;
  form: UseFormReturn<BarnetilleggFormFields>;
}

export const ManueltBarnVurderingFelter = ({ readOnly, barneTilleggIndex, vurderingIndex, form }: Props) => {
  const harForeldreAnsvar =
    form.watch(`barnetilleggVurderinger.${barneTilleggIndex}.vurderinger.${vurderingIndex}.harForeldreAnsvar`) ===
    JaEllerNei.Ja;

  return (
    <div className={'flex-column'}>
      <TextAreaWrapper
        label={'Vurder om det skal gis barnetillegg for barnet'}
        control={form.control}
        name={`barnetilleggVurderinger.${barneTilleggIndex}.vurderinger.${vurderingIndex}.begrunnelse`}
        readOnly={readOnly}
        rules={{ required: 'Du må gi en begrunnelse' }}
      />
      <RadioGroupWrapper
        label={
          'Har innbygger hatt  forsørgeransvar  for fosterbarnet i to år før søknadsdato, eller er forsørgeransvaret av varig karakter?'
        }
        control={form.control}
        name={`barnetilleggVurderinger.${barneTilleggIndex}.vurderinger.${vurderingIndex}.harForeldreAnsvar`}
        readOnly={readOnly}
        rules={{ required: 'Du må besvare om det skal beregnes barnetillegg for barnet' }}
      >
        <Radio value={JaEllerNei.Ja}>Ja</Radio>
        <Radio value={JaEllerNei.Nei}>Nei</Radio>
      </RadioGroupWrapper>

      {harForeldreAnsvar && (
        <div className={'barnetilleggperiode'}>
          <TextFieldWrapper
            label={'Forsørgeransvar fra'}
            control={form.control}
            name={`barnetilleggVurderinger.${barneTilleggIndex}.vurderinger.${vurderingIndex}.fom`}
            type={'text'}
            rules={{
              validate: {
                validerDato: (value) => validerDato(value as string),
                erDatoTilbakeITid: (value) => {
                  if (erDatoIFremtiden(value as string)) {
                    return 'Dato for når søker har forsørgeransvar fra kan ikke være frem i tid';
                  }
                },
              },
            }}
          />
          <TextFieldWrapper
            label={'Til (valgfritt)'}
            control={form.control}
            name={`barnetilleggVurderinger.${barneTilleggIndex}.vurderinger.${vurderingIndex}.tom`}
            type={'text'}
            rules={{
              validate: {
                validerDato: (value, formValues) => {
                  if (formValues.barnetilleggVurderinger[barneTilleggIndex].vurderinger[vurderingIndex].fom !== '')
                    return validerDato(value as string);
                },
                erDatoFoer: (value, formValues) => {
                  if (formValues.barnetilleggVurderinger[barneTilleggIndex].vurderinger[vurderingIndex].fom !== '')
                    if (
                      erDatoFoerDato(
                        value as string,
                        formValues.barnetilleggVurderinger[barneTilleggIndex].vurderinger[vurderingIndex].fom
                      )
                    ) {
                      return 'Slutt-dato kan ikke være før start-dato';
                    }
                },
              },
            }}
          />
        </div>
      )}
    </div>
  );
};
