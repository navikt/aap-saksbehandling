'use client';

import { useState } from 'react';
import AsyncSelect from 'react-select/async';
import { ValuePair } from '@navikt/aap-felles-react';
import { Label } from '@navikt/ds-react';
import { customStyles } from 'components/input/asyncselectstyling/AsyncSelectStyling';
import { FormTesting } from 'components/input/combosearch/ComboSearch2';

const Page = () => {
  const [value, setValue] = useState<ValuePair[]>([]);

  const fetchData = async (query: string): Promise<ValuePair[]> => {
    const res = await fetch(`/api/test/search/${query}`, { method: 'GET' });
    const data: string[] = await res.json();

    return data.map((element) => {
      return { label: element, value: element };
    });
  };

  console.log(value);
  return (
    <div style={{ margin: '1rem auto', maxWidth: '50vw' }}>
      <Label>Velg kommune</Label>
      <AsyncSelect
        isMulti
        placeholder={''}
        loadOptions={fetchData}
        value={value}
        onChange={(value) => setValue(value as ValuePair[])}
        styles={customStyles}
      />
      <FormTesting />
    </div>
  );
};

export default Page;
