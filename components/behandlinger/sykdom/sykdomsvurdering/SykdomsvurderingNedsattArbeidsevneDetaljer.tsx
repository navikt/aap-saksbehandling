import { JaEllerNei } from 'lib/utils/form';
import { UseFormReturn } from 'react-hook-form';
import type { SykdomsvurderingerForm } from 'components/behandlinger/sykdom/sykdomsvurdering/Sykdomsvurdering';
import { Periode } from 'lib/types/types';
import { RadioGroupJaNei } from 'components/form/radiogroupjanei/RadioGroupJaNei';
import { TextAreaWrapper } from 'components/form/textareawrapper/TextAreaWrapper';
import { parseDatoFraDatePicker } from 'lib/utils/date';
import { vurderingFraDatoErSammeSomRettighetsperiodeStart } from 'components/behandlinger/sykdom/sykdomsvurdering/sykdomsvurdering-utils';
import {
  erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense,
  yrkesskadeBegrunnelse,
} from 'components/behandlinger/sykdom/sykdomsvurdering/SykdomsvurderingFormInput';

interface Props {
  index: number;
  form: UseFormReturn<SykdomsvurderingerForm>;
  readonly: boolean;
  ikkeRelevantePerioder?: Periode[];
  rettighetsperiodeStartdato: Date;
  skalVurdereYrkesskade: boolean;
  erÅrsakssammenhengYrkesskade: boolean;
}

export const SykdomsvurderingNedsattArbeidsevneDetaljer = ({
  form,
  rettighetsperiodeStartdato,
  skalVurdereYrkesskade,
  erÅrsakssammenhengYrkesskade,
  index,
  readonly,
}: Props) => {
  const valgtDato = parseDatoFraDatePicker(form.watch(`vurderinger.${index}.fraDato`));
  const vurderingDatoSammeSomRettighetsperiodeStart = vurderingFraDatoErSammeSomRettighetsperiodeStart(
    valgtDato,
    rettighetsperiodeStartdato
  );

  const erTilstrekkeligNedsatt =
    form.watch(`vurderinger.${index}.erNedsettelseIArbeidsevneMerEnnHalvparten`) === JaEllerNei.Ja ||
    form.watch(`vurderinger.${index}.erNedsettelseIArbeidsevneMerEnnFørtiProsent`) === JaEllerNei.Ja ||
    form.watch(`vurderinger.${index}.erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense`) === JaEllerNei.Ja;

  return (
    <>
      {!erÅrsakssammenhengYrkesskade &&
        (vurderingDatoSammeSomRettighetsperiodeStart ? (
          <RadioGroupJaNei
            name={`vurderinger.${index}.erNedsettelseIArbeidsevneMerEnnHalvparten`}
            description={
              'Det er tilstrekkelig at arbeidsevnen er redusert med 40 prosent (§ 11-23) hvis brukeren mottar AAP eller skal tre inn i en tidligere stanset sak (§ 11-31).'
            }
            control={form.control}
            label={'Er arbeidsevnen nedsatt med minst halvparten?'}
            horisontal={true}
            rules={{ required: 'Du må svare på om arbeidsevnen er nedsatt med minst halvparten' }}
            readOnly={readonly}
          />
        ) : (
          /*
           *  Nedsatt med 40% skal vises dersom forrige vurdering var oppfylt eller forrige behandling ble innvilget,
           *  så denne logikken blir ikke helt riktig. På sikt burde feltene slås sammen og la det være opp til
           *  saksbehandler å vurdere hva som er riktig prosent nedsettelse.
           */
          <RadioGroupJaNei
            name={`vurderinger.${index}.erNedsettelseIArbeidsevneMerEnnFørtiProsent`}
            control={form.control}
            label={'Er arbeidsevnen nedsatt med minst halvparten?'}
            description={
              'Det er tilstrekkelig at arbeidsevnen er redusert med 40 prosent (§ 11-23) hvis brukeren mottar AAP eller skal tre inn i en tidligere stanset sak (§ 11-31).'
            }
            horisontal={true}
            rules={{
              required: 'Du må svare på om den nedsatte arbeidsevnen er nedsatt med minst 40 prosent.',
            }}
            readOnly={readonly}
          />
        ))}
      <SykdomsvurderingYrkesskade
        form={form}
        erÅrsakssammenhengYrkesskade={erÅrsakssammenhengYrkesskade}
        index={index}
        readonly={readonly}
        skalVurdereYrkesskade={skalVurdereYrkesskade}
        vurderingDatoSammeSomRettighetsperiodeStart={vurderingDatoSammeSomRettighetsperiodeStart}
      />
      {erTilstrekkeligNedsatt && (
        <>
          <RadioGroupJaNei
            name={`vurderinger.${index}.erSkadeSykdomEllerLyteVesentligdel`}
            control={form.control}
            label={'Er sykdom, skade eller lyte vesentlig medvirkende til at arbeidsevnen er nedsatt?'}
            horisontal={true}
            rules={{
              required: 'Du må svare på om sykdom, skade eller lyte er vesentlig medvirkende til nedsatt arbeidsevne',
            }}
            readOnly={readonly}
          />

          {form.watch(`vurderinger.${index}.erSkadeSykdomEllerLyteVesentligdel`) === JaEllerNei.Ja && (
            <RadioGroupJaNei
              name={`vurderinger.${index}.erNedsettelseIArbeidsevneAvEnVissVarighet`}
              control={form.control}
              label={'Er den nedsatte arbeidsevnen av en viss varighet?'}
              description={'Om du svarer nei, vil brukeren vurderes for AAP som sykepengeerstatning etter § 11-13.'}
              horisontal={true}
              rules={{
                required: 'Du må svare på om den nedsatte arbeidsevnen er av en viss varighet',
              }}
              readOnly={readonly}
            />
          )}
        </>
      )}
    </>
  );
};

