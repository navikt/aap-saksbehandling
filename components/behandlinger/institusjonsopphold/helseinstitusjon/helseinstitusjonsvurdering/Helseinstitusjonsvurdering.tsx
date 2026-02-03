import { UseFormReturn } from 'react-hook-form';
import { HelseinstitusjonsFormFields } from 'components/behandlinger/institusjonsopphold/helseinstitusjon/Helseinstitusjon';
import { Radio, ReadMore, VStack } from '@navikt/ds-react';
import { JaEllerNei } from 'lib/utils/form';
import { TextAreaWrapper } from 'components/form/textareawrapper/TextAreaWrapper';
import { RadioGroupWrapper } from 'components/form/radiogroupwrapper/RadioGroupWrapper';
import { DateInputWrapper } from 'components/form/dateinputwrapper/DateInputWrapper';
import {
  beregnReduksjonsdatoVedNyttOpphold,
  beregnTidligsteReduksjonsdato,
  erNyttOppholdInnenfor3MaanederEtterSistOpphold,
  lagReduksjonBeskrivelseNyttOpphold,
  lagReduksjonsBeskrivelse,
  validerDatoErInnenforOpphold,
  validerErIKronologiskRekkeFølge,
} from 'lib/utils/institusjonsopphold';
import { HelseinstitusjonGrunnlag } from 'lib/types/types';
import { validerDato } from 'lib/validation/dateValidation';
import { useEffect, useMemo } from 'react';
import { Dato } from 'lib/types/Dato';

interface Props {
  form: UseFormReturn<HelseinstitusjonsFormFields>;
  oppholdIndex: number;
  vurderingIndex: number;
  readonly: boolean;
  opphold: HelseinstitusjonGrunnlag['opphold'][0];
  minFomDato?: string;
}

export const Helseinstitusjonsvurdering = ({ form, oppholdIndex, vurderingIndex, readonly, opphold }: Props) => {
  const faarFriKostOgLosji = form.watch(
    `helseinstitusjonsvurderinger.${oppholdIndex}.vurderinger.${vurderingIndex}.faarFriKostOgLosji`
  );
  const forsoergerEktefelle = form.watch(
    `helseinstitusjonsvurderinger.${oppholdIndex}.vurderinger.${vurderingIndex}.forsoergerEktefelle`
  );
  const harFasteUtgifter = form.watch(
    `helseinstitusjonsvurderinger.${oppholdIndex}.vurderinger.${vurderingIndex}.harFasteUtgifter`
  );

  const forrigeVurdering =
    vurderingIndex > 0
      ? form.watch(`helseinstitusjonsvurderinger.${oppholdIndex}.vurderinger.${vurderingIndex - 1}`)
      : undefined;

  const forrigeFaarFriKostOgLosji = forrigeVurdering ? forrigeVurdering.faarFriKostOgLosji : undefined;
  const forrigeForsoergerEktefelle = forrigeVurdering ? forrigeVurdering.forsoergerEktefelle : undefined;
  const forrigeHarFasteUtgifter = forrigeVurdering ? forrigeVurdering.harFasteUtgifter : undefined;

  // Sjekk om det er påfølgende vurdering med forrige status reduksjon
  const erReduksjonEtterForrigeVurdering =
    forrigeFaarFriKostOgLosji === JaEllerNei.Ja &&
    forrigeForsoergerEktefelle === JaEllerNei.Nei &&
    forrigeHarFasteUtgifter === JaEllerNei.Nei;

  const visForsørgerEktefelleSpørsmål = faarFriKostOgLosji === JaEllerNei.Ja;
  const visHarFasteUtgifterSpørsmål = faarFriKostOgLosji === JaEllerNei.Ja && forsoergerEktefelle === JaEllerNei.Nei;
  const reduksjon =
    faarFriKostOgLosji === JaEllerNei.Ja &&
    forsoergerEktefelle === JaEllerNei.Nei &&
    harFasteUtgifter === JaEllerNei.Nei;

  const forrigeOppholdTom = form.watch(`helseinstitusjonsvurderinger.${oppholdIndex - 1}.periode.tom`);
  const reduksjonsBeskrivelse = useMemo(() => {
    if (oppholdIndex > 0 && erNyttOppholdInnenfor3MaanederEtterSistOpphold(forrigeOppholdTom, opphold.oppholdFra)) {
      return lagReduksjonBeskrivelseNyttOpphold(forrigeOppholdTom, opphold.oppholdFra);
    } else {
      return lagReduksjonsBeskrivelse(opphold.oppholdFra);
    }
  }, [opphold.oppholdFra, forrigeOppholdTom, oppholdIndex]);

  useEffect(() => {
    // Vi setter bare fom-dato automatisk for første vurdering
    if (vurderingIndex !== 0) {
      return;
    }

    const fraOgMedDato = form.watch(
      `helseinstitusjonsvurderinger.${oppholdIndex}.vurderinger.${vurderingIndex}.periode.fom`
    );

    // Vi setter ikke fom dato dersom den finnes fra før av
    if (fraOgMedDato !== undefined) {
      return;
    }

    // Sjekk om dette er et nytt opphold innen 3 måneder etter forrige
    if (oppholdIndex > 0) {
      const forrigeOppholdTom = form.watch(`helseinstitusjonsvurderinger.${oppholdIndex - 1}.periode.tom`);

      const erInnenforTreMaaneder = erNyttOppholdInnenfor3MaanederEtterSistOpphold(
        forrigeOppholdTom,
        opphold.oppholdFra
      );

      if (erInnenforTreMaaneder) {
        const dato = reduksjon
          ? beregnReduksjonsdatoVedNyttOpphold(forrigeOppholdTom, opphold.oppholdFra)
          : new Dato(opphold.oppholdFra).formaterForFrontend();

        form.setValue(`helseinstitusjonsvurderinger.${oppholdIndex}.vurderinger.${vurderingIndex}.periode.fom`, dato);
      }
    } else {
      const fomDato = reduksjon
        ? beregnTidligsteReduksjonsdato(opphold.oppholdFra)
        : new Dato(opphold.oppholdFra).formaterForFrontend();

      form.setValue(`helseinstitusjonsvurderinger.${oppholdIndex}.vurderinger.${vurderingIndex}.periode.fom`, fomDato);
    }
  }, [opphold.oppholdFra, vurderingIndex, reduksjon, oppholdIndex]);

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

      {reduksjon && !erReduksjonEtterForrigeVurdering && (
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
              },
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

      {erReduksjonEtterForrigeVurdering && !reduksjon && (
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
