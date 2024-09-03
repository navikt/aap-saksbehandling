import { useState } from 'react';

import { Button, DatePicker, Radio, RadioGroup, Textarea, useDatepicker } from '@navikt/ds-react';
import { PlusIcon } from '@navikt/aksel-icons';
import { JaEllerNei } from 'lib/utils/form';

import { ManueltBarnVurdering } from 'components/behandlinger/barnetillegg/barnetilleggvurdering/BarnetilleggVurdering';

interface Props {
  manueltBarn: ManueltBarnVurdering;
  oppdaterVurdering: (ident: string, feltId: string, field: keyof ManueltBarnVurdering, value: string | Date) => void;
  ident: string;
  readOnly: boolean;
}

export const ManueltBarn = ({ manueltBarn, oppdaterVurdering, readOnly, ident }: Props) => {
  const [leggTilSluttDato, setLeggTilSluttDato] = useState(false);

  const feltId = manueltBarn.feltId;

  const { datepickerProps: forsørgerAnsvarStartDatoDatepickerProps, inputProps: forsørgerAnsvarStartDatoInputProps } =
    useDatepicker({
      toDate: new Date(),
      onDateChange: (date) => {
        if (date) oppdaterVurdering(ident, feltId, 'tom', date);
      },
    });

  const { datepickerProps: forsørgerAnsvarSluttDatoDatepickerProps, inputProps: forsørgerAnsvarSluttDatoInputProps } =
    useDatepicker({
      fromDate: new Date(),
      onDateChange: (date) => {
        if (date) oppdaterVurdering(ident, feltId, 'fom', date);
      },
    });

  return (
    <div className={'flex-column'}>
      <Textarea
        label={'Vurder §11-20 og om det skal beregnes barnetillegg for dette barnet'}
        onChange={(event) => oppdaterVurdering(ident, feltId, 'begrunnelse', event.target.value)}
        size={'small'}
        readOnly={readOnly}
      />
      <RadioGroup
        legend={'Skal det beregnes barnetillegg for dette barnet?'}
        onChange={(value) => oppdaterVurdering(ident, feltId, 'harForelderAnsvar', value)}
        size={'small'}
        readOnly={readOnly}
      >
        <Radio value={JaEllerNei.Ja}>Ja</Radio>
        <Radio value={JaEllerNei.Nei}>Nei</Radio>
      </RadioGroup>

      {manueltBarn.harForelderAnsvar === JaEllerNei.Ja && (
        <div className={'flex-row'}>
          <DatePicker {...forsørgerAnsvarStartDatoDatepickerProps}>
            <DatePicker.Input
              label={'Søker har forsørgeransvar for barnet fra'}
              size={'small'}
              {...forsørgerAnsvarStartDatoInputProps}
            />
          </DatePicker>
          {leggTilSluttDato ? (
            <DatePicker {...forsørgerAnsvarSluttDatoDatepickerProps}>
              <DatePicker.Input
                label={'Sluttdato for forsørgeransvaret'}
                size={'small'}
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
