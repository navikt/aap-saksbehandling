import { Radio } from '@navikt/ds-react';
import { JaEllerNei } from 'lib/utils/form';

import { BarnetilleggFormFields } from 'components/behandlinger/barnetillegg/barnetilleggvurdering/BarnetilleggVurdering';
import { UseFormReturn } from 'react-hook-form';
import { RadioGroupWrapper } from 'components/input/RadioGroupWrapper';

import { validerDato } from 'lib/validation/dateValidation';
import { TextAreaWrapper } from 'components/form/textareawrapper/TextAreaWrapper';
import { DateInputWrapper } from 'components/form/dateinputwrapper/DateInputWrapper';

interface Props {
  ident: string;
  barneTilleggIndex: number;
  vurderingIndex: number;
  readOnly: boolean;
  form: UseFormReturn<BarnetilleggFormFields>;
}

export const OppgitteBarnVurderingFelter = ({ readOnly, barneTilleggIndex, vurderingIndex, form }: Props) => {
  const harForeldreAnsvar = form.watch(
    `barnetilleggVurderinger.${barneTilleggIndex}.vurderinger.${vurderingIndex}.harForeldreAnsvar`
  );

  const skalSetteEnFraOgMedDatoForForeldreAnsvarSlutt = harForeldreAnsvar === JaEllerNei.Nei && vurderingIndex !== 0;

  const skalSetteEnFraOgMedDato =
    (harForeldreAnsvar === JaEllerNei.Nei && vurderingIndex !== 0) || harForeldreAnsvar === JaEllerNei.Ja;

  return (
    <div className={'flex-column'}>
      <TextAreaWrapper
        label={'Vurder om fosterhjemsordningen har vart i to år eller har en varig karakter'}
        control={form.control}
        name={`barnetilleggVurderinger.${barneTilleggIndex}.vurderinger.${vurderingIndex}.begrunnelse`}
        readOnly={readOnly}
        rules={{ required: 'Du må gi en begrunnelse' }}
        className="begrunnelse"
      />
      <RadioGroupWrapper
        label={'Har fosterhjemsordningen vart i to år eller er den av varig karakter?'}
        control={form.control}
        name={`barnetilleggVurderinger.${barneTilleggIndex}.vurderinger.${vurderingIndex}.harForeldreAnsvar`}
        readOnly={readOnly}
        rules={{ required: 'Du må besvare om det skal beregnes barnetillegg for barnet' }}
        horisontal
      >
        <Radio value={JaEllerNei.Ja}>Ja</Radio>
        <Radio value={JaEllerNei.Nei}>Nei</Radio>
      </RadioGroupWrapper>
      {skalSetteEnFraOgMedDato && (
        <DateInputWrapper
          label={
            skalSetteEnFraOgMedDatoForForeldreAnsvarSlutt
              ? 'Forsørgeransvar opphører fra'
              : 'Oppgi dato for når barnetillegget skal gis fra'
          }
          control={form.control}
          name={`barnetilleggVurderinger.${barneTilleggIndex}.vurderinger.${vurderingIndex}.fraDato`}
          rules={{
            validate: {
              validerDato: (value) => validerDato(value as string),
            },
          }}
        />
      )}
    </div>
  );
};
