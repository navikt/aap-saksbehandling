import { Radio } from '@navikt/ds-react';
import { JaEllerNei } from 'lib/utils/form';

import { BarnetilleggFormFields } from 'components/behandlinger/barnetillegg/barnetilleggvurdering/BarnetilleggVurdering';
import { UseFormReturn } from 'react-hook-form';

import { erDatoFoerDato, validerDato } from 'lib/validation/dateValidation';
import { TextAreaWrapper } from 'components/form/textareawrapper/TextAreaWrapper';
import { DateInputWrapper } from 'components/form/dateinputwrapper/DateInputWrapper';
import { RadioGroupWrapper } from 'components/form/radiogroupwrapper/RadioGroupWrapper';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { useEffect, useState } from 'react';

interface Props {
  ident: string | null | undefined;
  barneTilleggIndex: number;
  vurderingIndex: number;
  readOnly: boolean;
  form: UseFormReturn<BarnetilleggFormFields>;
  fødselsdato: string | null | undefined;
  harOppgittFosterforelderRelasjon: boolean;
}

export const OppgitteBarnVurderingFelterV2 = ({
  readOnly,
  barneTilleggIndex,
  vurderingIndex,
  form,
  fødselsdato,
  harOppgittFosterforelderRelasjon,
}: Props) => {
  const [prevHarForeldreAnsvar, setPrevHarForeldreAnsvar] = useState<string | undefined>(undefined);
  const [prevDato, setPrevDato] = useState<string | undefined>(undefined);
  const harForeldreAnsvar = form.watch(
    `barnetilleggVurderinger.${barneTilleggIndex}.vurderinger.${vurderingIndex}.harForeldreAnsvar`
  );
  const erFosterforelder = form.watch(
    `barnetilleggVurderinger.${barneTilleggIndex}.vurderinger.${vurderingIndex}.erFosterforelder`
  );
  const datoFelt = form.watch(`barnetilleggVurderinger.${barneTilleggIndex}.vurderinger.${vurderingIndex}.fraDato`);

  const skalSetteEnFraOgMedDatoForForeldreAnsvarSlutt =
    (harForeldreAnsvar === JaEllerNei.Nei || erFosterforelder === JaEllerNei.Nei) && vurderingIndex !== 0;

  const skalSetteEnFraOgMedDato =
    ((harForeldreAnsvar === JaEllerNei.Nei || erFosterforelder === JaEllerNei.Nei) && vurderingIndex !== 0) ||
    harForeldreAnsvar === JaEllerNei.Ja;

  useEffect(() => {
    if (prevHarForeldreAnsvar) {
      form.setValue(`barnetilleggVurderinger.${barneTilleggIndex}.vurderinger.${vurderingIndex}.harForeldreAnsvar`, '');
    }
    if (prevDato) {
      console.log('resetter fraDato');
      form.setValue(`barnetilleggVurderinger.${barneTilleggIndex}.vurderinger.${vurderingIndex}.fraDato`, '');
    }
  }, [erFosterforelder]);

  useEffect(() => {
    if (prevDato) {
      form.setValue(`barnetilleggVurderinger.${barneTilleggIndex}.vurderinger.${vurderingIndex}.fraDato`, '');
    }
    setPrevHarForeldreAnsvar(harForeldreAnsvar);
  }, [harForeldreAnsvar]);

  useEffect(() => {
    setPrevDato(datoFelt);
  }, [datoFelt]);

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
          description={
            skalSetteEnFraOgMedDatoForForeldreAnsvarSlutt
              ? null
              : 'Barnetillegg skal i hovedsak gis fra dato brukeren søkte om barnetillegg'
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
