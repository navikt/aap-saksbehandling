'use client';
import { useContext } from 'react';
import { useSWRConfig } from 'swr';

import { Button, Dropdown, Heading, UNSAFE_Combobox } from '@navikt/ds-react';

import { LagreModal } from 'components/oppgavebehandling/oppgavekø/filter/LagreModal';
import { FilterValg, Kø, KøContext } from 'components/oppgavebehandling/KøContext';

import styles from './Filter.module.css';
import { skjulPrototype } from 'lib/utils/skjulPrototype';
import { hentAlleBehandlinger } from 'components/oppgavebehandling/oppgavekø/oppgavetabell/OppgaveFetcher';
import { byggQueryString } from 'components/oppgavebehandling/lib/query';

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
    navn: 'behandlingstype',
    label: 'Behandlingstype',
    options: [
      { value: 'Førstegangsbehandling', label: 'Førstegangsbehandling' },
      { value: 'Revurdering', label: 'Revurdering' },
      { value: 'Tilbakekreving', label: 'Tilbakekreving' },
      { value: 'Klage', label: 'Klage' },
    ],
  },
  {
    navn: 'avklaringsbehov',
    label: 'Gjelder',
    options: [
      { value: 'MANUELT_SATT_PÅ_VENT', label: 'Manuelt satt på vent' },
      { value: 'AVKLAR_STUDENT', label: 'Student' },
      { value: 'AVKLAR_SYKDOM', label: 'Nedsatt arbeidsevne' },
      { value: 'FASTSETT_ARBEIDSEVNE', label: 'Fastsett arbeidsevne' },
      { value: 'FRITAK_MELDEPLIKT', label: 'Unntak fra meldeplikt' },
      { value: 'AVKLAR_BISTANDSBEHOV', label: 'Behov for bistand' },
      { value: 'VURDER_SYKEPENGEERSTATNING', label: 'Sykepengeerstatning' },
      { value: 'FASTSETT_BEREGNINGSTIDSPUNKT', label: 'Fastsett beregningstidspunkt' },
      { value: 'FORESLÅ_VEDTAK', label: 'Foreslå vedtak' },
      { value: 'FATTE_VEDTAK', label: 'Fatte vedtak' },
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

  const search = byggQueryString(køContext.valgtKø);
  const refresh = () => mutate('oppgaveliste', () => hentAlleBehandlinger(search));

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
                onClick={() => addFilter('behandlingstype')}
                disabled={!!køContext.valgtKø.filter?.find((v) => v.navn === 'behandlingstype')}
              >
                Behandlingstype
              </Dropdown.Menu.List.Item>
              <Dropdown.Menu.List.Item
                onClick={() => addFilter('avklaringsbehov')}
                disabled={!!køContext.valgtKø.filter?.find((v) => v.navn === 'avklaringsbehov')}
              >
                Gjelder
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
