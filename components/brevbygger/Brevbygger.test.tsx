import { Brevbygger } from 'components/brevbygger/Brevbygger';
import { BrevmalType } from 'components/brevbygger/brevmodellTypes';
import {
  obligatoriskDelmal,
  obligatoriskDelmalMedAlternativer,
  sanityAttrs,
  valgfriDelmal,
  valgfriDelmalMedAlternativer,
} from 'components/brevbygger/brevbyggerTestdata';
import { render, screen, within } from 'lib/test/CustomRender';
import { BrevdataDto } from 'lib/types/types';
import { describe, test, expect } from 'vitest';
import userEvent from '@testing-library/user-event';
import { Behovstype } from 'lib/utils/form';

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
    _id: 'brevmal-id',
    beskrivelse: 'En beskrivelse',
    overskrift: 'En overskrift',
    journalposttittel: 'jp-tittel',
    kanSendesAutomatisk: false,
    delmaler: [valgfriDelmal, obligatoriskDelmal],
  };

  test('Overskrift hentes fra beskrivelse', () => {
    render(
      <Brevbygger
        referanse={'1234'}
        brevmal={JSON.stringify(brevmal)}
        brevdata={brevdata}
        behovstype={Behovstype.SKRIV_VEDTAKSBREV_KODE}
        mottaker={{ ident: '1234', navn: 'Navn' }}
        behandlingVersjon={1}
        readOnly={false}
      />
    );
    expect(screen.getByRole('heading', { name: valgfriDelmal.delmal.beskrivelse })).toBeVisible();
  });

  test('Valgfrie delmaler har en checkbox (Switch fra Aksel)', () => {
    render(
      <Brevbygger
        referanse={'1234'}
        brevmal={JSON.stringify(brevmal)}
        brevdata={brevdata}
        behovstype={Behovstype.SKRIV_VEDTAKSBREV_KODE}
        mottaker={{ ident: '1234', navn: 'Navn' }}
        behandlingVersjon={1}
        readOnly={false}
      />
    );
    const kort = screen.getByRole('heading', { name: valgfriDelmal.delmal.beskrivelse }).closest('div');

    if (kort) {
      expect(within(kort).getByRole('checkbox', { name: 'Inkluder i brev' })).toBeVisible();
    } else {
      expect(kort).not.toBeNull();
    }
  });

  test('Obligatoriske delmaler uten valg vises ikke', () => {
    render(
      <Brevbygger
        referanse={'1234'}
        brevmal={JSON.stringify(brevmal)}
        brevdata={brevdata}
        behovstype={Behovstype.SKRIV_VEDTAKSBREV_KODE}
        mottaker={{ ident: '1234', navn: 'Navn' }}
        behandlingVersjon={1}
        readOnly={false}
      />
    );
    expect(screen.queryByText(obligatoriskDelmal.delmal.beskrivelse)).not.toBeInTheDocument();
  });

  test('Valgfrie delmaler er ikke valgt initielt', () => {
    render(
      <Brevbygger
        referanse={'1234'}
        brevmal={JSON.stringify(brevmal)}
        brevdata={brevdata}
        behovstype={Behovstype.SKRIV_VEDTAKSBREV_KODE}
        mottaker={{ ident: '1234', navn: 'Navn' }}
        behandlingVersjon={1}
        readOnly={false}
      />
    );
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
        behovstype={Behovstype.SKRIV_VEDTAKSBREV_KODE}
        mottaker={{ ident: '1234', navn: 'Navn' }}
        behandlingVersjon={1}
        readOnly={false}
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
    _id: 'brevmal-id',
    beskrivelse: 'En beskrivelse',
    overskrift: 'En overskrift',
    journalposttittel: 'jp-tittel',
    kanSendesAutomatisk: false,
    delmaler: [valgfriDelmalMedAlternativer],
  };

  test('valg skjules når delmal ikke er valgt', () => {
    render(
      <Brevbygger
        referanse={'1234'}
        brevmal={JSON.stringify(brevmal)}
        brevdata={brevdata}
        behovstype={Behovstype.SKRIV_VEDTAKSBREV_KODE}
        mottaker={{ ident: '1234', navn: 'Navn' }}
        behandlingVersjon={1}
        readOnly={false}
      />
    );
    expect(screen.queryByText('Beskrivelse av alternativ')).not.toBeInTheDocument();
  });

  test('valg vises når delmal er valgt', () => {
    render(
      <Brevbygger
        referanse={'1234'}
        brevmal={JSON.stringify(brevmal)}
        brevdata={{ ...brevdata, delmaler: [{ id: valgfriDelmalMedAlternativer.delmal._id }] }}
        behovstype={Behovstype.SKRIV_VEDTAKSBREV_KODE}
        mottaker={{ ident: '1234', navn: 'Navn' }}
        behandlingVersjon={1}
        readOnly={false}
      />
    );
    expect(screen.getByRole('combobox', { name: 'Beskrivelse av alternativ' })).toBeInTheDocument();
  });

  test('obligatoriske delmaler med valg vises', () => {
    const brevmalMedObligatoriskDelmalMedAlternativer: BrevmalType = {
      ...sanityAttrs,
      _id: 'brevmal-id',
      beskrivelse: 'En beskrivelse',
      overskrift: 'En overskrift',
      journalposttittel: 'jp-tittel',
      kanSendesAutomatisk: false,
      delmaler: [obligatoriskDelmalMedAlternativer],
    };
    render(
      <Brevbygger
        referanse={'1234'}
        brevmal={JSON.stringify(brevmalMedObligatoriskDelmalMedAlternativer)}
        brevdata={brevdata}
        behovstype={Behovstype.SKRIV_VEDTAKSBREV_KODE}
        mottaker={{ ident: '1234', navn: 'Navn' }}
        behandlingVersjon={1}
        readOnly={false}
      />
    );
    expect(screen.getByRole('heading', { name: obligatoriskDelmalMedAlternativer.delmal.beskrivelse })).toBeVisible();
    expect(screen.getByText('Alternativ 1')).toBeVisible();
  });

  test('Obligatoriske delmaler har ikke en checkbox (Switch fra Aksel)', () => {
    const brevmalMedObligatoriskDelmalMedAlternativer: BrevmalType = {
      ...sanityAttrs,
      _id: 'brevmal-id',
      beskrivelse: 'En beskrivelse',
      overskrift: 'En overskrift',
      journalposttittel: 'jp-tittel',
      kanSendesAutomatisk: false,
      delmaler: [obligatoriskDelmalMedAlternativer],
    };
    render(
      <Brevbygger
        referanse={'1234'}
        brevmal={JSON.stringify(brevmalMedObligatoriskDelmalMedAlternativer)}
        brevdata={brevdata}
        behovstype={Behovstype.SKRIV_VEDTAKSBREV_KODE}
        mottaker={{ ident: '1234', navn: 'Navn' }}
        behandlingVersjon={1}
        readOnly={false}
      />
    );
    const kort = screen.getByRole('heading', { name: obligatoriskDelmal.delmal.beskrivelse }).closest('div');

    if (kort) {
      expect(within(kort).queryByRole('checkbox', { name: 'Inkluder i brev' })).not.toBeInTheDocument();
    } else {
      expect(kort).not.toBeNull();
    }
  });

  test('alternativer hentes fra brevmalen', () => {
    render(
      <Brevbygger
        referanse={'1234'}
        brevmal={JSON.stringify(brevmal)}
        brevdata={{ ...brevdata, delmaler: [{ id: valgfriDelmalMedAlternativer.delmal._id }] }}
        behovstype={Behovstype.SKRIV_VEDTAKSBREV_KODE}
        mottaker={{ ident: '1234', navn: 'Navn' }}
        behandlingVersjon={1}
        readOnly={false}
      />
    );
    expect(screen.getByRole('option', { name: 'Alternativ 1' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Alternativ 2' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Fritekst' })).toBeInTheDocument();
  });

  test('viser fritekstfelt når fritekst er valgt', async () => {
    const brevmal: BrevmalType = {
      ...sanityAttrs,
      _id: 'brevmal-id',
      beskrivelse: 'En beskrivelse',
      overskrift: 'En overskrift',
      journalposttittel: 'jp-tittel',
      kanSendesAutomatisk: false,
      delmaler: [obligatoriskDelmal, valgfriDelmalMedAlternativer],
    };

    render(
      <Brevbygger
        referanse={'1234'}
        brevmal={JSON.stringify(brevmal)}
        brevdata={{ ...brevdata, delmaler: [{ id: valgfriDelmalMedAlternativer.delmal._id }] }}
        behovstype={Behovstype.SKRIV_VEDTAKSBREV_KODE}
        mottaker={{ ident: '1234', navn: 'Navn' }}
        behandlingVersjon={1}
        readOnly={false}
      />
    );

    await user.click(screen.getByRole('checkbox', { name: 'Inkluder i brev' }));

    await user.selectOptions(screen.getByRole('combobox', { name: 'Beskrivelse av alternativ' }), ['alt3-key']);
    expect(screen.getByRole('textbox', { name: 'Fritekst' })).toBeVisible();
  });

  test('valg er valgt når det kommer som input til brevbyggeren', () => {
    render(
      <Brevbygger
        referanse={'1234'}
        brevmal={JSON.stringify(brevmal)}
        brevdata={{
          ...brevdata,
          delmaler: [{ id: valgfriDelmalMedAlternativer.delmal._id }],
          valg: [
            {
              id: 'valgref-1',
              key: 'alt1-key',
            },
          ],
        }}
        behovstype={Behovstype.SKRIV_VEDTAKSBREV_KODE}
        mottaker={{ ident: '1234', navn: 'Navn' }}
        behandlingVersjon={1}
        readOnly={false}
      />
    );

    expect(screen.getByRole('combobox', { name: 'Beskrivelse av alternativ' })).toBeVisible();
    expect((screen.getByRole('option', { name: 'Alternativ 1' }) as HTMLOptionElement).selected).toBe(true);
  });

  test('fritekst er valgt når det kommer som input til brevbyggeren', () => {
    render(
      <Brevbygger
        referanse={'1234'}
        brevmal={JSON.stringify(brevmal)}
        brevdata={{
          ...brevdata,
          delmaler: [{ id: valgfriDelmalMedAlternativer.delmal._id }],
          valg: [
            {
              id: 'valgref-1',
              key: 'alt3-key',
            },
          ],
          fritekster: [
            {
              fritekst: JSON.stringify({ tekst: 'Her kommer det litt fritekst' }),
              parentId: 'valgref-1',
              key: 'alt3-key',
            },
          ],
        }}
        behovstype={Behovstype.SKRIV_VEDTAKSBREV_KODE}
        mottaker={{ ident: '1234', navn: 'Navn' }}
        behandlingVersjon={1}
        readOnly={false}
      />
    );

    expect(screen.getByRole('combobox', { name: 'Beskrivelse av alternativ' })).toBeVisible();
    expect((screen.getByRole('option', { name: 'Fritekst' }) as HTMLOptionElement).selected).toBe(true);
    expect(screen.getByRole('textbox', { name: 'Fritekst' })).toBeVisible();
    expect(screen.getByText('Her kommer det litt fritekst')).toBeVisible();
  });
});
