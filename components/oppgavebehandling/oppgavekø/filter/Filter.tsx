'use client';
import { useContext } from 'react';
import { useSWRConfig } from 'swr';

import { Button, Dropdown, Heading, UNSAFE_Combobox } from '@navikt/ds-react';

import { LagreModal } from 'components/oppgavebehandling/oppgavekø/filter/LagreModal';
import { FilterValg, Kø, KøContext } from 'components/oppgavebehandling/KøContext';

import styles from './Filter.module.css';
import { skjulPrototype } from 'lib/utils/skjulPrototype';
import { hentAlleBehandlinger } from 'components/oppgavebehandling/oppgavekø/oppgavetabell/OppgaveFetcher';

interface FilterOptions {
  value: string;
  label: string;
}

interface FilterType {
  navn: string;
  label: string;
  options: FilterOptions[];
}

const filterValg: FilterType[] = [
  {
    navn: 'aapstatus',
    label: 'AAP Status',
    options: [
      { value: 'foerstegangsbehandling', label: 'Førstegangsbehandling' },
      { value: 'innvilget', label: 'Innvilget' },
      { value: 'avslaatt', label: 'Avslått' },
      { value: 'venter', label: 'På vent' },
    ],
  },
  {
    navn: 'oppgavetype',
    label: 'Oppgavetype',
    options: [
      { value: 'foerstegangsbehandling', label: 'Førstegangsbehandling' },
      { value: 'revurdering', label: 'Revurdering' },
    ],
  },
  {
    navn: 'gjelder',
    label: 'Gjelder',
    options: [
      { value: 'fastsette', label: 'Fastsette ytelse' },
      { value: 'beslutning', label: 'Beslutning' },
      { value: 'aktivitetsplikt', label: 'Aktivitetsplikt' },
    ],
  },
  {
    navn: 'alder',
    label: 'Alder',
    options: [
      { value: 'unge', label: '18-25 år' },
      { value: 'vanlige', label: '25-65 år' },
      { value: 'eldre', label: '65+ år' },
    ],
  },
];

const finnFilterOptionLabel = (filter: FilterValg, option: string) =>
  filterValg
    .find((filterType) => filterType.navn === filter.navn)
    ?.options.find((filterOption) => filterOption.value === option)?.label ?? option;

const finnFilterLabel = (noekkel: string) =>
  filterValg.find((filterValg) => filterValg.navn === noekkel)?.label ?? noekkel;

