import { useState } from 'react';

import { Button, Radio } from '@navikt/ds-react';
import { PlusIcon } from '@navikt/aksel-icons';
import { JaEllerNei } from 'lib/utils/form';

import { BarnetilleggFormFields } from 'components/behandlinger/barnetillegg/barnetilleggvurdering/BarnetilleggVurdering';
import { UseFormReturn } from 'react-hook-form';
import { TextAreaWrapper, TextFieldWrapper } from '@navikt/aap-felles-react';
import { RadioGroupWrapper } from 'components/input/RadioGroupWrapper';
import { isBefore, isFuture } from 'date-fns';
import { DATO_FORMATER, stringToDate } from 'lib/utils/date';

import 'components/barn/manueltbarnvurderingfelter/ManueltBarnVurderingFelter.css';

interface Props {
  ident: string;
  barneTilleggIndex: number;
  vurderingIndex: number;
  readOnly: boolean;
  form: UseFormReturn<BarnetilleggFormFields>;
}

export const ManueltBarnVurderingFelter = ({ readOnly, barneTilleggIndex, vurderingIndex, form }: Props) => {
  const [leggTilSluttDato, setLeggTilSluttDato] = useState(false);

  const harForeldreAnsvar =
    form.watch(`barnetilleggVurderinger.${barneTilleggIndex}.vurderinger.${vurderingIndex}.harForeldreAnsvar`) ===
    JaEllerNei.Ja;

  return (
    <div className={'flex-column'}>
      <TextAreaWrapper
        label={'Vurder §11-20 og om det skal beregnes barnetillegg for dette barnet'}
        control={form.control}
        name={`barnetilleggVurderinger.${barneTilleggIndex}.vurderinger.${vurderingIndex}.begrunnelse`}
        readOnly={readOnly}
        rules={{ required: 'Du må gi en begrunnelse' }}
      />
      <RadioGroupWrapper
        label={'Skal det beregnes barnetillegg for dette barnet?'}
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
            label={'Søker har forsørgeransvar for barnet fra (dd.mm.åååå)'}
            control={form.control}
            name={`barnetilleggVurderinger.${barneTilleggIndex}.vurderinger.${vurderingIndex}.fom`}
            type={'text'}
            rules={{
              validate: (value) => {
                if (!value) {
                  return 'Du må sette en dato for når søker har forsørgeransvar for barnet fra';
                } else {
                  const parsedValue = stringToDate(value as string, DATO_FORMATER.ddMMyyyy);
                  if (!parsedValue) {
                    return 'Dato for når søker har forsørgeransvar fra er ikke gyldig';
                  } else {
                    return isFuture(parsedValue)
                      ? 'Dato for når søker har forsørgeransvar fra kan ikke være frem i tid'
                      : false;
                  }
                }
              },
            }}
          />
          {leggTilSluttDato ? (
            <TextFieldWrapper
              label={'Sluttdato for forsørgeransvaret (dd.mm.åååå)'}
              control={form.control}
              name={`barnetilleggVurderinger.${barneTilleggIndex}.vurderinger.${vurderingIndex}.tom`}
              type={'text'}
              rules={{
                validate: (value, formValues) => {
                  const parsedValueTom = stringToDate(value as string, DATO_FORMATER.ddMMyyyy);
                  const parsedValueFom = stringToDate(
                    formValues.barnetilleggVurderinger[barneTilleggIndex].vurderinger[vurderingIndex]
                      .fom as unknown as string,
                    DATO_FORMATER.ddMMyyyy
                  );

                  if (parsedValueTom && parsedValueFom) {
                    return isBefore(parsedValueTom, parsedValueFom) ? 'Slutt-dato kan ikke være før start-dato' : false;
                  }
                },
              }}
            />
          ) : (
            <Button
              onClick={() => setLeggTilSluttDato(true)}
              icon={<PlusIcon />}
              className={'fit-content-button'}
              variant={'tertiary'}
              size={'small'}
              type={'button'}
            >
              Legg til sluttdato
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
