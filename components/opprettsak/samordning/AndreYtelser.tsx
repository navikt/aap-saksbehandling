import { VStack, Checkbox, CheckboxGroup, BodyShort } from '@navikt/ds-react';
import { UseFormReturn } from 'react-hook-form';
import { OpprettSakFormFields } from 'components/opprettsak/OpprettSakLocal';

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

  const lønn = watch('andreUtbetalinger.lønn');
  const afp = watch('andreUtbetalinger.afp');
  const stønad = watch('andreUtbetalinger.stønad') ?? [];

  const toggleSingleValue = (field: 'lønn' | 'afp', value: string) => {
    setValue(`andreUtbetalinger.${field}`, value);
  };

  const toggleStønad = (value: AndreUtbetalingerYtelser) => {
    const current = new Set(stønad);
    if (current.has(value)) {
      current.delete(value);
    } else {
      current.add(value);
    }
    setValue('andreUtbetalinger.stønad', Array.from(current));
  };

  const isChecked = (value: string, fieldValue?: string) => fieldValue === value;

  return (
    <VStack gap="4">
      <BodyShort>Har du fått eller skal du få ekstra utbetalinger fra arbeidsgiver?</BodyShort>

      {/* Lønn */}
      <CheckboxGroup legend="Lønn fra arbeidsgiver">
        <Checkbox value="ja" checked={isChecked('ja', lønn)} onChange={() => toggleSingleValue('lønn', 'ja')}>
          Ja
        </Checkbox>
        <Checkbox value="Nei" checked={isChecked('Nei', lønn)} onChange={() => toggleSingleValue('lønn', 'Nei')}>
          Nei
        </Checkbox>
      </CheckboxGroup>

      {/* AFP */}
      <CheckboxGroup legend="AFP (avtalefestet pensjon)">
        <Checkbox value="ja" checked={isChecked('ja', afp)} onChange={() => toggleSingleValue('afp', 'ja')}>
          Ja
        </Checkbox>
        <Checkbox value="Nei" checked={isChecked('Nei', afp)} onChange={() => toggleSingleValue('afp', 'Nei')}>
          Nei
        </Checkbox>
      </CheckboxGroup>

      {/* Stønad (multi-select) */}
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
