import { describe, expect, it, vitest } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Periodetabell } from 'components/behandlinger/sykdom/meldeplikt/Periodetabell';
import { JaEllerNei } from 'lib/utils/form';
import { FritakMeldepliktFormFields, MeldepliktPeriode } from 'components/behandlinger/sykdom/meldeplikt/Meldeplikt';
import { useConfigForm } from '@navikt/aap-felles-react';
import { useFieldArray } from 'react-hook-form';

const fritaksperioder: MeldepliktPeriode[] = [
  { fom: '20.04.2023', tom: '20.05.2023', fritakFraMeldeplikt: JaEllerNei.Nei },
  { fom: '19.07.2023', tom: '27.07.2023', fritakFraMeldeplikt: JaEllerNei.Ja },
];

const periodeMedFritak = {
  fom: '20.04.2023',
  tom: '28.04.2023',
  fritakFraMeldeplikt: JaEllerNei.Ja,
};

describe('Periodetabell', () => {
  it('har en tabell med oversikt over perioder med fritak', () => {
    render(<PeriodetabellForm />);

    ['Fritak meldeplikt', 'Gjelder fra (dd.mm.åååå)', 'Til og med (dd.mm.åååå)', 'Dato vurdert', 'Handling'].forEach(
      (kolonneTittel) => {
        expect(screen.getByRole('columnheader', { name: kolonneTittel })).toBeVisible();
      }
    );
  });

  it('har en knapp pr rad for å slette når det er mer enn en periode', () => {
    render(<PeriodetabellForm fritaksperioder={fritaksperioder} />);
    expect(screen.getAllByRole('button', { name: 'Slett' })).toHaveLength(fritaksperioder.length);
  });

  it('viser ikke slette-knapp dersom det bare er en rad i tabellen', () => {
    render(<PeriodetabellForm />);
    expect(screen.queryByRole('button', { name: 'Slett' })).not.toBeInTheDocument();
  });

  it('har et felt for å velge om bruker skal ha fritak fra meldeplikten', () => {
    render(<PeriodetabellForm />);
    expect(screen.getByRole('combobox', { name: 'Fritak meldeplikt' })).toBeVisible();
  });

  it('har et felt for å registrere fra-dato på fritak for meldeplikt', () => {
    render(<PeriodetabellForm />);
    expect(screen.getByRole('textbox', { name: 'Gjelder fra' })).toBeVisible();
  });

  it('viser ikke felt for til og med dato dersom man ikke har valgt at bruker skal ha fritak', () => {
    render(<PeriodetabellForm />);
    expect(screen.queryByRole('textbox', { name: 'Til og med' })).not.toBeInTheDocument();
  });

  it('viser felt for til og med dato dersom man velger at bruker har fritak', () => {
    render(<PeriodetabellForm fritaksperioder={[periodeMedFritak]} />);
    expect(screen.queryByRole('textbox', { name: 'Til og med' })).toBeVisible();
  });
});

const PeriodetabellForm = ({ fritaksperioder }: { fritaksperioder?: MeldepliktPeriode[] }) => {
  const { form } = useConfigForm<FritakMeldepliktFormFields>({
    begrunnelse: {
      type: 'textarea',
      label: 'Vurder om det vil være unødig tyngende for søker å overholde meldeplikten',
      description: 'Begrunn vurderingen',
      rules: { required: 'Du må begrunne vurderingen din' },
      defaultValue: '',
    },
    fritaksvurdering: {
      type: 'fieldArray',
      defaultValue: fritaksperioder ?? [{ fritakFraMeldeplikt: '', fom: '', tom: '' }],
    },
  });
  const { fields } = useFieldArray({ control: form.control, name: 'fritaksvurdering' });

  return <Periodetabell form={form} perioder={fields} readOnly={false} remove={vitest.fn()} />;
};