const SykdomsvurderingYrkesskade = ({
  form,
  vurderingDatoSammeSomRettighetsperiodeStart,
  skalVurdereYrkesskade,
  erÅrsakssammenhengYrkesskade,
  index,
  readonly,
}: {
  index: number;
  form: UseFormReturn<SykdomsvurderingerForm>;
  readonly: boolean;
  vurderingDatoSammeSomRettighetsperiodeStart: boolean;
  skalVurdereYrkesskade: boolean;
  erÅrsakssammenhengYrkesskade: boolean;
}) => {
  /*
   * Logikken for yrkesskade er litt kronglete.
   * Parameter [vurderingDatoSammeSomRettighetsperiodeStart] brukes midlertidig siden vi ikke har en enkel/god måte å
   * sjekke om en behandling er løpende eller første innvilgelse.
   *
   * Ved første innvilgelse må yrkesskaden begrunnes, samt bekrefte om den har minst 30 prosent nedsettelse.
   *
   * I påfølgende behandlinger skal saksbehandler kun bekrefte om den fremdeles er 30 prosent.
   */
  if (vurderingDatoSammeSomRettighetsperiodeStart) {
    const kanBegrunneYrkesskade =
      form.watch(`vurderinger.${index}.erNedsettelseIArbeidsevneMerEnnHalvparten`) === JaEllerNei.Nei ||
      form.watch(`vurderinger.${index}.erNedsettelseIArbeidsevneMerEnnFørtiProsent`) === JaEllerNei.Nei;

    return (
      skalVurdereYrkesskade &&
      kanBegrunneYrkesskade && (
        <>
          <TextAreaWrapper
            name={`vurderinger.${index}.yrkesskadeBegrunnelse`}
            control={form.control}
            label={yrkesskadeBegrunnelse}
            description={
              'Brukeren har en yrkesskade som kan ha betydning for retten til AAP. Du må derfor vurdere om arbeidsevnen er nedsatt med minst 30 prosent. NAY vil vurdere om arbeidsevnen er nedsatt på grunn av yrkesskaden.'
            }
            rules={{
              required: 'Du må skrive en begrunnelse for om arbeidsevnen er nedsatt med minst 30 prosent',
            }}
            readOnly={readonly}
            shouldUnregister={false}
          />

          <RadioGroupJaNei
            name={`vurderinger.${index}.erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense`}
            control={form.control}
            label={'Er arbeidsevnen nedsatt med minst 30 prosent?'}
            horisontal={true}
            rules={{
              required: 'Du må svare på om den nedsatte arbeidsevnen er nedsatt med minst 30 prosent.',
            }}
            readOnly={readonly}
          />
        </>
      )
    );
  } else {
    return (
      erÅrsakssammenhengYrkesskade && (
        <RadioGroupJaNei
          name={`vurderinger.${index}.erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense`}
          control={form.control}
          label={erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense}
          horisontal={true}
          rules={{
            required: 'Du må svare på om den nedsatte arbeidsevnen er nedsatt med minst 30 prosent.',
          }}
          readOnly={readonly}
        />
      )
    );
  }
};
