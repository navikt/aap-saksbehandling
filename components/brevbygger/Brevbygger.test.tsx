import { Brevbygger } from 'components/brevbygger/Brevbygger';
import { BrevmalType } from 'components/brevbygger/brevmodellTypes';
import {
  obligatoriskDelmal,
  sanityAttrs,
  valgfriDelmal,
  valgfriDelmalMedAlternativer,
} from 'components/brevbygger/brevbyggerTestdata';
import { render, screen, within } from 'lib/test/CustomRender';
import { BrevdataDto } from 'lib/types/types';
import { describe, test, expect } from 'vitest';
import userEvent from '@testing-library/user-event';

const brevdata: BrevdataDto = {
  betingetTekst: [],
  delmaler: [],
  faktagrunnlag: [],
  fritekster: [],
  periodetekster: [],
  valg: [],
};

const user = userEvent.setup();

describe('Delmalvelger', () => {
  const brevmal: BrevmalType = {
    ...sanityAttrs,
    beskrivelse: 'En beskrivelse',
    overskrift: 'En overskrift',
    journalposttittel: 'jp-tittel',
    kanSendesAutomatisk: false,
    delmaler: [valgfriDelmal, obligatoriskDelmal],
  };
  test('Overskrift hentes fra beskrivelse', () => {
    render(<Brevbygger referanse={'1234'} brevmal={JSON.stringify(brevmal)} brevdata={brevdata} />);
    expect(screen.getByRole('heading', { name: valgfriDelmal.delmal.beskrivelse })).toBeVisible();
    expect(screen.getByRole('heading', { name: obligatoriskDelmal.delmal.beskrivelse })).toBeVisible();
  });

  test('Valgfrie delmaler har en checkbox (Switch fra Aksel)', () => {
    render(<Brevbygger referanse={'1234'} brevmal={JSON.stringify(brevmal)} brevdata={brevdata} />);
    const kort = screen.getByRole('heading', { name: valgfriDelmal.delmal.beskrivelse }).closest('div');

    if (kort) {
      expect(within(kort).getByRole('checkbox', { name: 'Inkluder i brev' })).toBeVisible();
    } else {
      expect(kort).not.toBeNull();
    }
  });

  test('Obligatoriske delmaler har ikke en checkbox (Switch fra Aksel)', () => {
    render(<Brevbygger referanse={'1234'} brevmal={JSON.stringify(brevmal)} brevdata={brevdata} />);
    const kort = screen.getByRole('heading', { name: obligatoriskDelmal.delmal.beskrivelse }).closest('div');

    if (kort) {
      expect(within(kort).queryByRole('checkbox', { name: 'Inkluder i brev' })).not.toBeInTheDocument();
    } else {
      expect(kort).not.toBeNull();
    }
  });

  test('Valgfrie delmaler er ikke valgt initielt', () => {
    render(<Brevbygger referanse={'1234'} brevmal={JSON.stringify(brevmal)} brevdata={brevdata} />);
    const kort = screen.getByRole('heading', { name: valgfriDelmal.delmal.beskrivelse }).closest('div');

    if (kort) {
      expect(within(kort).getByRole('checkbox', { name: 'Inkluder i brev' })).not.toBeChecked();
    } else {
      expect(kort).not.toBeNull();
    }
  });

  test('Valgfrie delmaler kan være valgt initielt', () => {
    render(
      <Brevbygger
        referanse={'1234'}
        brevmal={JSON.stringify(brevmal)}
        brevdata={{ ...brevdata, delmaler: [{ id: valgfriDelmal.delmal._id }] }}
      />
    );
    const kort = screen.getByRole('heading', { name: valgfriDelmal.delmal.beskrivelse }).closest('div');

    if (kort) {
      expect(within(kort).getByRole('checkbox', { name: 'Inkluder i brev' })).toBeChecked();
    } else {
      expect(kort).not.toBeNull();
    }
  });
});

describe('Delmaler med valg', () => {
  const brevmal: BrevmalType = {
    ...sanityAttrs,
    beskrivelse: 'En beskrivelse',
    overskrift: 'En overskrift',
    journalposttittel: 'jp-tittel',
    kanSendesAutomatisk: false,
    delmaler: [valgfriDelmalMedAlternativer],
  };

  test('valg skjules når delmal ikke er valgt', () => {
    render(<Brevbygger referanse={'1234'} brevmal={JSON.stringify(brevmal)} brevdata={brevdata} />);
    expect(screen.queryByText('Beskrivelse av alternativ')).not.toBeInTheDocument();
  });

  test('valg vises når delmal er valgt', () => {
    render(
      <Brevbygger
        referanse={'1234'}
        brevmal={JSON.stringify(brevmal)}
        brevdata={{ ...brevdata, delmaler: [{ id: valgfriDelmalMedAlternativer.delmal._id }] }}
      />
    );
    expect(screen.getByRole('combobox', { name: 'Beskrivelse av alternativ' })).toBeInTheDocument();
  });

  test('alternativer hentes fra brevmalen', () => {
    render(
      <Brevbygger
        referanse={'1234'}
        brevmal={JSON.stringify(brevmal)}
        brevdata={{ ...brevdata, delmaler: [{ id: valgfriDelmalMedAlternativer.delmal._id }] }}
      />
    );
    expect(screen.getByRole('option', { name: 'Alternativ 1' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Alternativ 2' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Fritekst' })).toBeInTheDocument();
  });

  test('viser fritekstfelt når fritekst er valgt', async () => {
    render(
      <Brevbygger
        referanse={'1234'}
        brevmal={JSON.stringify(brevmal)}
        brevdata={{ ...brevdata, delmaler: [{ id: valgfriDelmalMedAlternativer.delmal._id }] }}
      />
    );

    await user.selectOptions(screen.getByRole('combobox', { name: 'Beskrivelse av alternativ' }), ['alt3-key']);
    expect(screen.getByRole('textbox', { name: 'Fritekst' })).toBeVisible();
  });
});
