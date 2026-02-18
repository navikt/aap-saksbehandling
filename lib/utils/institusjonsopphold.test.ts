import { describe, expect, it } from 'vitest';

import { Dato } from 'lib/types/Dato';
import { HelseInstiusjonVurdering } from 'lib/types/types';
import {
  beregnReduksjonsdatoVedNyttOpphold,
  beregnTidligsteReduksjonsdato,
  erNyttOppholdInnenfor3MaanederEtterSistOpphold,
  erReduksjonUtIFraVurdering,
  lagReduksjonBeskrivelseNyttOpphold,
  validerDatoErInnenforOpphold,
  validerDatoForStartAvReduksjonVedNyttOpphold,
  validerErIKronologiskRekkeFølge,
} from 'lib/utils/institusjonopphold';

describe('beregnTidligsteReduksjonsdato', () => {
  it('Skal returnere 1. mai dersom vi sender inn 1. januar', () => {
    const januarDato = new Dato('2025-01-01').formaterForFrontend();
    const value = beregnTidligsteReduksjonsdato(januarDato);
    expect(value).toBe('01.05.2025');
  });

  it('Skal returnere 1. mai dersom vi sender inn hvilken som helst dag i januar', () => {
    const januarDato = new Dato('2025-01-10').formaterForFrontend();
    const value = beregnTidligsteReduksjonsdato(januarDato);
    expect(value).toBe('01.05.2025');
  });
});

describe('validerReduksjonsdatoInnenforOpphold', () => {
  const oppholdFra = new Dato('2025-01-01').formaterForFrontend();
  const avsluttetDato = new Dato('2025-08-01').formaterForFrontend();

  it('skal vise en feilmelding dersom reduksjonsdato er før oppholdFra dato', () => {
    const inputValue = new Dato('2024-12-31').formaterForFrontend();
    const value = validerDatoErInnenforOpphold(inputValue, oppholdFra, avsluttetDato);
    expect(value).toBe('Dato kan ikke være før innleggelsesdato: 01.01.2025');
  });

  it('skal vise en feilmelding dersom reduksjonsdato er etter oppholdTil dato', () => {
    const inputValue = new Dato('2025-10-01').formaterForFrontend();
    const value = validerDatoErInnenforOpphold(inputValue, oppholdFra, avsluttetDato);
    expect(value).toBe('Dato kan ikke være etter oppholdets sluttdato: 01.08.2025');
  });

  it('skal returnere true dersom reduksjonsdato er innenfor perioden', () => {
    const inputValue = new Dato('2025-06-01').formaterForFrontend();
    const value = validerDatoErInnenforOpphold(inputValue, oppholdFra, avsluttetDato);
    expect(value).toBeTruthy();
  });
});

describe('validerReduksjonsdatoInnenforOpphold', () => {
  const forrigevurderingFom = new Dato('2025-02-01').formaterForFrontend();

  it('skal vise en feilmelding dersom input value er tidligere enn forrige vurdering fom', () => {
    const inputValue = new Dato('2025-01-01').formaterForFrontend();
    const value = validerErIKronologiskRekkeFølge(inputValue, forrigevurderingFom);
    expect(value).toBe('Dato kan ikke være tidligere eller samme dato som forrige vurdering: 01.02.2025');
  });

  it('skal vise en feilmelding dersom input value er samme dato som forrige vurdering fom', () => {
    const inputValue = new Dato('2025-02-01').formaterForFrontend();
    const value = validerErIKronologiskRekkeFølge(inputValue, forrigevurderingFom);
    expect(value).toBe('Dato kan ikke være tidligere eller samme dato som forrige vurdering: 01.02.2025');
  });

  it('skal returnere true dersom input value er etter forrige vurdering fom', () => {
    const inputValue = new Dato('2025-06-01').formaterForFrontend();
    const value = validerErIKronologiskRekkeFølge(inputValue, forrigevurderingFom);
    expect(value).toBeTruthy();
  });
});

describe('erReduksjon', () => {
  const defaultVurdering: HelseInstiusjonVurdering = {
    begrunnelse: 'Hello Pello',
    faarFriKostOgLosji: false,
    oppholdId: '123',
    periode: {
      fom: '2025-01-01',
      tom: '2025-08-01',
    },
  };

  it('returnerer true når faarFriKostOgLosji er true og de andre er false', () => {
    expect(
      erReduksjonUtIFraVurdering({
        ...defaultVurdering,
        faarFriKostOgLosji: true,
        forsoergerEktefelle: false,
        harFasteUtgifter: false,
      })
    ).toBe(true);
  });

  it('returnerer false når faarFriKostOgLosji er false', () => {
    expect(
      erReduksjonUtIFraVurdering({
        ...defaultVurdering,
        faarFriKostOgLosji: false,
        forsoergerEktefelle: false,
        harFasteUtgifter: false,
      })
    ).toBe(false);
  });

  it('returnerer false når forsoergerEktefelle er true', () => {
    expect(
      erReduksjonUtIFraVurdering({
        ...defaultVurdering,
        faarFriKostOgLosji: true,
        forsoergerEktefelle: true,
        harFasteUtgifter: false,
      })
    ).toBe(false);
  });

  it('returnerer false når harFasteUtgifter er true', () => {
    expect(
      erReduksjonUtIFraVurdering({
        ...defaultVurdering,
        faarFriKostOgLosji: true,
        forsoergerEktefelle: false,
        harFasteUtgifter: true,
      })
    ).toBe(false);
  });
});

