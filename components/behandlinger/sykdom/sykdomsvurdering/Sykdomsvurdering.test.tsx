import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { Sykdomsvurdering } from 'components/behandlinger/sykdom/sykdomsvurdering/Sykdomsvurdering';
import { userEvent } from '@testing-library/user-event';
import { SykdomsGrunnlag } from 'lib/types/types';

describe('sykdomsvurdering uten yrkesskade', () => {
  const user = userEvent.setup();
  const grunnlag: SykdomsGrunnlag = {
    skalVurdereYrkesskade: false,
    opplysninger: { innhentedeYrkesskader: [], oppgittYrkesskadeISøknad: false },
  };

  it('Skal ha korrekt heading', () => {
    render(<Sykdomsvurdering grunnlag={grunnlag} readOnly={false} behandlingVersjon={0} tilknyttedeDokumenter={[]} />);
    const heading = screen.getByRole('heading', { name: 'Nedsatt arbeidsevne - § 11-5' });
    expect(heading).toBeVisible();
  });

  it('skal ha en liste over tilknyttede dokumenter til vilkåret ', () => {
    render(<Sykdomsvurdering grunnlag={grunnlag} readOnly={false} behandlingVersjon={0} tilknyttedeDokumenter={[]} />);
    const tilknyttedeDokumenterListe = screen.getByRole('list', { name: 'Tilknyttede dokumenter' });
    expect(tilknyttedeDokumenterListe).toBeVisible();
  });

  it('Skal ha et begrunnelsefelt', () => {
    render(<Sykdomsvurdering grunnlag={grunnlag} readOnly={false} behandlingVersjon={0} tilknyttedeDokumenter={[]} />);
    const textbox = screen.getByRole('textbox', { name: /Vurder den nedsatte arbeidsevnen/ });
    expect(textbox).toBeVisible();
  });

  it('Skal vise korrekt description på begrunnelsesfelt', async () => {
    render(<Sykdomsvurdering grunnlag={grunnlag} readOnly={false} behandlingVersjon={0} tilknyttedeDokumenter={[]} />);

    const label = screen.getByText(
      'Hvilken sykdom / skade / lyte. Hva er det mest vesentlige? Hvis yrkesskade er funnet: vurder mot YS'
    );

    expect(label).toBeVisible();
  });

  it('har et felt for om bruker har sykdom, skade eller lyte', () => {
    render(<Sykdomsvurdering grunnlag={grunnlag} readOnly={false} behandlingVersjon={0} tilknyttedeDokumenter={[]} />);
    expect(screen.getByRole('group', { name: 'Har innbygger sykdom, skade eller lyte?' })).toBeVisible();
  });

  it('viser ikke felt for om arbeidsevnen er nedsatt før spørsmål om sykdom, skade eller lyte er besvart', () => {
    render(<Sykdomsvurdering grunnlag={grunnlag} readOnly={false} behandlingVersjon={0} tilknyttedeDokumenter={[]} />);
    expect(screen.queryByRole('group', { name: 'Har innbygger nedsatt arbeidsevne?' })).not.toBeInTheDocument();
  });

  it('viser ikke felt for om arbeidsevnen er nedsatt dersom innbygger ikke har sykdom, skade eller lyte', async () => {
    render(<Sykdomsvurdering grunnlag={grunnlag} readOnly={false} behandlingVersjon={0} tilknyttedeDokumenter={[]} />);
    await velgAtInnbyggerIkkeHarSykdomSkadeEllerLyte();
    expect(screen.queryByRole('group', { name: 'Har innbygger nedsatt arbeidsevne?' })).not.toBeInTheDocument();
  });

  it('Skal ha et felt for om arbeidsevnen er nedsatt dersom innbygger har sykdom, skade eller lyte', async () => {
    render(<Sykdomsvurdering grunnlag={grunnlag} readOnly={false} behandlingVersjon={0} tilknyttedeDokumenter={[]} />);
    await velgAtInnbyggerHarSykdomSkadeLyte();
    const textbox = screen.getByRole('group', { name: 'Har innbygger nedsatt arbeidsevne?' });
    expect(textbox).toBeVisible();
  });

  it('Skal ha et felt for om sykdom, skade eller lyte er årsaken til nedsatt arbeidsevne', async () => {
    render(<Sykdomsvurdering grunnlag={grunnlag} readOnly={false} behandlingVersjon={0} tilknyttedeDokumenter={[]} />);
    await velgAtInnbyggerHarSykdomSkadeLyte();
    const radioGroup = screen.getByRole('group', {
      name: 'Er sykdom, skade eller lyte vesentlig medvirkende til at arbeidsevnen er nedsatt?',
    });
    expect(radioGroup).toBeVisible();
  });

  it('Skal ha et felt for om arbeidsevnen er nedsatt med minst 50 prosent', async () => {
    render(<Sykdomsvurdering grunnlag={grunnlag} readOnly={false} behandlingVersjon={0} tilknyttedeDokumenter={[]} />);
    await velgAtInnbyggerHarSykdomSkadeLyte();
    const radioGroup = screen.getByRole('group', { name: 'Er arbeidsevnen nedsatt med minst 50%?' });
    expect(radioGroup).toBeVisible();
  });

  it('felt for når arbeidsevnen ble nedsatt vises ikke når innbygger ikke har sykdom, skade eller lyte', async () => {
    render(<Sykdomsvurdering grunnlag={grunnlag} readOnly={false} behandlingVersjon={0} tilknyttedeDokumenter={[]} />);
    await velgAtInnbyggerIkkeHarSykdomSkadeEllerLyte();
    const felt = screen.queryByRole('textbox', { name: 'Hvilket år ble arbeidsevnen nedsatt? (§11-5)' });
    expect(felt).toBeNull();
  });

  it('felt for når arbeidsevnen ble nedsatt vises ikke når det er valgt nei på ett eller flere valg', async () => {
    render(<Sykdomsvurdering grunnlag={grunnlag} readOnly={false} behandlingVersjon={0} tilknyttedeDokumenter={[]} />);
    await velgAtInnbyggerHarSykdomSkadeLyte();
    await velgNeiIGruppe(screen.getByRole('group', { name: 'Har innbygger nedsatt arbeidsevne?' }));
    await velgJaIGruppe(screen.getByRole('group', { name: 'Er arbeidsevnen nedsatt med minst 50%?' }));
    await velgJaIGruppe(
      screen.getByRole('group', {
        name: 'Er sykdom, skade eller lyte vesentlig medvirkende til at arbeidsevnen er nedsatt?',
      })
    );
    expect(
      screen.queryByRole('textbox', { name: 'Hvilket år ble arbeidsevnen nedsatt? (§11-5)' })
    ).not.toBeInTheDocument();
  });

  it('felt for når arbeidsevnen ble nedsatt vises når alle spørsmål er besvart med ja', async () => {
    render(<Sykdomsvurdering grunnlag={grunnlag} readOnly={false} behandlingVersjon={0} tilknyttedeDokumenter={[]} />);
    await velgAtInnbyggerHarSykdomSkadeLyte();
    await velgJaIGruppe(screen.getByRole('group', { name: 'Har innbygger nedsatt arbeidsevne?' }));
    await velgJaIGruppe(screen.getByRole('group', { name: 'Er arbeidsevnen nedsatt med minst 50%?' }));
    await velgJaIGruppe(
      screen.getByRole('group', {
        name: 'Er sykdom, skade eller lyte vesentlig medvirkende til at arbeidsevnen er nedsatt?',
      })
    );
    expect(screen.getByRole('textbox', { name: 'Hvilket år ble arbeidsevnen nedsatt? (§11-5)' })).toBeVisible();
  });

  it('Skal ikke vise felt for om sykdom, skade eller lyte er årsaken til nedsatt arbeidsevne dersom arbeidsevnen ikke er nedsatt', () => {
    render(<Sykdomsvurdering grunnlag={grunnlag} readOnly={false} behandlingVersjon={0} tilknyttedeDokumenter={[]} />);
    const radioGroup = screen.queryByRole('group', {
      name: 'Er det sykdom, skade eller lyte som er vesentlig medvirkende til nedsatt arbeidsevne? (§ 11-5)',
    });
    expect(radioGroup).toBeNull();
  });

  it('Skal ikke vise felt for om arbeidsevnen er nedsatt med minst 50 prosent dersom arbeidsevnen ikke er nedsatt', () => {
    render(<Sykdomsvurdering grunnlag={grunnlag} readOnly={false} behandlingVersjon={0} tilknyttedeDokumenter={[]} />);
    const radioGroup = screen.queryByRole('group', { name: 'Er arbeidsevnen nedsatt med minst 50%?' });
    expect(radioGroup).toBeNull();
  });

  it('Skal vise feilmelding dersom begrunnelse felt ikke er besvart', async () => {
    render(<Sykdomsvurdering grunnlag={grunnlag} readOnly={false} behandlingVersjon={0} tilknyttedeDokumenter={[]} />);
    const button = screen.getByRole('button', { name: /Bekreft/ });
    await user.click(button);

    expect(await screen.findByText('Du må begrunne')).toBeVisible();
  });

  it('Skal vise feilmelding dersom felt om at spørsmål om innbygger har sykdom, skade eller lyte ikke har blitt besvart', async () => {
    render(<Sykdomsvurdering grunnlag={grunnlag} readOnly={false} behandlingVersjon={0} tilknyttedeDokumenter={[]} />);
    const button = screen.getByRole('button', { name: /Bekreft/ });
    await user.click(button);

    expect(await screen.findByText('Du må svare på om innbygger har sykdom, skade eller lyte')).toBeVisible();
  });

  it('Skal vise feilmelding dersom felt for om sykdom, skade eller lyte er årsaken til nedsatt arbeidsevne ikke er besvart', async () => {
    render(<Sykdomsvurdering grunnlag={grunnlag} readOnly={false} behandlingVersjon={0} tilknyttedeDokumenter={[]} />);
    await velgAtInnbyggerHarSykdomSkadeLyte();
    const button = screen.getByRole('button', { name: /Bekreft/ });
    await user.click(button);

    expect(
      await screen.findByText(
        'Du må svare på om sykdom, skade eller lyte er vesentlig medvirkende til nedsatt arbeidsevne'
      )
    ).toBeVisible();
  });

  it('viser feilmelding dersom felt om arbeidsevnen er nedsatt ikke er besvart', async () => {
    render(<Sykdomsvurdering grunnlag={grunnlag} readOnly={false} behandlingVersjon={0} tilknyttedeDokumenter={[]} />);
    await velgAtInnbyggerHarSykdomSkadeLyte();
    await user.click(screen.getByRole('button', { name: /Bekreft/ }));
    expect(await screen.findByText('Du må svare på om innbygger har nedsatt arbeidsevne')).toBeVisible();
  });

  it('Skal vise feilmelding dersom felt for om arbeidsevnen er nedsatt med minst 50% ikke er besvart', async () => {
    render(<Sykdomsvurdering grunnlag={grunnlag} readOnly={false} behandlingVersjon={0} tilknyttedeDokumenter={[]} />);
    await velgAtInnbyggerHarSykdomSkadeLyte();
    const button = screen.getByRole('button', { name: /Bekreft/ });
    await user.click(button);

    expect(await screen.findByText('Du må svare på om arbeidsevnen er nedsatt med minst 50%')).toBeVisible();
  });

  it('Skal vise feilmelding dersom felt for hvilket år arbeisevnen ble nedsatt ikke er besvart', async () => {
    render(<Sykdomsvurdering grunnlag={grunnlag} readOnly={false} behandlingVersjon={0} tilknyttedeDokumenter={[]} />);
    await velgAtInnbyggerHarSykdomSkadeLyte();
    await velgJaIGruppe(screen.getByRole('group', { name: 'Har innbygger nedsatt arbeidsevne?' }));
    await velgJaIGruppe(screen.getByRole('group', { name: 'Er arbeidsevnen nedsatt med minst 50%?' }));
    await velgJaIGruppe(
      screen.getByRole('group', {
        name: 'Er sykdom, skade eller lyte vesentlig medvirkende til at arbeidsevnen er nedsatt?',
      })
    );
    const button = screen.getByRole('button', { name: /Bekreft/ });
    await user.click(button);

    expect(await screen.findByText('Du må sette en dato for når arbeidsevnen ble nedsatt')).toBeVisible();
  });

  const velgAtInnbyggerHarSykdomSkadeLyte = async () => {
    const jaValg = within(screen.getByRole('group', { name: 'Har innbygger sykdom, skade eller lyte?' })).getByRole(
      'radio',
      {
        name: 'Ja',
      }
    );
    await user.click(jaValg);
  };

  const velgAtInnbyggerIkkeHarSykdomSkadeEllerLyte = async () => {
    const neiValg = within(screen.getByRole('group', { name: 'Har innbygger sykdom, skade eller lyte?' })).getByRole(
      'radio',
      {
        name: 'Nei',
      }
    );
    await user.click(neiValg);
  };

  const velgJaIGruppe = async (gruppe: HTMLElement): Promise<void> =>
    await user.click(within(gruppe).getByRole('radio', { name: 'Ja' }));

  const velgNeiIGruppe = async (gruppe: HTMLElement): Promise<void> =>
    await user.click(within(gruppe).getByRole('radio', { name: 'Nei' }));
});
