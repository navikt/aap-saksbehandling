import { UseFormReturn } from 'react-hook-form';
import { HelseinstitusjonsFormFields } from 'components/behandlinger/institusjonsopphold/helseinstitusjon/Helseinstitusjon';
import { Radio, ReadMore } from '@navikt/ds-react';
import { JaEllerNei } from 'lib/utils/form';
import { TextAreaWrapper } from 'components/form/textareawrapper/TextAreaWrapper';
import { RadioGroupWrapper } from 'components/form/radiogroupwrapper/RadioGroupWrapper';
import { DateInputWrapper } from 'components/form/dateinputwrapper/DateInputWrapper';
import {
  beregnReduksjonsdatoVedNyttOpphold,
  beregnTidligsteReduksjonsdato,
  lagReduksjonsBeskrivelse,
  validerReduksjonsdatoInnenforOpphold,
} from 'lib/utils/institusjonsopphold';
import { HelseinstitusjonGrunnlag } from 'lib/types/types';
import { validerDato } from 'lib/validation/dateValidation';
import { useEffect } from 'react';
import { formaterDatoForFrontend } from 'lib/utils/date';

interface Props {
  form: UseFormReturn<HelseinstitusjonsFormFields>;
  oppholdIndex: number;
  vurderingIndex: number;
  readonly: boolean;
  opphold: HelseinstitusjonGrunnlag['opphold'][0];
  minFomDato?: string;
  alleOpphold: HelseinstitusjonGrunnlag['opphold'];
}

export const Helseinstitusjonsvurdering = ({
  form,
  oppholdIndex,
  vurderingIndex,
  readonly,
  opphold,
  minFomDato,
  alleOpphold,
}: Props) => {
  const faarFriKostOgLosji = form.watch(
    `helseinstitusjonsvurderinger.${oppholdIndex}.vurderinger.${vurderingIndex}.faarFriKostOgLosji`
  );
  const forsoergerEktefelle = form.watch(
    `helseinstitusjonsvurderinger.${oppholdIndex}.vurderinger.${vurderingIndex}.forsoergerEktefelle`
  );
  const harFasteUtgifter = form.watch(
    `helseinstitusjonsvurderinger.${oppholdIndex}.vurderinger.${vurderingIndex}.harFasteUtgifter`
  );

  const forrigeFaarFriKostOgLosji =
    vurderingIndex > 0
      ? form.watch(`helseinstitusjonsvurderinger.${oppholdIndex}.vurderinger.${vurderingIndex - 1}.faarFriKostOgLosji`)
      : undefined;
  const forrigeForsoergerEktefelle =
    vurderingIndex > 0
      ? form.watch(`helseinstitusjonsvurderinger.${oppholdIndex}.vurderinger.${vurderingIndex - 1}.forsoergerEktefelle`)
      : undefined;
  const forrigeHarFasteUtgifter =
    vurderingIndex > 0
      ? form.watch(`helseinstitusjonsvurderinger.${oppholdIndex}.vurderinger.${vurderingIndex - 1}.harFasteUtgifter`)
      : undefined;

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

  // Beregn riktig fom for ny vurdering
  const tidligsteReduksjonsdato = (() => {
    if (oppholdIndex === 0) {
      return beregnTidligsteReduksjonsdato(opphold.oppholdFra);
    }
    const forrigeOppholdAvsluttet = alleOpphold[oppholdIndex - 1]?.avsluttetDato ?? '';
    const nåværendeOppholdFra = opphold.oppholdFra ?? '';
    return beregnReduksjonsdatoVedNyttOpphold(forrigeOppholdAvsluttet, nåværendeOppholdFra);
  })();

  // *** Autofyll FOM om det blir reduksjon ***
  const defaultFom = minFomDato
    ? formaterDatoForFrontend(new Date(new Date(minFomDato).getTime() + 24 * 60 * 60 * 1000))
    : formaterDatoForFrontend(opphold.oppholdFra);
  useEffect(() => {
    const periodeFomFeltNavn = `helseinstitusjonsvurderinger.${oppholdIndex}.vurderinger.${vurderingIndex}.periode.fom`;
    const currentFom = form.getValues(periodeFomFeltNavn as any);
    if (reduksjon && currentFom !== tidligsteReduksjonsdato) {
      form.setValue(periodeFomFeltNavn as any, tidligsteReduksjonsdato, { shouldValidate: true });
    } else if (!reduksjon && currentFom !== defaultFom) {
      // Sett tilbake til default
      form.setValue(periodeFomFeltNavn as any, defaultFom, { shouldValidate: true });
    }
  }, [reduksjon, tidligsteReduksjonsdato, defaultFom, form, oppholdIndex, vurderingIndex]);

  const reduksjonsBeskrivelse = lagReduksjonsBeskrivelse(opphold.oppholdFra);

  return (
    <div className={'flex-column'}>
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

      {erReduksjonEtterForrigeVurdering && !reduksjon && (
        <DateInputWrapper
          name={`helseinstitusjonsvurderinger.${oppholdIndex}.vurderinger.${vurderingIndex}.periode.fom`}
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
                return '';
              },
            },
          }}
          readOnly={readonly}
        />
      )}
    </div>
  );
};
