'use client';
import { useState } from 'react';

import { Button, Dropdown, Heading, UNSAFE_Combobox } from '@navikt/ds-react';

import { LagreModal } from 'components/oppgavebehandling/oppgavekø/filter/LagreModal';
import styles from './Filter.module.css';

interface FilterOptions {
  value: string;
  label: string;
}

interface CustomFilter {
  label: string;
  key: string;
  options: FilterOptions[];
}

export const Filter = () => {
  const [customFilter, updateCustomFilter] = useState<CustomFilter[]>([]);

  const statusOptions = [
    { value: 'foerstegangsbehandling', label: 'Førstegangsbehandling' },
    { value: 'innvilget', label: 'Innvilget' },
    { value: 'avslaatt', label: 'Avslått' },
    { value: 'venter', label: 'På vent' },
  ];

  const oppgavetypeOptions = [
    { value: 'foerstegangsbehandling', label: 'Førstegangsbehandling' },
    { value: 'revurdering', label: 'Revurdering' },
  ];

  const gjelderOptions = [
    { value: 'fastsette', label: 'Fastsette ytelse' },
    { value: 'beslutning', label: 'Beslutning' },
    { value: 'aktivitetsplikt', label: 'Aktivitetsplikt' },
  ];

  const alderOptions = [
    { value: 'unge', label: '18-25 år' },
    { value: 'vanlige', label: '25-65 år' },
    { value: 'eldre', label: '65+ år' },
  ];

  const addOppgavetypeFilter = () => {
    updateCustomFilter([...customFilter, { label: 'Oppgavetype', key: 'oppgavetype', options: oppgavetypeOptions }]);
  };

  const addGjelderFilter = () => {
    updateCustomFilter([...customFilter, { label: 'Gjelder', key: 'gjelder', options: gjelderOptions }]);
  };

  const addAldersfilter = () => {
    updateCustomFilter([...customFilter, { label: 'Alder', key: 'alder', options: alderOptions }]);
  };

  return (
    <section>
      <div className={styles.header}>
        <Heading level={'2'} size={'medium'}>
          Filter
        </Heading>
        <LagreModal />
      </div>
      <section className={styles.rad}>
        <UNSAFE_Combobox
          label={'AAP Status'}
          options={statusOptions}
          isMultiSelect
          shouldShowSelectedOptions
          size={'small'}
        />
        {customFilter &&
          customFilter?.length > 0 &&
          customFilter?.map((f) => (
            <UNSAFE_Combobox
              label={f.label}
              key={f.key}
              options={f.options}
              isMultiSelect
              shouldShowSelectedOptions
              size={'small'}
            />
          ))}
        <Dropdown>
          <Button as={Dropdown.Toggle} size={'small'} variant={'secondary'} className={styles.nyttFilter}>
            + Legg til filter
          </Button>
          <Dropdown.Menu>
            <Dropdown.Menu.List>
              <Dropdown.Menu.List.Item
                onClick={() => addOppgavetypeFilter()}
                disabled={!!customFilter?.find((v) => v.key === 'oppgavetype')}
              >
                Oppgavetype
              </Dropdown.Menu.List.Item>
              <Dropdown.Menu.List.Item
                onClick={() => addGjelderFilter()}
                disabled={!!customFilter?.find((v) => v.key === 'gjelder')}
              >
                Gjelder
              </Dropdown.Menu.List.Item>
              <Dropdown.Menu.List.Item
                onClick={() => addAldersfilter()}
                disabled={!!customFilter?.find((v) => v.key === 'alder')}
              >
                Alder
              </Dropdown.Menu.List.Item>
            </Dropdown.Menu.List>
          </Dropdown.Menu>
        </Dropdown>
      </section>
      <Button variant={'primary'} className={styles.soek}>
        Søk
      </Button>
    </section>
  );
};
