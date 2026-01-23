import { UseFormReturn } from 'react-hook-form';
import { HelseinstitusjonsFormFields } from 'components/behandlinger/institusjonsopphold/helseinstitusjon/Helseinstitusjon';
import { Radio, ReadMore } from '@navikt/ds-react';
import { JaEllerNei } from 'lib/utils/form';
import { TextAreaWrapper } from 'components/form/textareawrapper/TextAreaWrapper';
import { RadioGroupWrapper } from 'components/form/radiogroupwrapper/RadioGroupWrapper';
import { DateInputWrapper } from 'components/form/dateinputwrapper/DateInputWrapper';
import { lagReduksjonsBeskrivelse, validerReduksjonsdatoInnenforOpphold } from 'lib/utils/institusjonsopphold';
import { HelseinstitusjonGrunnlag } from 'lib/types/types';
import { validerDato } from 'lib/validation/dateValidation';

interface Props {
  form: UseFormReturn<HelseinstitusjonsFormFields>;
  helseinstitusjonoppholdIndex: number;
  readonly: boolean;
  opphold: HelseinstitusjonGrunnlag['opphold'][0];
  forrigeVurderingStatus?: string;
  minFomDato?: string;
}

export const Helseinstitusjonsvurdering = ({
  form,
  helseinstitusjonoppholdIndex,
  readonly,
  opphold,
  forrigeVurderingStatus,
  minFomDato,
}: Props) => {
  const faarFriKostOgLosji = form.watch(
    `helseinstitusjonsvurderinger.${helseinstitusjonoppholdIndex}.faarFriKostOgLosji`
  );
  const forsoergerEktefelle = form.watch(
    `helseinstitusjonsvurderinger.${helseinstitusjonoppholdIndex}.forsoergerEktefelle`
  );
  const harFasteUtgifter = form.watch(`helseinstitusjonsvurderinger.${helseinstitusjonoppholdIndex}.harFasteUtgifter`);

  // Sjekk om det er påfølgende vurdering med forrige status AVSLÅTT
  const erPåfølgendeVurderingMedReduksjon = forrigeVurderingStatus === 'AVSLÅTT';

  const visForsørgerEktefelleSpørsmål = faarFriKostOgLosji === JaEllerNei.Ja;
  const visHarFasteUtgifterSpørsmål = faarFriKostOgLosji === JaEllerNei.Ja && forsoergerEktefelle === JaEllerNei.Nei;
  const visDatoSpørsmål =
    faarFriKostOgLosji === JaEllerNei.Ja &&
    forsoergerEktefelle === JaEllerNei.Nei &&
    harFasteUtgifter === JaEllerNei.Nei;

  const reduksjonsBeskrivelse = lagReduksjonsBeskrivelse(opphold.oppholdFra);

  return (
    <div className={'flex-column'}>
      <TextAreaWrapper
        name={`helseinstitusjonsvurderinger.${helseinstitusjonoppholdIndex}.begrunnelse`}
        control={form.control}
        description={'Vurder §11-25 og om det skal gis reduksjon av ytelsen'}
        label={'Vilkårsvurdering'}
        rules={{ required: 'Du må begrunne vurderingen din' }}
        readOnly={readonly}
      />

      <RadioGroupWrapper
        name={`helseinstitusjonsvurderinger.${helseinstitusjonoppholdIndex}.faarFriKostOgLosji`}
        control={form.control}
        label={'Får brukeren fri kost og losji?'}
        rules={{ required: 'Du må svare på om brukeren får fri kost og losji' }}
        readOnly={readonly}
        horisontal
      >
        <Radio value={JaEllerNei.Ja}>Ja</Radio>
        <Radio value={JaEllerNei.Nei}>Nei</Radio>
      </RadioGroupWrapper>

      {visForsørgerEktefelleSpørsmål && (
        <RadioGroupWrapper
          name={`helseinstitusjonsvurderinger.${helseinstitusjonoppholdIndex}.forsoergerEktefelle`}
          control={form.control}
          label={'Forsørger brukeren ektefelle eller tilsvarende?'}
          rules={{ required: 'Du må svare på om brukeren forsørger ektefelle eller tilsvarende' }}
          readOnly={readonly}
          horisontal
        >
          <Radio value={JaEllerNei.Ja}>Ja</Radio>
          <Radio value={JaEllerNei.Nei}>Nei</Radio>
        </RadioGroupWrapper>
      )}

      {visHarFasteUtgifterSpørsmål && (
        <RadioGroupWrapper
          name={`helseinstitusjonsvurderinger.${helseinstitusjonoppholdIndex}.harFasteUtgifter`}
          control={form.control}
          label={'Har brukeren faste utgifter nødvendig for å beholde bolig og andre eiendeler?'}
          rules={{
            required: 'Du må svare på om brukeren har faste utgifter nødvendig for å beholde bolig og andre eiendeler',
          }}
          readOnly={readonly}
          horisontal
        >
          <Radio value={JaEllerNei.Ja}>Ja</Radio>
          <Radio value={JaEllerNei.Nei}>Nei</Radio>
        </RadioGroupWrapper>
      )}

      {visDatoSpørsmål && !erPåfølgendeVurderingMedReduksjon && (
        <>
          <DateInputWrapper
            name={`helseinstitusjonsvurderinger.${helseinstitusjonoppholdIndex}.periode.fom`}
            control={form.control}
            label={'Oppgi dato for reduksjon av AAP'}
            description={reduksjonsBeskrivelse}
            rules={{
              required: 'Du må sette en dato for når reduksjonen skal gjelde fra',
              // validate: (value) => validerDato(value as string),
              validate: (value) =>
                validerReduksjonsdatoInnenforOpphold(value, opphold.oppholdFra, opphold.avsluttetDato),
            }}
            readOnly={readonly}
          />
          <ReadMore header="Når skal AAP reduseres fra?" size="small">
            AAP skal ikke reduseres før tre månedene etter innleggelsesmåneden. Deretter blir ytelsen redusert med 50
            prosent inntil institusjonsoppholdet avsluttes. Dersom medlemmet innen tre måneder etter utskrivelse på nytt
            kommer i institusjon, gis det reduksjon fra og med måneden etter at det nye oppholdet tar til.
          </ReadMore>
        </>
      )}

      {erPåfølgendeVurderingMedReduksjon && (
        <DateInputWrapper
          name={`helseinstitusjonsvurderinger.${helseinstitusjonoppholdIndex}.periode.fom`}
          control={form.control}
          label={'Når skal reduksjonen stoppes?'}
          rules={{
            required: 'Du må sette en dato for når reduksjonen skal stoppes',
            validate: {
              gyldigDato: (value) => validerDato(value as string),
              etterMinDato: (value) => {
                if (minFomDato && value && value <= minFomDato) {
                  return 'Dato må være etter ' + minFomDato;
                }
                return validerReduksjonsdatoInnenforOpphold(value, opphold.oppholdFra, opphold.avsluttetDato);
              },
            },
          }}
          readOnly={readonly}
        />
      )}
    </div>
  );
};
