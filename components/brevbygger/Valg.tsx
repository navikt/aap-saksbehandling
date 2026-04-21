import { Control, UseFormWatch } from 'react-hook-form';
import { ValgRef } from 'components/brevbygger/brevmodellTypes';
import { SelectWrapper } from 'components/form/selectwrapper/SelectWrapper';
import { TextAreaWrapper } from 'components/form/textareawrapper/TextAreaWrapper';
import { BrevFormVerdier } from 'components/brevbygger/types';

interface ValgProps {
  valgRef: ValgRef;
  control: Control<BrevFormVerdier>;
  watch: UseFormWatch<BrevFormVerdier>;
}

export const Valg = ({ valgRef, control, watch }: ValgProps) => {
  const valgId = valgRef.valg._id;
  const valgtAlternativKey = watch(`valg.${valgId}`);
  const valgtAlternativ = valgRef.valg.alternativer.find((a) => a._key === valgtAlternativKey);
  const erFritekstValgt = valgtAlternativ?._type === 'fritekst';

  return (
    <div>
      <SelectWrapper
        control={control}
        name={`valg.${valgId}`}
        label={valgRef.valg.beskrivelse}
        rules={valgRef.obligatorisk ? { required: 'Du må velge et alternativ' } : undefined}
        size="small"
      >
        <option value="">- Velg et alternativ -</option>
        {valgRef.valg.alternativer.map((alternativ) => (
          <option key={alternativ._key} value={alternativ._key}>
            {alternativ._type === 'fritekst' ? 'Fritekst' : alternativ.tekst.beskrivelse}
          </option>
        ))}
      </SelectWrapper>

      {erFritekstValgt && (
        <TextAreaWrapper control={control} name={`fritekster.${valgId}`} label="Fritekst" size="small" />
      )}
    </div>
  );
};
