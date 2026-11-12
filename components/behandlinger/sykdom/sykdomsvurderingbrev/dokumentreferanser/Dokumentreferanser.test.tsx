import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen, within } from 'lib/test/CustomRender';
import { userEvent } from '@testing-library/user-event';
import { Dokumentreferanser } from './Dokumentreferanser';

const TestSkjema = ({ onSubmit = vi.fn() }: { onSubmit?: () => void }) => {
  const [valgteDokumentIder, setValgteDokumentIder] = useState<string[]>([]);
  const [dokumentnavn, setDokumentnavn] = useState<Record<string, string>>({});

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <Dokumentreferanser
        valgteDokumentIder={valgteDokumentIder}
        dokumentnavn={dokumentnavn}
        onChange={setValgteDokumentIder}
        onEndreNavn={(id, navn) => setDokumentnavn((gjeldende) => ({ ...gjeldende, [id]: navn }))}
        readOnly={false}
      />
    </form>
  );
};

describe('Dokumentreferanser', () => {
  it('viser innkommende dokumenter uten meldekort som standard', async () => {
    const user = userEvent.setup();
    render(<TestSkjema />);

    await user.click(screen.getByRole('button', { name: 'Legg til' }));

    expect(screen.getByRole('dialog', { name: 'Velg dokumenter' })).toBeVisible();
    expect(screen.getAllByRole('checkbox', { name: /^Velg / })).toHaveLength(3);
    expect(screen.getByRole('button', { name: 'Annen dokumentasjon' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Legeerklæring' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Søknad om arbeidsavklaringspenger' })).toBeVisible();
    expect(screen.queryByRole('button', { name: 'Forespørsel om dokumentasjon' })).not.toBeInTheDocument();
    expect(screen.queryByRole('checkbox', { name: /Velg Meldekort/ })).not.toBeInTheDocument();
    expect(screen.getByText('24.01.2026')).toBeVisible();
    expect(screen.getByText('L7-legeerklæring')).toBeVisible();
  });

  it('bekrefter flere dokumenter uten å sende inn skjemaet, og kan fjerne dem igjen', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<TestSkjema onSubmit={onSubmit} />);

    await user.click(screen.getByRole('button', { name: 'Legg til' }));
    await user.click(screen.getByRole('checkbox', { name: 'Velg Legeerklæring' }));
    await user.click(screen.getByRole('checkbox', { name: 'Velg Annen dokumentasjon' }));
    await user.click(screen.getByRole('button', { name: 'Bekreft' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Legeerklæring' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Annen dokumentasjon' })).toBeVisible();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(onSubmit).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: 'Fjern Legeerklæring' }));
    expect(screen.queryByRole('button', { name: 'Legeerklæring' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Annen dokumentasjon' })).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Fjern Annen dokumentasjon' }));
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('forkaster endringer ved avbryt og beholder bekreftede valg ved gjenåpning', async () => {
    const user = userEvent.setup();
    render(<TestSkjema />);

    await user.click(screen.getByRole('button', { name: 'Legg til' }));
    await user.click(screen.getByRole('checkbox', { name: 'Velg Legeerklæring' }));
    await user.click(screen.getByRole('button', { name: 'Bekreft' }));
    await user.click(screen.getByRole('button', { name: 'Legg til' }));

    expect(screen.getByRole('checkbox', { name: 'Velg Legeerklæring' })).toBeChecked();
    await user.click(screen.getByRole('checkbox', { name: 'Velg Legeerklæring' }));
    await user.click(screen.getByRole('checkbox', { name: 'Velg Annen dokumentasjon' }));
    await user.click(screen.getByRole('button', { name: 'Avbryt' }));

    expect(screen.getByRole('button', { name: 'Legeerklæring' })).toBeVisible();
    expect(screen.queryByRole('button', { name: 'Annen dokumentasjon' })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Legg til' }));
    expect(screen.getByRole('checkbox', { name: 'Velg Legeerklæring' })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Velg Annen dokumentasjon' })).not.toBeChecked();
  });

  it('forkaster ubekreftede valg når modalens lukkeknapp brukes', async () => {
    const user = userEvent.setup();
    render(<TestSkjema />);

    await user.click(screen.getByRole('button', { name: 'Legg til' }));
    await user.click(screen.getByRole('checkbox', { name: 'Velg Legeerklæring' }));
    await user.click(screen.getByRole('button', { name: /lukk/i }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Legg til' }));
    expect(screen.getByRole('checkbox', { name: 'Velg Legeerklæring' })).not.toBeChecked();
  });

  it('filtrerer på dokumenttype og beholder valg som skjules av filteret', async () => {
    const user = userEvent.setup();
    render(<TestSkjema />);

    await user.click(screen.getByRole('button', { name: 'Legg til' }));
    await user.click(screen.getByRole('checkbox', { name: 'Velg Legeerklæring' }));
    const combobox = screen.getByRole('combobox', { name: /Innkommende\/utgående/ });
    await user.click(combobox);
    await user.click(screen.getByRole('option', { name: 'Utgående' }));
    await user.click(combobox);
    await user.click(screen.getByRole('option', { name: 'Innkommende' }));
    await user.click(screen.getByRole('checkbox', { name: 'Velg Forespørsel om dokumentasjon' }));

    expect(screen.queryByRole('checkbox', { name: 'Velg Legeerklæring' })).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Bekreft' }));

    expect(screen.getByRole('button', { name: 'Legeerklæring' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Forespørsel om dokumentasjon' })).toBeVisible();
  });

  it('viser meldekort med bryteren og beholder valgte meldekort når de skjules', async () => {
    const user = userEvent.setup();
    render(<TestSkjema />);

    await user.click(screen.getByRole('button', { name: 'Legg til' }));
    await user.click(screen.getByRole('checkbox', { name: 'Vis meldekort' }));
    await user.click(screen.getByRole('checkbox', { name: /Velg Meldekort/ }));
    await user.click(screen.getByRole('checkbox', { name: 'Vis meldekort' }));
    expect(screen.queryByRole('checkbox', { name: /Velg Meldekort/ })).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Bekreft' }));

    expect(screen.getByRole('button', { name: /^Meldekort for perioden/ })).toBeVisible();
  });

  it('kan oppheve alle tidligere bekreftede valg', async () => {
    const user = userEvent.setup();
    render(<TestSkjema />);

    await user.click(screen.getByRole('button', { name: 'Legg til' }));
    await user.click(screen.getByRole('checkbox', { name: 'Velg Legeerklæring' }));
    await user.click(screen.getByRole('button', { name: 'Bekreft' }));
    await user.click(screen.getByRole('button', { name: 'Legg til' }));
    await user.click(screen.getByRole('checkbox', { name: 'Velg Legeerklæring' }));
    await user.click(screen.getByRole('button', { name: 'Bekreft' }));

    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('kan redigere visningsnavnet uten å endre originaltittelen eller sende inn vurderingen', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<TestSkjema onSubmit={onSubmit} />);

    await user.click(screen.getByRole('button', { name: 'Legg til' }));
    await user.click(screen.getByRole('checkbox', { name: 'Velg Legeerklæring' }));
    await user.click(screen.getByRole('button', { name: 'Bekreft' }));
    await user.click(screen.getByRole('button', { name: 'Rediger navn på Legeerklæring' }));

    const navnefelt = screen.getByRole('textbox', { name: 'Dokumentnavn' });
    expect(navnefelt).toHaveValue('Legeerklæring');
    await user.clear(navnefelt);
    await user.type(navnefelt, '  Opplysninger fra lege  ');
    await user.click(screen.getByRole('button', { name: 'Lagre navn' }));

    expect(await screen.findByRole('button', { name: 'Opplysninger fra lege' })).toBeVisible();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: 'Opplysninger fra lege' }));
    const forhåndsvisning = screen.getByRole('dialog', { name: 'Legeerklæring' });
    await user.click(within(forhåndsvisning).getByRole('button', { name: 'Lukk forhåndsvisning' }));
    await user.click(screen.getByRole('button', { name: 'Legg til' }));
    const dokumentvelger = within(screen.getByRole('dialog', { name: 'Velg dokumenter' }));
    expect(dokumentvelger.getByRole('button', { name: 'Legeerklæring' })).toBeVisible();
    expect(dokumentvelger.getByRole('checkbox', { name: 'Velg Legeerklæring' })).toBeChecked();
    await user.click(dokumentvelger.getByRole('button', { name: 'Bekreft' }));

    expect(screen.getByRole('button', { name: 'Opplysninger fra lege' })).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Fjern Opplysninger fra lege' }));
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('beholder forrige navn når navneredigering avbrytes eller lukkes', async () => {
    const user = userEvent.setup();
    render(<TestSkjema />);

    await user.click(screen.getByRole('button', { name: 'Legg til' }));
    await user.click(screen.getByRole('checkbox', { name: 'Velg Legeerklæring' }));
    await user.click(screen.getByRole('button', { name: 'Bekreft' }));
    await user.click(screen.getByRole('button', { name: 'Rediger navn på Legeerklæring' }));
    await user.clear(screen.getByRole('textbox', { name: 'Dokumentnavn' }));
    await user.type(screen.getByRole('textbox', { name: 'Dokumentnavn' }), 'Ulagret navn');
    await user.click(screen.getByRole('button', { name: 'Avbryt' }));

    expect(screen.getByRole('button', { name: 'Legeerklæring' })).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Rediger navn på Legeerklæring' }));
    expect(screen.getByRole('textbox', { name: 'Dokumentnavn' })).toHaveValue('Legeerklæring');
    await user.clear(screen.getByRole('textbox', { name: 'Dokumentnavn' }));
    await user.click(screen.getByRole('button', { name: 'Lukk' }));

    expect(screen.getByRole('button', { name: 'Legeerklæring' })).toBeVisible();
  });

  it('krever et navn med innhold og kan lagre med Enter uten å sende inn vurderingen', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<TestSkjema onSubmit={onSubmit} />);

    await user.click(screen.getByRole('button', { name: 'Legg til' }));
    await user.click(screen.getByRole('checkbox', { name: 'Velg Legeerklæring' }));
    await user.click(screen.getByRole('button', { name: 'Bekreft' }));
    await user.click(screen.getByRole('button', { name: 'Rediger navn på Legeerklæring' }));
    const navnefelt = screen.getByRole('textbox', { name: 'Dokumentnavn' });
    await user.clear(navnefelt);
    await user.click(screen.getByRole('button', { name: 'Lagre navn' }));
    expect(await screen.findByText('Du må oppgi et dokumentnavn')).toBeVisible();

    await user.type(navnefelt, '   ');
    await user.click(screen.getByRole('button', { name: 'Lagre navn' }));
    expect(await screen.findByText('Du må oppgi et dokumentnavn')).toBeVisible();
    expect(screen.getByRole('dialog', { name: 'Rediger dokumentnavn' })).toBeVisible();

    await user.clear(navnefelt);
    await user.type(navnefelt, 'Nytt dokumentnavn{Enter}');
    expect(await screen.findByRole('button', { name: 'Nytt dokumentnavn' })).toBeVisible();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('viser en lokal forhåndsvisning uten å endre dokumentvalget', async () => {
    const user = userEvent.setup();
    render(<TestSkjema />);

    await user.click(screen.getByRole('button', { name: 'Legg til' }));
    await user.click(screen.getByRole('button', { name: 'Legeerklæring' }));

    const forhåndsvisning = screen.getByRole('dialog', { name: 'Legeerklæring' });
    expect(within(forhåndsvisning).getByText(/Dette er et eksempeldokument/)).toBeVisible();
    await user.click(within(forhåndsvisning).getByRole('button', { name: 'Lukk forhåndsvisning' }));

    expect(screen.getByRole('dialog', { name: 'Velg dokumenter' })).toBeVisible();
    expect(screen.getByRole('checkbox', { name: 'Velg Legeerklæring' })).not.toBeChecked();
  });

  it('viser valgte dokumenter uten mulighet til å legge til eller fjerne i lesemodus', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Dokumentreferanser
        valgteDokumentIder={['mock-legeerklaering']}
        dokumentnavn={{ 'mock-legeerklaering': 'Tilpasset dokumentnavn' }}
        onChange={onChange}
        onEndreNavn={onChange}
        readOnly
      />
    );

    expect(screen.getByRole('button', { name: 'Tilpasset dokumentnavn' })).toBeVisible();
    expect(screen.queryByRole('button', { name: 'Legg til' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Fjern/ })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Rediger navn/ })).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Tilpasset dokumentnavn' }));
    expect(screen.getByRole('dialog', { name: 'Legeerklæring' })).toBeVisible();
    expect(onChange).not.toHaveBeenCalled();
  });
});
