'use client';
import { useContext } from 'react';
import { useSWRConfig } from 'swr';

import { Button, Dropdown, Heading } from '@navikt/ds-react';

import { LagreModal } from 'components/oppgavebehandling/oppgavekø/filter/LagreModal';
import { FilterValg, KøContext } from 'components/oppgavebehandling/KøContext';

import styles from './Filter.module.css';
import { skjulPrototype } from 'lib/utils/skjulPrototype';
import { hentAlleBehandlinger } from 'components/oppgavebehandling/oppgavekø/oppgavetabell/OppgaveFetcher';
import { byggQueryString } from 'components/oppgavebehandling/lib/query';
import { Flervalgsfilter } from './Flervalgsfilter';

export interface FilterOptions {
  value: string;
  label: string;
}

type Filternavn = 'behandlingstype' | 'avklaringsbehov';

export interface FlervalgsfilterType {
  navn: Filternavn;
  label: string;
  options: FilterOptions[];
}

const flervalgsfilter: FlervalgsfilterType[] = [
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
    label: 'Oppgavetype',
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
  flervalgsfilter
    .find((filterType) => filterType.navn === filter.navn)
    ?.options.find((filterOption) => filterOption.value === option)?.label ?? option;

const finnFilterLabel = (noekkel: string) =>
  flervalgsfilter.find((filterValg) => filterValg.navn === noekkel)?.label ?? noekkel;

export const Filter = () => {
  const køContext = useContext(KøContext);

  const { mutate } = useSWRConfig();

  const search = byggQueryString(køContext.valgtKø);
  const refresh = () => mutate('oppgaveliste', () => hentAlleBehandlinger(search));

  if (skjulPrototype()) {
    return null;
  }

  const addFilter = (noekkel: Filternavn) => {
    const newFilter = flervalgsfilter.find((filter) => filter.navn === noekkel);

    if (!newFilter) {
      console.error(`Fant ikke filter for nøkkel ${noekkel}`);
    } else {
      const filterValg: FilterValg = {
        navn: newFilter.navn,
        valgteFilter: [],
        alleFilter: newFilter.options,
      };
      if (køContext.valgtKø.flervalgsfilter) {
        const oppdaterteFilter: FilterValg[] = [...køContext.valgtKø.flervalgsfilter, filterValg];
        køContext.oppdaterValgtKø({ ...køContext.valgtKø, flervalgsfilter: oppdaterteFilter });
      } else {
        køContext.oppdaterValgtKø({ ...køContext.valgtKø, flervalgsfilter: [filterValg] });
      }
    }
  };

  return (
    <section>
      <div className={styles.header}>
        <Heading level={'2'} size={'medium'}>
          Filter
        </Heading>
        {køContext.valgtKø.flervalgsfilter && køContext.valgtKø.flervalgsfilter?.length > 0 && <LagreModal />}
      </div>
      <section className={styles.rad}>
        {køContext.valgtKø.flervalgsfilter &&
          køContext.valgtKø.flervalgsfilter.length > 0 &&
          køContext.valgtKø.flervalgsfilter.map((filter) => (
            <Flervalgsfilter
              key={filter.navn}
              label={finnFilterLabel(filter.navn)}
              filter={filter}
              finnFilterOptionLabel={finnFilterOptionLabel}
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
                disabled={!!køContext.valgtKø.flervalgsfilter?.find((v) => v.navn === 'behandlingstype')}
              >
                Behandlingstype
              </Dropdown.Menu.List.Item>
              <Dropdown.Menu.List.Item
                onClick={() => addFilter('avklaringsbehov')}
                disabled={!!køContext.valgtKø.flervalgsfilter?.find((v) => v.navn === 'avklaringsbehov')}
              >
                Oppgavetype
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
