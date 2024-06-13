'use client';
import { useContext } from 'react';
import { useSWRConfig } from 'swr';

import { Button, Dropdown, Heading, TextField } from '@navikt/ds-react';

import { LagreModal } from 'components/oppgavebehandling/oppgavekø/filter/LagreModal';
import { FilterValg, Fritekstfilter, KøContext } from 'components/oppgavebehandling/KøContext';

import styles from './Filter.module.css';
import { hentAlleBehandlinger } from 'components/oppgavebehandling/oppgavekø/oppgavetabell/OppgaveFetcher';
import { byggQueryString } from 'components/oppgavebehandling/lib/query';
import { Flervalgsfilter } from './Flervalgsfilter';
import { SlettFilter } from 'components/oppgavebehandling/oppgavekø/filter/SlettFilter';

interface Props {
  erAvdelingsleder?: boolean;
}

export interface FilterOptions {
  value: string;
  label: string;
}

type Filternavn = 'behandlingstype' | 'avklaringsbehov' | 'foedselsnummer' | 'tilordnetRessurs';

interface FilterType {
  navn: Filternavn;
  label: string;
}

export interface FlervalgsfilterType extends FilterType {
  options: FilterOptions[];
}

interface FritekstfilterType extends FilterType {
  verdi?: string;
}

const fritekstFilter: FritekstfilterType[] = [
  {
    navn: 'foedselsnummer',
    label: 'Innbygger',
  },
  {
    navn: 'tilordnetRessurs',
    label: 'Saksbehandler',
  },
];

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

const finnFilterLabel = (noekkel: string, filterliste: FilterType[]) =>
  filterliste.find((filterValg) => filterValg.navn === noekkel)?.label ?? noekkel;

export const Filter = ({ erAvdelingsleder = false }: Props) => {
  const køContext = useContext(KøContext);

  const { mutate } = useSWRConfig();

  const search = byggQueryString(køContext.valgtKø);
  const refresh = () => mutate('oppgaveliste', () => hentAlleBehandlinger(search));

  const leggInnFritekstfilter = (noekkel: Filternavn) => {
    const newFilter = fritekstFilter.find((filter) => filter.navn === noekkel);
    if (!newFilter) {
      console.error(`Fant ikke filter for nøkkel ${noekkel}`);
    } else {
      const fritekstfilter: Fritekstfilter = {
        navn: newFilter.navn,
        verdi: undefined,
      };
      if (køContext.valgtKø.fritekstfilter) {
        const oppdatertFritekstFilter = [...køContext.valgtKø.fritekstfilter, fritekstfilter];
        køContext.oppdaterValgtKø({ ...køContext.valgtKø, fritekstfilter: oppdatertFritekstFilter });
      } else {
        køContext.oppdaterValgtKø({ ...køContext.valgtKø, fritekstfilter: [fritekstfilter] });
      }
    }
  };

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
        {erAvdelingsleder && (
          <div className={styles.køknapper}>
            {køContext.valgtKø.id && <SlettFilter kønavn={køContext.valgtKø.navn} køId={køContext.valgtKø.id} />}
            {køContext.valgtKø.flervalgsfilter && køContext.valgtKø.flervalgsfilter?.length > 0 && <LagreModal />}
          </div>
        )}
      </div>
      <section className={styles.rad}>
        {køContext.valgtKø.fritekstfilter &&
          køContext.valgtKø.fritekstfilter.length > 0 &&
          køContext.valgtKø.fritekstfilter.map((filter) => (
            <TextField
              label={finnFilterLabel(filter.navn, fritekstFilter)}
              key={filter.navn}
              value={filter.verdi}
              onChange={(event) => {
                if (køContext.valgtKø.fritekstfilter) {
                  if (køContext.valgtKø.fritekstfilter.find((v) => v.navn === filter.navn)) {
                    const filterArray = køContext.valgtKø.fritekstfilter;
                    const filterIndex = køContext.valgtKø.fritekstfilter.findIndex((v) => v.navn === filter.navn);
                    filterArray[filterIndex].verdi = event.target.value;
                    køContext.oppdaterValgtKø({ ...køContext.valgtKø, fritekstfilter: filterArray });
                  }
                }
              }}
            />
          ))}
        {køContext.valgtKø.flervalgsfilter &&
          køContext.valgtKø.flervalgsfilter.length > 0 &&
          køContext.valgtKø.flervalgsfilter.map((filter) => (
            <Flervalgsfilter
              key={filter.navn}
              label={finnFilterLabel(filter.navn, flervalgsfilter)}
              filter={filter}
              finnFilterOptionLabel={finnFilterOptionLabel}
            />
          ))}
        <Dropdown>
          <Button as={Dropdown.Toggle} size={'small'} variant={'secondary'} className={styles.nyttFilter}>
            Legg til filter
          </Button>
          <Dropdown.Menu>
            <Dropdown.Menu.List>
              <Dropdown.Menu.List.Item
                onClick={() => leggInnFritekstfilter('foedselsnummer')}
                disabled={!!køContext.valgtKø.fritekstfilter?.find((v) => v.navn === 'foedselsnummer')}
              >
                Innbygger
              </Dropdown.Menu.List.Item>
              <Dropdown.Menu.List.Item
                onClick={() => leggInnFritekstfilter('tilordnetRessurs')}
                disabled={!!køContext.valgtKø.fritekstfilter?.find((v) => v.navn === 'tilordnetRessurs')}
              >
                Saksbehandler
              </Dropdown.Menu.List.Item>
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
