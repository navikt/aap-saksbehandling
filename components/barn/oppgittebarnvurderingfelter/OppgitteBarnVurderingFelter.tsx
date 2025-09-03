import { Radio } from '@navikt/ds-react';
import { JaEllerNei } from 'lib/utils/form';

import { BarnetilleggFormFields } from 'components/behandlinger/barnetillegg/barnetilleggvurdering/BarnetilleggVurdering';
import { UseFormReturn } from 'react-hook-form';

import { erDatoFoerDato, validerDato } from 'lib/validation/dateValidation';
import { TextAreaWrapper } from 'components/form/textareawrapper/TextAreaWrapper';
import { DateInputWrapper } from 'components/form/dateinputwrapper/DateInputWrapper';
import { RadioGroupWrapper } from 'components/form/radiogroupwrapper/RadioGroupWrapper';
import { formaterDatoForFrontend } from 'lib/utils/date';

interface Props {
  ident: string | null | undefined;
  barneTilleggIndex: number;
  vurderingIndex: number;
  readOnly: boolean;
  form: UseFormReturn<BarnetilleggFormFields>;
  fødselsdato: string | null | undefined;
  harOppgittFosterforelderRelasjon: boolean;
}

export const OppgitteBarnVurderingFelter = ({
  readOnly,
  barneTilleggIndex,
  vurderingIndex,
  form,
  fødselsdato,
  harOppgittFosterforelderRelasjon,
}: Props) => {
  const harForeldreAnsvar = form.watch(
    `barnetilleggVurderinger.${barneTilleggIndex}.vurderinger.${vurderingIndex}.harForeldreAnsvar`
  );
  const erFosterforelder = form.watch(
    `barnetilleggVurderinger.${barneTilleggIndex}.vurderinger.${vurderingIndex}.erFosterforelder`
  );

  const skalSetteEnFraOgMedDatoForForeldreAnsvarSlutt = harForeldreAnsvar === JaEllerNei.Nei && vurderingIndex !== 0;

  const skalSetteEnFraOgMedDato =
    (harForeldreAnsvar === JaEllerNei.Nei && vurderingIndex !== 0) || harForeldreAnsvar === JaEllerNei.Ja;

  return (
    <div className={'flex-column'}>
      <TextAreaWrapper
        label={'Vurder om brukeren har rett på barnetillegg for dette barnet'}
        control={form.control}
        name={`barnetilleggVurderinger.${barneTilleggIndex}.vurderinger.${vurderingIndex}.begrunnelse`}
        readOnly={readOnly}
        rules={{ required: 'Du må gi en begrunnelse' }}
        className="begrunnelse"
      />
      {(harOppgittFosterforelderRelasjon ||
        erFosterforelder === JaEllerNei.Ja ||
        erFosterforelder === JaEllerNei.Nei) && (
        <RadioGroupWrapper
          label={'Har fosterhjemsordningen vart i to år eller er den av varig karakter?'}
          control={form.control}
          name={`barnetilleggVurderinger.${barneTilleggIndex}.vurderinger.${vurderingIndex}.erFosterforelder`}
          readOnly={readOnly}
          rules={{
            required: 'Du må besvare om fosterhjemsordingen har vart i to år eller om den er av varig karakter',
          }}
          horisontal
        >
          <Radio value={JaEllerNei.Ja}>Ja</Radio>
          <Radio value={JaEllerNei.Nei}>Nei</Radio>
        </RadioGroupWrapper>
      )}
      {erFosterforelder !== JaEllerNei.Nei && (
        <RadioGroupWrapper
          label={'Skal brukeren få barnetillegg for barnet?'}
          control={form.control}
          name={`barnetilleggVurderinger.${barneTilleggIndex}.vurderinger.${vurderingIndex}.harForeldreAnsvar`}
          readOnly={readOnly}
          rules={{ required: 'Du må besvare om det skal beregnes barnetillegg for barnet' }}
          horisontal
        >
          <Radio value={JaEllerNei.Ja}>Ja</Radio>
          <Radio value={JaEllerNei.Nei}>Nei</Radio>
        </RadioGroupWrapper>
      )}
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
              validerIkkeFørDato: (value) => {
                if (!fødselsdato) {
                  return;
                }

                const erFørFødselsdato = erDatoFoerDato(value as string, formaterDatoForFrontend(fødselsdato));

                return erFørFødselsdato ? `Dato kan ikke være før fødselsdato (${fødselsdato})` : true;
              },
            },
          }}
        />
      )}
    </div>
  );
};
