import { useState } from 'react';

import { Button, DatePicker, Radio, RadioGroup, Textarea, useDatepicker } from '@navikt/ds-react';
import { PlusIcon } from '@navikt/aksel-icons';
import { JaEllerNei } from 'lib/utils/form';

import {
  ManueltBarnVurdering,
  ManueltBarnVurderingError,
} from 'components/behandlinger/barnetillegg/barnetilleggvurdering/BarnetilleggVurdering';

interface Props {
  manueltBarn: ManueltBarnVurdering;
  oppdaterVurdering: (ident: string, feltId: string, field: keyof ManueltBarnVurdering, value: string | Date) => void;
  ident: string;
  readOnly: boolean;
  errors: ManueltBarnVurderingError[];
}

export const ManueltBarn = ({ manueltBarn, oppdaterVurdering, readOnly, ident, errors }: Props) => {
  const [leggTilSluttDato, setLeggTilSluttDato] = useState(false);

  const feltId = manueltBarn.formId;

  const { datepickerProps: forsørgerAnsvarStartDatoDatepickerProps, inputProps: forsørgerAnsvarStartDatoInputProps } =
    useDatepicker({
      // toDate: new Date(), TODO Dato her skal filtreres på forrige periode
      onDateChange: (date) => {
        if (date) oppdaterVurdering(ident, feltId, 'fom', date);
      },
      allowTwoDigitYear: false,
    });

  const { datepickerProps: forsørgerAnsvarSluttDatoDatepickerProps, inputProps: forsørgerAnsvarSluttDatoInputProps } =
    useDatepicker({
      // fromDate: new Date(), TODO Dato her skal filtreres på forrige periode
      onDateChange: (date) => {
        if (date) oppdaterVurdering(ident, feltId, 'tom', date);
      },
      allowTwoDigitYear: false,
    });

  return (
    <div className={'flex-column'}>
      <Textarea
        label={'Vurder §11-20 og om det skal beregnes barnetillegg for dette barnet'}
        onChange={(event) => oppdaterVurdering(ident, feltId, 'begrunnelse', event.target.value)}
        size={'small'}
        readOnly={readOnly}
        error={errors.find((error) => error.felt === 'begrunnelse')?.message}
      />
      <RadioGroup
        legend={'Skal det beregnes barnetillegg for dette barnet?'}
        onChange={(value) => oppdaterVurdering(ident, feltId, 'harForeldreAnsvar', value)}
        size={'small'}
        readOnly={readOnly}
        error={errors.find((error) => error.felt === 'harForeldreAnsvar')?.message}
      >
        <Radio value={JaEllerNei.Ja}>Ja</Radio>
        <Radio value={JaEllerNei.Nei}>Nei</Radio>
      </RadioGroup>

      {manueltBarn.harForeldreAnsvar === JaEllerNei.Ja && (
        <div className={'flex-row'}>
          <DatePicker {...forsørgerAnsvarStartDatoDatepickerProps}>
            <DatePicker.Input
              label={'Søker har forsørgeransvar for barnet fra'}
              size={'small'}
              error={errors.find((error) => error.felt === 'fom')?.message}
              {...forsørgerAnsvarStartDatoInputProps}
            />
          </DatePicker>
          {leggTilSluttDato ? (
            <DatePicker {...forsørgerAnsvarSluttDatoDatepickerProps}>
              <DatePicker.Input
                label={'Sluttdato for forsørgeransvaret'}
                size={'small'}
                error={errors.find((error) => error.felt === 'tom')?.message}
                {...forsørgerAnsvarSluttDatoInputProps}
              />
            </DatePicker>
          ) : (
            <Button
              onClick={() => setLeggTilSluttDato(true)}
              icon={<PlusIcon />}
              className={'fit-content-button'}
              variant={'tertiary'}
              size={'small'}
            >
              Legg til sluttdato
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
