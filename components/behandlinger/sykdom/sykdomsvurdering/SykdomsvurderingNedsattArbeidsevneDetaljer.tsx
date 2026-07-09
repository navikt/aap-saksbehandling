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
import React from 'react';

interface Props {
  index: number;
  form: UseFormReturn<SykdomsvurderingerForm>;
  readonly: boolean;
  ikkeRelevantePerioder?: Periode[];
  rettighetsperiodeStartdato: Date;
  skalVurdereYrkesskade: boolean;
  erÅrsakssammenhengYrkesskade: boolean;
  visAlleSykdomssteg: boolean;
}

export const SykdomsvurderingNedsattArbeidsevneDetaljer = ({
  form,
  rettighetsperiodeStartdato,
  skalVurdereYrkesskade,
  erÅrsakssammenhengYrkesskade,
  visAlleSykdomssteg,
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
    form.watch(`vurderinger.${index}.erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense`) === JaEllerNei.Ja;

  return (
    <>
      {!erÅrsakssammenhengYrkesskade && (
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
      )}

      <SykdomsvurderingYrkesskade
        form={form}
        index={index}
        readonly={readonly}
        skalVurdereYrkesskade={skalVurdereYrkesskade}
        vurderingDatoSammeSomRettighetsperiodeStart={vurderingDatoSammeSomRettighetsperiodeStart}
      />
      {erTilstrekkeligNedsatt ||
        (visAlleSykdomssteg && (
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
          </>
        ))}
    </>
  );
};

const SykdomsvurderingYrkesskade = ({
  form,
  vurderingDatoSammeSomRettighetsperiodeStart,
  skalVurdereYrkesskade,
  index,
  readonly,
}: {
  index: number;
  form: UseFormReturn<SykdomsvurderingerForm>;
  readonly: boolean;
  vurderingDatoSammeSomRettighetsperiodeStart: boolean;
  skalVurdereYrkesskade: boolean;
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
      form.watch(`vurderinger.${index}.erNedsettelseIArbeidsevneMerEnnHalvparten`) === JaEllerNei.Nei;
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
            label={erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense}
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
      skalVurdereYrkesskade && (
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
