import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Meldeplikt } from 'components/behandlinger/sykdom/meldeplikt/Meldeplikt';

const user = userEvent.setup();

describe('Meldeplikt v2', () => {
  beforeEach(() => {
    render(<Meldeplikt behandlingVersjon={0} readOnly={false} />);
  });

  it('har overskrift for å identifisere steget', () => {
    expect(screen.getByRole('heading', { name: 'Unntak fra meldeplikt § 11-10 (valgfritt)' })).toBeVisible();
  });

  it('er lukket initielt', () => {
    expect(
      screen.queryByRole('textbox', { name: 'Vurder innbyggers behov for fritak fra meldeplikt' })
    ).not.toBeInTheDocument();
  });

  it('har et felt for begrunnelse', async () => {
    await åpneVilkårskort();
    expect(screen.getByRole('textbox', { name: 'Vurder innbyggers behov for fritak fra meldeplikt' })).toBeVisible();
  });

  it('har valg for å avgjøre om bruker skal få fritak fra meldeplikt eller ikke', async () => {
    await åpneVilkårskort();
    expect(screen.getByRole('group', { name: 'Skal innbygger få fritak fra meldeplikt?' })).toBeVisible();
  });

  it('har et valg for å si at bruker skal få fritak fra meldeplikt', async () => {
    await åpneVilkårskort();
    const fritakGruppe = screen.getByRole('group', { name: 'Skal innbygger få fritak fra meldeplikt?' });
    expect(within(fritakGruppe).getByRole('radio', { name: 'Ja' })).toBeVisible();
  });

  it('har et valg for å si at bruker ikke skal ha fritak fra meldeplikt', async () => {
    await åpneVilkårskort();
    const fritakGruppe = screen.getByRole('group', { name: 'Skal innbygger få fritak fra meldeplikt?' });
    expect(within(fritakGruppe).getByRole('radio', { name: 'Nei' })).toBeVisible();
  });

  it('har et felt for å fylle inn en dato for når vurderingen gjelder fra', async () => {
    await åpneVilkårskort();
    expect(screen.getByRole('textbox', { name: 'Vurderingen gjelder fra' })).toBeVisible();
  });
});

async function åpneVilkårskort() {
  const region = screen.getByRole('region', { name: 'Unntak fra meldeplikt § 11-10 (valgfritt)' });
  const button = within(region).getByRole('button');
  await user.click(button);
}
