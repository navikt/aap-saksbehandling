import { UseFormReturn } from 'react-hook-form';
import { Radio, ReadMore, VStack } from '@navikt/ds-react';
import { JaEllerNei } from 'lib/utils/form';
import { Alert } from 'components/alert/Alert';
import { TextAreaWrapper } from 'components/form/textareawrapper/TextAreaWrapper';
import { RadioGroupWrapper } from 'components/form/radiogroupwrapper/RadioGroupWrapper';
import { DateInputWrapper } from 'components/form/dateinputwrapper/DateInputWrapper';
import {
  erReduksjonUtIFraFormFields,
  erVurderingHistorisk,
  lagReduksjonBeskrivelseNyttOpphold,
  lagReduksjonsBeskrivelse,
  validerDatoErInnenforOpphold,
  validerDatoForStoppAvReduksjon,
  validerErIKronologiskRekkeFølge,
} from 'lib/utils/institusjonopphold';
import { HelseinstitusjonGrunnlag } from 'lib/types/types';
import { validerDato } from 'lib/validation/dateValidation';
import { useMemo } from 'react';
import { HelseinstitusjonsFormFields } from 'components/behandlinger/institusjonsopphold/helseinstitusjon/Helseinstitusjon';
import { useEffektivTidligsteReduksjonsdato } from 'lib/utils/useEffektivTidligsteReduksjonsdato';
import { Dato } from 'lib/types/Dato';
import { formatDatoMedMånedsnavn } from 'lib/utils/date';

interface Props {
  form: UseFormReturn<HelseinstitusjonsFormFields>;
  vedtatteVurderinger: HelseinstitusjonGrunnlag['vedtatteVurderinger'];
  oppholdIndex: number;
  vurderingIndex: number;
  readonly: boolean;
  opphold: HelseinstitusjonGrunnlag['opphold'][0];
  finnesTidligereVurderinger: boolean;
}

export const Helseinstitusjonsvurdering = ({
  form,
  vedtatteVurderinger,
  oppholdIndex,
  vurderingIndex,
  readonly,
  opphold,
  finnesTidligereVurderinger,
}: Props) => {
  const vurdering = form.watch(`helseinstitusjonsvurderinger.${oppholdIndex}.vurderinger.${vurderingIndex}`);
  const visHarFasteUtgifterSpørsmål = vurdering.faarFriKostOgLosji === JaEllerNei.Ja;
  const visForsørgerEktefelleSpørsmål =
    vurdering.faarFriKostOgLosji === JaEllerNei.Ja && vurdering.harFasteUtgifter === JaEllerNei.Nei;

  const erReduksjon = erReduksjonUtIFraFormFields(vurdering);

  const forrigeVurdering =
    vurderingIndex > 0
      ? form.watch(`helseinstitusjonsvurderinger.${oppholdIndex}.vurderinger.${vurderingIndex - 1}`)
      : undefined;

  const { bruker1Månedsregelen, effektivTidligsteReduksjonsdato, reduksjonErMulig, enManedsregelEnabled } =
    useEffektivTidligsteReduksjonsdato(form, oppholdIndex, vedtatteVurderinger);

  const erFørsteVurdering = vurderingIndex === 0;
  const forrigeErHistorisk =
    !!forrigeVurdering && erVurderingHistorisk(forrigeVurdering, reduksjonErMulig, enManedsregelEnabled);

  const skalViseDatoFeltForStoppAvReduksjon =
    !erReduksjon && (finnesTidligereVurderinger || !erFørsteVurdering) && !forrigeErHistorisk;

  const reduksjonsBeskrivelse = useMemo(() => {
    if (bruker1Månedsregelen) {
      return lagReduksjonBeskrivelseNyttOpphold(opphold.oppholdFra, opphold.avsluttetDato);
    }
    return lagReduksjonsBeskrivelse(opphold.oppholdFra, effektivTidligsteReduksjonsdato);
  }, [bruker1Månedsregelen, opphold.oppholdFra, opphold.avsluttetDato, effektivTidligsteReduksjonsdato]);

  return (
    <VStack gap={'space-16'}>
      <TextAreaWrapper
        name={`helseinstitusjonsvurderinger.${oppholdIndex}.vurderinger.${vurderingIndex}.begrunnelse`}
        control={form.control}
        description={'Vurder §11-25 og om det skal gis reduksjon av ytelsen.'}
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
        onChangeCustom={(event) => {
          if (
            'value' in event.currentTarget &&
            event.currentTarget.value === JaEllerNei.Nei &&
            vurderingIndex === 0 &&
            !finnesTidligereVurderinger
          ) {
            form.setValue(`helseinstitusjonsvurderinger.${oppholdIndex}.vurderinger.${vurderingIndex}.periode.fom`, '');
          }
        }}
      >
        <Radio value={JaEllerNei.Ja}>Ja</Radio>
        <Radio value={JaEllerNei.Nei}>Nei</Radio>
      </RadioGroupWrapper>
      {visHarFasteUtgifterSpørsmål && (
        <RadioGroupWrapper
          name={`helseinstitusjonsvurderinger.${oppholdIndex}.vurderinger.${vurderingIndex}.harFasteUtgifter`}
          control={form.control}
          label={'Har bruker faste utgifter som er nødvendig for å beholde bolig eller eiendeler?'}
          description={'Vurder om utgiftene gjør at AAP ikke skal reduseres.'}
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
      {erReduksjon && (
        <>
          {!reduksjonErMulig && (
            <Alert variant="warning" className="fit-content">
              Dette oppholdet er for kort til at det rekker å bli reduksjon. Tidligste mulige reduksjonsdato (
              {effektivTidligsteReduksjonsdato &&
                formatDatoMedMånedsnavn(new Dato(effektivTidligsteReduksjonsdato).dato)}
              ) er etter at oppholdet er avsluttet ({formatDatoMedMånedsnavn(new Dato(opphold.avsluttetDato).dato)}).
              Oppgi en dato likevel - den lagres kun som historikk og påvirker ikke beregningen av AAP.
            </Alert>
          )}
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
                  reduksjonErMulig
                    ? validerDatoErInnenforOpphold(value as string, opphold.oppholdFra, opphold.avsluttetDato)
                    : true,
                validerKronologiskRekkefølge: (value) =>
                  validerErIKronologiskRekkeFølge(value as string, forrigeVurdering?.periode.fom),
                validerReduksjonsdato: (value) => {
                  if (bruker1Månedsregelen) return true;
                  return validerDatoForStoppAvReduksjon(value as string, effektivTidligsteReduksjonsdato);
                },
              },
            }}
            readOnly={readonly}
          />
          {reduksjonErMulig && (
            <ReadMore header="Når skal AAP reduseres fra?" size="small">
              AAP skal ikke reduseres før tre måneder etter innleggelsesmåneden. Deretter blir ytelsen redusert med 50
              prosent inntil institusjonsoppholdet avsluttes. Hvis brukeren innen tre måneder etter utskrivelse på nytt
              kommer i institusjon, og det var reduksjon i det første oppholdet, gis det reduksjon igjen fra og med
              måneden etter at det nye oppholdet starter.
            </ReadMore>
          )}
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
