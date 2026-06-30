import { Control, useWatch, Controller } from 'react-hook-form';
import { ValgRef } from 'components/brevbygger/brevmodellTypes';
import { SelectWrapper } from 'components/form/selectwrapper/SelectWrapper';
import { TextAreaWrapper } from 'components/form/textareawrapper/TextAreaWrapper';
import { BrevFormVerdier } from 'components/brevbygger/types';
import { Checkbox, CheckboxGroup } from 'components/DsClient';

interface ValgProps {
  valgRef: ValgRef;
  control: Control<BrevFormVerdier>;
}

const handleMouseEnter = (id: string) => {
  const elem = document.getElementById(`valg_${id}`);
  if (elem) {
    elem.classList.add('aktivtValg');
  }
};

const handleMouseLeave = (id: string) => {
  const elem = document.getElementById(`valg_${id}`);
  if (elem) {
    elem.classList.remove('aktivtValg');
  }
};

export const Valg = ({ valgRef, control }: ValgProps) => {
  const valgId = valgRef.valg._id;

  const valgtAlternativKey = useWatch({ control, name: `valg.${valgId}` });

  const valgtAlternativ = valgRef.valg.alternativer.find((a) => a._key === valgtAlternativKey);
  const erFritekstValgt = valgtAlternativ?._type === 'fritekst';

  const antallValg = valgRef.valg.alternativer.length;

  return (
    <div onMouseEnter={() => handleMouseEnter(valgId)} onMouseLeave={() => handleMouseLeave(valgId)}>
      {/* Bruker Controller da vi trenger spesialhåndtering av onChange */}
      {antallValg === 1 && (
        <Controller
          name={`valg.${valgId}`}
          control={control}
          rules={valgRef.obligatorisk ? { required: 'Du må velge et alternativ' } : undefined}
          render={({ field: { onChange, value }, fieldState: { error } }) => {
            const alternativ = valgRef.valg.alternativer[0];
            const isChecked = value === alternativ._key;

            return (
              <CheckboxGroup
                size="small"
                id={`valg.${valgId}`}
                legend={valgRef.valg.beskrivelse}
                error={error?.message}
              >
                <Checkbox
                  value={alternativ._key}
                  checked={isChecked}
                  onChange={(e) => {
                    onChange(e.target.checked ? alternativ._key : '');
                  }}
                >
                  {alternativ._type === 'fritekst' ? 'Fritekst' : alternativ.tekst.beskrivelse}
                </Checkbox>
              </CheckboxGroup>
            );
          }}
        />
      )}
      {antallValg > 1 && (
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
      )}

      {erFritekstValgt && (
        <TextAreaWrapper control={control} name={`fritekster.${valgId}`} label="Fritekst" size="small" />
      )}
    </div>
  );
};
