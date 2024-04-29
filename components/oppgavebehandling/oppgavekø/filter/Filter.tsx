'use client';
import { useState } from 'react';

import { Button, Dropdown, Heading, UNSAFE_Combobox } from '@navikt/ds-react';

import { LagreModal } from 'components/oppgavebehandling/oppgavekø/filter/LagreModal';
import styles from './Filter.module.css';

interface FilterOptions {
  value: string;
  label: string;
}

interface EgendefinerteFilter {
  label: string;
  key: string;
  options: FilterOptions[];
}

interface LagretFilter {
  [key: string]: {
    valgteOptions: string[];
  };
}

interface FilterType {
  [key: string]: {
    label: string;
    options: FilterOptions[];
  };
}

const filterValg: FilterType = {
  aapstatus: {
    label: 'AAP Status',
    options: [
      { value: 'foerstegangsbehandling', label: 'Førstegangsbehandling' },
      { value: 'innvilget', label: 'Innvilget' },
      { value: 'avslaatt', label: 'Avslått' },
      { value: 'venter', label: 'På vent' },
    ],
  },
  oppgavetype: {
    label: 'Oppgavetype',
    options: [
      { value: 'foerstegangsbehandling', label: 'Førstegangsbehandling' },
      { value: 'revurdering', label: 'Revurdering' },
    ],
  },
  gjelder: {
    label: 'Gjelder',
    options: [
      { value: 'fastsette', label: 'Fastsette ytelse' },
      { value: 'beslutning', label: 'Beslutning' },
      { value: 'aktivitetsplikt', label: 'Aktivitetsplikt' },
    ],
  },
  alder: {
    label: 'Alder',
    options: [
      { value: 'unge', label: '18-25 år' },
      { value: 'vanlige', label: '25-65 år' },
      { value: 'eldre', label: '65+ år' },
    ],
  },
};

export const Filter = () => {
  const lsFilters = localStorage.getItem('oppgavestyring_filter');

  const storedFilters: LagretFilter = lsFilters ? JSON.parse(lsFilters) : [];
  const initialFilters: EgendefinerteFilter[] = Object.keys(storedFilters).map((sf) => {
    const filter = filterValg[sf];
    return {
      label: filter.label,
      key: sf,
      options: filter.options,
    };
  });
  const [customFilter, updateCustomFilter] = useState<EgendefinerteFilter[]>(initialFilters);
  const [valgteFilter, oppdaterValgteFilter] = useState<LagretFilter>(storedFilters ?? []);

  const lagreFilter = () => {
    if (!valgteFilter || Object.keys(valgteFilter).length === 0) {
      console.error('Har ingen filter å lagre...');
    } else {
      localStorage.setItem('oppgavestyring_filter', JSON.stringify(valgteFilter));
    }
  };

  const slettFilter = () => localStorage.removeItem('oppgavestyring_filter');

  const addFilter = (key: string) => {
    const newFilter = filterValg[key];

    updateCustomFilter([...customFilter, { label: newFilter.label, key, options: newFilter.options }]);
  };

  return (
    <section>
      <div className={styles.header}>
        <Heading level={'2'} size={'medium'}>
          Filter
        </Heading>
        {customFilter.length > 0 && <LagreModal />}
      </div>
      <section className={styles.rad}>
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
              selectedOptions={valgteFilter[f.key]?.valgteOptions ?? []}
              onToggleSelected={(option, isSelected) => {
                if (isSelected) {
                  if (valgteFilter[f.key]) {
                    oppdaterValgteFilter({
                      ...valgteFilter,
                      [f.key]: { valgteOptions: [...valgteFilter[f.key].valgteOptions, option] },
                    });
                  } else {
                    oppdaterValgteFilter({
                      ...valgteFilter,
                      [f.key]: { valgteOptions: [option] },
                    });
                  }
                } else {
                  oppdaterValgteFilter({
                    ...valgteFilter,
                    [f.key]: {
                      valgteOptions: [
                        ...valgteFilter[f.key].valgteOptions.filter((valgtFilter) => valgtFilter !== option),
                      ],
                    },
                  });
                }
              }}
            />
          ))}
        <Dropdown>
          <Button as={Dropdown.Toggle} size={'small'} variant={'secondary'} className={styles.nyttFilter}>
            + Legg til filter
          </Button>
          <Dropdown.Menu>
            <Dropdown.Menu.List>
              <Dropdown.Menu.List.Item
                onClick={() => addFilter('aapstatus')}
                disabled={!!customFilter?.find((v) => v.key === 'aapstatus')}
              >
                AAP Status
              </Dropdown.Menu.List.Item>
              <Dropdown.Menu.List.Item
                onClick={() => addFilter('oppgavetype')}
                disabled={!!customFilter?.find((v) => v.key === 'oppgavetype')}
              >
                Oppgavetype
              </Dropdown.Menu.List.Item>
              <Dropdown.Menu.List.Item
                onClick={() => addFilter('gjelder')}
                disabled={!!customFilter?.find((v) => v.key === 'gjelder')}
              >
                Gjelder
              </Dropdown.Menu.List.Item>
              <Dropdown.Menu.List.Item
                onClick={() => addFilter('alder')}
                disabled={!!customFilter?.find((v) => v.key === 'alder')}
              >
                Alder
              </Dropdown.Menu.List.Item>
            </Dropdown.Menu.List>
          </Dropdown.Menu>
        </Dropdown>
      </section>
      <div className={styles.knapperad}>
        <Button variant={'primary'}>Søk</Button>
        <Button variant={'secondary'} onClick={() => lagreFilter()}>
          Lagre filter
        </Button>
        <Button variant={'danger'} onClick={() => slettFilter()}>
          Slett filter
        </Button>
      </div>
    </section>
  );
};