export const Filter = () => {
  const køContext = useContext(KøContext);

  const { mutate } = useSWRConfig();
  const valgtKøFilter = køContext.valgtKø.filter;
  const querystring = valgtKøFilter
    ?.map((filterValg) => {
      const filternavn = filterValg.navn;
      const verdier = filterValg.valgteFilter.map((vf) => vf.value).map((u) => `${filternavn}=${u}`);
      return verdier;
    })
    .flat()
    .join('&');
  const refresh = () => mutate('oppgaveliste', () => hentAlleBehandlinger(querystring));

  if (skjulPrototype()) {
    return null;
  }

  const addFilter = (noekkel: string) => {
    const newFilter = filterValg.find((filter) => filter.navn === noekkel);

    if (!newFilter) {
      console.error(`Fant ikke filter for nøkkel ${noekkel}`);
    } else {
      const filterValg: FilterValg = {
        navn: newFilter.navn,
        valgteFilter: [],
        alleFilter: newFilter.options,
      };
      if (køContext.valgtKø.filter) {
        const oppdaterteFilter: FilterValg[] = [...køContext.valgtKø.filter, filterValg];
        køContext.oppdaterValgtKø({ ...køContext.valgtKø, filter: oppdaterteFilter });
      } else {
        køContext.oppdaterValgtKø({ ...køContext.valgtKø, filter: [filterValg] });
      }
    }
  };

  return (
    <section>
      <div className={styles.header}>
        <Heading level={'2'} size={'medium'}>
          Filter
        </Heading>
        {køContext.valgtKø.filter && køContext.valgtKø.filter?.length > 0 && <LagreModal />}
      </div>
      <section className={styles.rad}>
        {køContext.valgtKø.filter &&
          køContext.valgtKø.filter.length > 0 &&
          køContext.valgtKø.filter.map((filter) => (
            <UNSAFE_Combobox
              label={finnFilterLabel(filter.navn)}
              key={filter.navn}
              options={filter.alleFilter}
              selectedOptions={filter.valgteFilter}
              isMultiSelect
              shouldShowSelectedOptions
              size={'small'}
              onToggleSelected={(option, isSelected) => {
                const filterLabel = finnFilterOptionLabel(filter, option);

                if (isSelected) {
                  if (køContext.valgtKø.filter) {
                    // det finnes allerede filter her
                    if (køContext.valgtKø.filter.find((v) => v.navn === filter.navn)) {
                      // og dette filteret er allerede lagt til

                      // finn index for det filteret vi skal endre på
                      const valgtFilterIndex = køContext.valgtKø.filter.findIndex((v) => v.navn === filter.navn);
                      // lag en kopi av eksisterende filter og legg til det nye valget
                      const nyttFilter = [
                        ...køContext.valgtKø.filter[valgtFilterIndex].valgteFilter,
                        { value: option, label: filterLabel },
                      ];

                      const eksisterendeFilter = køContext.valgtKø.filter;
                      eksisterendeFilter.forEach((f, index) => {
                        if (f.navn === filter.navn) {
                          eksisterendeFilter[index] = { ...f, valgteFilter: nyttFilter };
                        }
                      });

                      const oppdatertKø: Kø = {
                        ...køContext.valgtKø,
                        filter: eksisterendeFilter,
                      };
                      køContext.oppdaterValgtKø(oppdatertKø);
                    }
                  }
                } else {
                  if (køContext.valgtKø.filter) {
                    const valgtFilterIndex = køContext.valgtKø.filter.findIndex((v) => v.navn === filter.navn);
                    const nyttFilter = [
                      ...køContext.valgtKø.filter[valgtFilterIndex].valgteFilter.filter((v) => v.value !== option),
                    ];
                    const eksisterendeFilter = køContext.valgtKø.filter;
                    eksisterendeFilter.forEach((f, index) => {
                      if (f.navn === filter.navn) {
                        eksisterendeFilter[index] = { ...f, valgteFilter: nyttFilter };
                      }
                    });

                    const oppdatertKø: Kø = {
                      ...køContext.valgtKø,
                      filter: eksisterendeFilter,
                    };
                    køContext.oppdaterValgtKø(oppdatertKø);
                  }
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
                disabled={!!køContext.valgtKø.filter?.find((v) => v.navn === 'aapstatus')}
              >
                AAP Status
              </Dropdown.Menu.List.Item>
              <Dropdown.Menu.List.Item
                onClick={() => addFilter('oppgavetype')}
                disabled={!!køContext.valgtKø.filter?.find((v) => v.navn === 'oppgavetype')}
              >
                Oppgavetype
              </Dropdown.Menu.List.Item>
              <Dropdown.Menu.List.Item
                onClick={() => addFilter('gjelder')}
                disabled={!!køContext.valgtKø.filter?.find((v) => v.navn === 'gjelder')}
              >
                Gjelder
              </Dropdown.Menu.List.Item>
              <Dropdown.Menu.List.Item
                onClick={() => addFilter('alder')}
                disabled={!!køContext.valgtKø.filter?.find((v) => v.navn === 'alder')}
              >
                Alder
              </Dropdown.Menu.List.Item>
            </Dropdown.Menu.List>
          </Dropdown.Menu>
        </Dropdown>
      </section>
      <div className={styles.knapperad}>
        <Button variant={'primary'} onClick={refresh}>
          Søk
        </Button>
      </div>
    </section>
  );
};
