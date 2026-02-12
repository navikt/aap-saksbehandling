import { UseFormReturn } from 'react-hook-form';
import { Radio, ReadMore, VStack } from '@navikt/ds-react';
import { JaEllerNei } from 'lib/utils/form';
import { TextAreaWrapper } from 'components/form/textareawrapper/TextAreaWrapper';
import { RadioGroupWrapper } from 'components/form/radiogroupwrapper/RadioGroupWrapper';
import { DateInputWrapper } from 'components/form/dateinputwrapper/DateInputWrapper';
import {
  erNyttOppholdInnenfor3MaanederEtterSistOpphold,
  erReduksjonUtIFraFormFields,
  lagReduksjonBeskrivelseNyttOpphold,
  lagReduksjonsBeskrivelse,
  validerDatoErInnenforOpphold,
  validerDatoForStoppAvReduksjon,
  validerDatoForStoppAvReduksjonVedNyttOpphold,
  validerErIKronologiskRekkeFølge,
} from 'lib/utils/institusjonopphold';
import { HelseinstitusjonGrunnlag } from 'lib/types/types';
import { validerDato } from 'lib/validation/dateValidation';
import { useMemo } from 'react';
import { HelseinstitusjonsFormFieldsNy } from 'components/behandlinger/institusjonsopphold/helseinstitusjonny/HelseinstitusjonNy';

interface Props {
  form: UseFormReturn<HelseinstitusjonsFormFieldsNy>;
  oppholdIndex: number;
  vurderingIndex: number;
  readonly: boolean;
  opphold: HelseinstitusjonGrunnlag['opphold'][0];
  minFomDato?: string;
  finnesTidligereVurderinger: boolean;
}

export const HelseinstitusjonsvurderingNy = ({
  form,
  oppholdIndex,
  vurderingIndex,
  readonly,
  opphold,
  finnesTidligereVurderinger,
}: Props) => {
  const vurdering = form.watch(`helseinstitusjonsvurderinger.${oppholdIndex}.vurderinger.${vurderingIndex}`);

  const forrigeVurdering =
    vurderingIndex > 0
      ? form.watch(`helseinstitusjonsvurderinger.${oppholdIndex}.vurderinger.${vurderingIndex - 1}`)
      : undefined;

  const visForsørgerEktefelleSpørsmål = vurdering.faarFriKostOgLosji === JaEllerNei.Ja;
  const visHarFasteUtgifterSpørsmål =
    vurdering.faarFriKostOgLosji === JaEllerNei.Ja && vurdering.forsoergerEktefelle === JaEllerNei.Nei;

  const forrigeVurderingErReduksjon = forrigeVurdering ? erReduksjonUtIFraFormFields(forrigeVurdering) : false;

  const erReduksjon = erReduksjonUtIFraFormFields(vurdering);

  const skalViseDatoFeltForStoppAvReduksjon =
    !erReduksjon && (forrigeVurderingErReduksjon || (finnesTidligereVurderinger && vurderingIndex === 0));

  const skalViseDatoFeltForStartAvReduksjon = !forrigeVurderingErReduksjon && erReduksjon;

  const forrigeOppholdTom =
    oppholdIndex > 0 ? form.getValues(`helseinstitusjonsvurderinger.${oppholdIndex - 1}.periode.tom`) : undefined;

  const reduksjonsBeskrivelse = useMemo(() => {
    if (forrigeOppholdTom && erNyttOppholdInnenfor3MaanederEtterSistOpphold(forrigeOppholdTom, opphold.oppholdFra)) {
      return lagReduksjonBeskrivelseNyttOpphold(forrigeOppholdTom, opphold.oppholdFra);
    } else {
      return lagReduksjonsBeskrivelse(opphold.oppholdFra);
    }
  }, [opphold.oppholdFra, forrigeOppholdTom]);

  return (
    <VStack gap={'4'}>
      <TextAreaWrapper
        name={`helseinstitusjonsvurderinger.${oppholdIndex}.vurderinger.${vurderingIndex}.begrunnelse`}
        control={form.control}
        description={'Vurder §11-25 og om det skal gis reduksjon av ytelsen'}
        label={'Vilkårsvurdering'}
        rules={{ required: 'Du må begrunne vurderingen din' }}
        readOnly={readonly}
      />

      <RadioGroupWrapper
        name={`helseinstitusjonsvurderinger.${oppholdIndex}.vurderinger.${vurderingIndex}.faarFriKostOgLosji`}
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
          name={`helseinstitusjonsvurderinger.${oppholdIndex}.vurderinger.${vurderingIndex}.forsoergerEktefelle`}
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
          name={`helseinstitusjonsvurderinger.${oppholdIndex}.vurderinger.${vurderingIndex}.harFasteUtgifter`}
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

      {skalViseDatoFeltForStartAvReduksjon && (
        <>
          <DateInputWrapper
            name={`helseinstitusjonsvurderinger.${oppholdIndex}.vurderinger.${vurderingIndex}.periode.fom`}
            control={form.control}
            label={'Oppgi dato for reduksjon av AAP'}
            description={reduksjonsBeskrivelse}
            rules={{
              required: 'Du må sette en dato for når reduksjonen skal gjelde fra',
              validate: {
                gyldigDato: (value) => validerDato(value as string),
                validerInnenforOpphold: (value) =>
                  validerDatoErInnenforOpphold(value as string, opphold.oppholdFra, opphold.avsluttetDato),
                validerKronologiskRekkefølge: (value) =>
                  validerErIKronologiskRekkeFølge(value as string, forrigeVurdering?.periode.fom),
                validerReduksjonsdato: (value) => {
                  if (
                    forrigeOppholdTom &&
                    erNyttOppholdInnenfor3MaanederEtterSistOpphold(forrigeOppholdTom, opphold.oppholdFra)
                  ) {
                    return validerDatoForStoppAvReduksjonVedNyttOpphold(
                      value as string,
                      opphold.oppholdFra,
                      forrigeOppholdTom
                    );
                  } else {
                    return validerDatoForStoppAvReduksjon(value as string, opphold.oppholdFra);
                  }
                },
              },
            }}
            readOnly={readonly}
          />
          <ReadMore header="Når skal AAP reduseres fra?" size="small">
            AAP skal ikke reduseres før tre måneder etter innleggelsesmåneden. Deretter blir ytelsen redusert med 50
            prosent inntil institusjonsoppholdet avsluttes. Dersom medlemmet innen tre måneder etter utskrivelse på nytt
            kommer i institusjon, gis det reduksjon fra og med måneden etter at det nye oppholdet tar til.
          </ReadMore>
        </>
      )}

      {skalViseDatoFeltForStoppAvReduksjon && (
        <DateInputWrapper
          name={`helseinstitusjonsvurderinger.${oppholdIndex}.vurderinger.${vurderingIndex}.periode.fom`}
          control={form.control}
          label={'Når skal reduksjonen stoppes?'}
          rules={{
            required: 'Du må sette en dato for når reduksjonen skal stoppes',
            validate: {
              gyldigDato: (value) => validerDato(value as string),
              validerInnenforOpphold: (value) =>
                validerDatoErInnenforOpphold(value as string, opphold.oppholdFra, opphold.avsluttetDato),
              validerKronologiskRekkefølge: (value) =>
                validerErIKronologiskRekkeFølge(value as string, forrigeVurdering?.periode.fom),
            },
          }}
          readOnly={readonly}
        />
      )}
    </VStack>
  );
};
