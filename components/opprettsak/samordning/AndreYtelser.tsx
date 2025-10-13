import { VStack, Checkbox, CheckboxGroup, BodyShort, Radio, RadioGroup } from '@navikt/ds-react';
import { UseFormReturn } from 'react-hook-form';
import { OpprettSakFormFields } from 'components/opprettsak/OpprettSakLocal';
import { JaEllerNei } from 'lib/utils/form';

interface Props {
  form: UseFormReturn<OpprettSakFormFields>;
}

enum AndreUtbetalingerYtelser {
  ØKONOMISK_SOSIALHJELP = 'ØKONOMISK_SOSIALHJELP',
  OMSORGSSTØNAD = 'OMSORGSSTØNAD',
  INTRODUKSJONSSTØNAD = 'INTRODUKSJONSSTØNAD',
  KVALIFISERINGSSTØNAD = 'KVALIFISERINGSSTØNAD',
  VERV = 'VERV',
  UTLAND = 'UTLAND',
  AFP = 'AFP',
  STIPEND = 'STIPEND',
  LÅN = 'LÅN',
  NEI = 'NEI',
}

export const AndreYtelser = ({ form }: Props) => {
  const { setValue, watch } = form;

  const lønn = watch('lønn');
  const afp = watch('afp');
  const stønad = watch('stønad') ?? [];

  const toggleStønad = (value: AndreUtbetalingerYtelser) => {
    const current = new Set(stønad);
    if (current.has(value)) {
      current.delete(value);
    } else {
      current.add(value);
    }
    setValue('stønad', Array.from(current));
  };

  return (
    <VStack gap="4">
      <BodyShort>Har du fått eller skal du få ekstra utbetalinger fra arbeidsgiver?</BodyShort>

      <RadioGroup legend="Lønn fra arbeidsgiver" value={lønn} onChange={(val) => setValue('lønn', val)}>
        <Radio value={JaEllerNei.Ja}>Ja</Radio>
        <Radio value={JaEllerNei.Nei}>Nei</Radio>
      </RadioGroup>

      <RadioGroup legend="AFP (avtalefestet pensjon)" value={afp} onChange={(val) => setValue('afp', val)}>
        <Radio value={JaEllerNei.Ja}>Ja</Radio>
        <Radio value={JaEllerNei.Nei}>Nei</Radio>
      </RadioGroup>

      <CheckboxGroup legend="Andre stønader eller utbetalinger">
        {Object.values(AndreUtbetalingerYtelser).map((ytelse) => (
          <Checkbox key={ytelse} value={ytelse} checked={stønad.includes(ytelse)} onChange={() => toggleStønad(ytelse)}>
            {formatEnumLabel(ytelse)}
          </Checkbox>
        ))}
      </CheckboxGroup>
    </VStack>
  );
};

// Optional: formatting enum labels
const formatEnumLabel = (val: string) =>
  val
    .split('_')
    .map((word) => word[0] + word.slice(1).toLowerCase())
    .join(' ');
