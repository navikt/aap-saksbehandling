import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { Yrkesskade } from 'components/behandlinger/sykdom/yrkesskade/Yrkesskade';
import { YrkesskadeVurderingGrunnlag } from 'lib/types/types';
import { userEvent } from '@testing-library/user-event';

const grunnlag: YrkesskadeVurderingGrunnlag = {
  opplysninger: {
    innhentedeYrkesskader: [
      {
        ref: 'YRK',
        kilde: 'Yrkesskaderegisteret',
        skadedato: '2024-10-10',
      },
    ],
    oppgittYrkesskadeISøknad: false,
  },
};

beforeEach(() => {
  render(<Yrkesskade grunnlag={grunnlag} behandlingVersjon={1} readOnly={false} behandlingsReferanse={'123'} />);
});

const user = userEvent.setup();

describe('Generelt', () => {
  it('skal har korrekt heading', () => {
    const heading = screen.getByRole('heading', { name: 'Yrkesskade §§ 11-22 1.ledd' });
    expect(heading).toBeVisible();
  });

  it('skal ha en tekst som viser hvordan vilkåret skal vurderes', () => {
    const veileding = screen.getByText('Slik vurderes vilkåret');
    expect(veileding).toBeVisible();
  });
});

describe('felt for begrunnelse', () => {
  it('skal være synlig', () => {
    const begrunnelseFelt = screen.getByRole('textbox', {
      name: 'Vurder om yrkesskade er medvirkende årsak til nedsatt arbeidsevne',
    });
    expect(begrunnelseFelt).toBeVisible();
  });

  it('skal vise en feilmelding dersom det ikke er besvart', async () => {
    await velgBekreft();
    const feilmelding = screen.getByText('Du må begrunne');
    expect(feilmelding).toBeVisible();
  });
});

describe('Felt for om det finnes årsakssammenheng mellom yrkesskade og nedsatt arbeidsevne', () => {
  it('skal være synlig', () => {
    const felt = screen.getByRole('group', {
      name: 'Finnes det en årsakssammenheng mellom yrkesskade og nedsatt arbeidsevne?',
    });
    expect(felt).toBeVisible();
  });

  it('skal vise en feilmelding dersom det ikke er besvart', async () => {
    await velgBekreft();
    const feilmelding = screen.getByText('Du må svare på om det finnes en årsakssammenheng');
    expect(feilmelding).toBeVisible();
  });
});

describe('Tabell for å tilknytte yrkesskader til vurderingen', () => {
  it('skal være synlig dersom det finnes en årsakssammenheng', async () => {
    await velgJaPåÅrsakssammenheng();
    const tabell = screen.getByText(
      'Tilknytt eventuelle yrkesskader som er helt eller delvis årsak til den nedsatte arbeidsevnen.'
    );
    expect(tabell).toBeVisible();
  });

  it('skal være mulig å velge en yrkesskade', async () => {
    await velgJaPåÅrsakssammenheng();

    const checkbox = screen.getByRole('checkbox', { name: 'Tilknytt yrkesskade til vurdering' });
    expect(checkbox).not.toBeChecked();

    await user.click(checkbox);

    expect(screen.getByRole('checkbox', { name: 'Tilknytt yrkesskade til vurdering' })).toBeChecked();
  });
});

describe('Felt for å si hvor stor andel skyldes yrkesskadene', () => {
  it('skal være synlig dersom det finnes en årsakssammenheng', async () => {
    await velgJaPåÅrsakssammenheng();
    const felt = screen.getByRole('spinbutton', {
      name: 'Hvor stor andel totalt av nedsatt arbeidsevne skyldes yrkesskadene?',
    });

    expect(felt).toBeVisible();
  });

  it('skal vise feilmelding hvis det ikke har blitt besvart', async () => {
    await velgJaPåÅrsakssammenheng();
    await velgBekreft();

    const feilmelding = screen.getByText(
      'Du må svare på hvor stor andel av den nedsatte arbeidsevnen skyldes yrkesskadene'
    );
    expect(feilmelding).toBeVisible();
  });
});

async function velgBekreft() {
  await user.click(screen.getByRole('button', { name: 'Bekreft' }));
}

async function velgJaPåÅrsakssammenheng() {
  const JaValg = within(
    screen.getByRole('group', {
      name: 'Finnes det en årsakssammenheng mellom yrkesskade og nedsatt arbeidsevne?',
    })
  ).getByRole('radio', { name: 'Ja' });

  await user.click(JaValg);
}