describe('beregnReduksjonsdatoVedNyttOpphold', () => {
  it('returnerer reduksjonsdato måneden etter nytt opphold når nytt opphold er innen 3 måneder', () => {
    const resultat = beregnReduksjonsdatoVedNyttOpphold('01.01.2025', '15.02.2025');

    // Nytt opphold i februar → reduksjon fra 01.03.2025
    expect(resultat).toBe('01.03.2025');
  });

  it('inkluderer nytt opphold som starter nøyaktig 3 måneder etter utskrivelse', () => {
    const resultat = beregnReduksjonsdatoVedNyttOpphold('01.01.2025', '01.04.2025');

    // April → reduksjon fra 01.05.2025
    expect(resultat).toBe('01.05.2025');
  });

  it('returnerer nyttOppholdFra dersom nytt opphold er etter 3 måneder', () => {
    const resultat = beregnReduksjonsdatoVedNyttOpphold('01.01.2025', '02.04.2025');

    expect(resultat).toBe('02.04.2025');
  });

  it('runder alltid til første dag i måneden etter nytt opphold', () => {
    const resultat = beregnReduksjonsdatoVedNyttOpphold('10.01.2025', '28.03.2025');

    // Mars → reduksjon fra 01.04.2025
    expect(resultat).toBe('01.04.2025');
  });

  it('håndterer nytt opphold i samme måned som utskrivelse', () => {
    const resultat = beregnReduksjonsdatoVedNyttOpphold('05.01.2025', '20.01.2025');

    // Januar → reduksjon fra 01.02.2025
    expect(resultat).toBe('01.02.2025');
  });
});

describe('erNyttOppholdInnenfor3MaanederEtterSistOpphold', () => {
  it('returnerer true når nytt opphold er innen 3 måneder etter utskrivelse', () => {
    const resultat = erNyttOppholdInnenfor3MaanederEtterSistOpphold('01.01.2025', '15.03.2025');

    expect(resultat).toBe(true);
  });

  it('returnerer true når nytt opphold starter nøyaktig 3 måneder etter utskrivelse', () => {
    const resultat = erNyttOppholdInnenfor3MaanederEtterSistOpphold('01.01.2025', '01.04.2025');

    expect(resultat).toBe(true);
  });

  it('returnerer false når nytt opphold starter etter 3 måneder', () => {
    const resultat = erNyttOppholdInnenfor3MaanederEtterSistOpphold('01.01.2025', '02.04.2025');

    expect(resultat).toBe(false);
  });

  it('returnerer true når nytt opphold er samme dag som utskrivelse', () => {
    const resultat = erNyttOppholdInnenfor3MaanederEtterSistOpphold('10.02.2025', '10.02.2025');

    expect(resultat).toBe(true);
  });

  it('håndterer månedsskifte korrekt', () => {
    const resultat = erNyttOppholdInnenfor3MaanederEtterSistOpphold('31.01.2025', '30.04.2025');

    expect(resultat).toBe(true);
  });
});

describe('validerDatoForStartAvReduksjonVedNyttOpphold', () => {
  it('returnerer feilmelding hvis dato er før tidligste reduksjonsdato (ikke videreført reduksjon)', () => {
    const resultat = validerDatoForStartAvReduksjonVedNyttOpphold('01.07.2026', '01.07.2026', '01.06.2026', false);

    expect(resultat).toBe('Tidligste dato for reduksjon er: 01.11.2026');
  });

  it('returnerer feilmelding hvis dato er før tidligste reduksjonsdato (videreført reduksjon)', () => {
    const resultat = validerDatoForStartAvReduksjonVedNyttOpphold('01.07.2026', '01.07.2026', '01.06.2026', true);

    expect(resultat).toBe('Tidligste dato for reduksjon er: 01.08.2026');
  });

  it('returnerer undefined hvis dato er lik tidligste reduksjonsdato', () => {
    const resultat = validerDatoForStartAvReduksjonVedNyttOpphold('01.11.2026', '01.07.2026', '01.06.2026', false);

    expect(resultat).toBeUndefined();
  });

  it('returnerer undefined hvis dato er etter tidligste reduksjonsdato', () => {
    const resultat = validerDatoForStartAvReduksjonVedNyttOpphold('01.12.2026', '01.07.2026', '01.06.2026', false);

    expect(resultat).toBeUndefined();
  });

  it('bruker standard regel når forrigeOppholdSisteVurderingVarRedukjson er undefined', () => {
    const resultat = validerDatoForStartAvReduksjonVedNyttOpphold('01.07.2026', '01.07.2026', '01.06.2026');

    expect(resultat).toBe('Tidligste dato for reduksjon er: 01.11.2026');
  });
});

describe('lagReduksjonBeskrivelseNyttOpphold', () => {
  it('bruker standard regel når forrigeOppholdSisteVurderingVarRedukjson er undefined', () => {
    const resultat = lagReduksjonBeskrivelseNyttOpphold('01.06.2026', '01.07.2026');

    expect(resultat).toBe('Innleggelsesmåned: juli 2026. Reduksjon kan tidligst starte: 1. november 2026');
  });

  it('bruker standard regel når forrigeOppholdSisteVurderingVarRedukjson er false', () => {
    const resultat = lagReduksjonBeskrivelseNyttOpphold('01.06.2026', '01.07.2026', false);

    expect(resultat).toBe('Innleggelsesmåned: juli 2026. Reduksjon kan tidligst starte: 1. november 2026');
  });

  it('bruker nytt opphold-regel når forrigeOppholdSisteVurderingVarRedukjson er true', () => {
    const resultat = lagReduksjonBeskrivelseNyttOpphold('01.06.2026', '01.07.2026', true);

    expect(resultat).toBe('Innleggelsesmåned: juli 2026. Reduksjon kan tidligst starte: 1. august 2026');
  });
});
