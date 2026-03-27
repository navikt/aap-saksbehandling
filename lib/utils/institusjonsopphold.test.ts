import { describe, expect, it } from 'vitest';

import { Dato } from 'lib/types/Dato';
import { HelseInstiusjonVurdering } from 'lib/types/types';
import {
  erNyttOppholdInnenfor3MaanederEtterSistOpphold,
  erReduksjonUtIFraVurdering,
  lagReduksjonBeskrivelseNyttOpphold,
  validerDatoErInnenforOppholdIkkeReduksjon,
  validerDatoErInnenforOppholdReduksjon,
  validerErIKronologiskRekkeFølge,
} from 'lib/utils/institusjonopphold';

describe('validerDatoErInnenforOppholdReduksjon', () => {
  const oppholdFra = new Dato('2025-01-01').formaterForFrontend();
  const avsluttetDato = new Dato('2025-08-01').formaterForFrontend();

  it('skal vise en feilmelding dersom reduksjonsdato er før oppholdFra dato', () => {
    const inputValue = new Dato('2024-12-31').formaterForFrontend();
    const value = validerDatoErInnenforOppholdReduksjon(inputValue, oppholdFra, avsluttetDato);
    expect(value).toBe('Dato kan ikke være før innleggelsesdato: 01.01.2025');
  });

  it('skal vise en feilmelding dersom reduksjonsdato er etter oppholdTil dato', () => {
    const inputValue = new Dato('2025-10-01').formaterForFrontend();
    const value = validerDatoErInnenforOppholdReduksjon(inputValue, oppholdFra, avsluttetDato);
    expect(value).toBe('Dato kan ikke være etter oppholdets sluttdato: 01.08.2025');
  });

  it('skal returnere true dersom reduksjonsdato er innenfor perioden', () => {
    const inputValue = new Dato('2025-06-01').formaterForFrontend();
    const value = validerDatoErInnenforOppholdReduksjon(inputValue, oppholdFra, avsluttetDato);
    expect(value).toBeTruthy();
  });
});

describe('validerDatoErInnenforOppholdIkkeReduksjon', () => {
  const oppholdFra = new Dato('2025-01-01').formaterForFrontend();
  const avsluttetDato = new Dato('2025-08-01').formaterForFrontend();

  it('skal vise en feilmelding dersom reduksjonsdato er før oppholdFra dato', () => {
    const inputValue = new Dato('2024-12-31').formaterForFrontend();
    const value = validerDatoErInnenforOppholdIkkeReduksjon(inputValue, oppholdFra, avsluttetDato);
    expect(value).toBe('Dato kan ikke være før innleggelsesdato: 01.01.2025');
  });

  it('skal vise en feilmelding dersom dato er to dager etter oppholdets slutt ', () => {
    const inputValue = new Dato('2025-08-03').formaterForFrontend();
    const value = validerDatoErInnenforOppholdIkkeReduksjon(inputValue, oppholdFra, avsluttetDato);
    expect(value).toBe('Dato kan ikke være senere enn dagen etter oppholdets sluttdato: 02.08.2025');
  });

  it('skal ikke vise feilmelding dersom dato er dagen etter oppholdets slutt ', () => {
    const inputValue = new Dato('2025-08-02').formaterForFrontend();
    const value = validerDatoErInnenforOppholdIkkeReduksjon(inputValue, oppholdFra, avsluttetDato);
    expect(value).toBeTruthy();
  });

  it('skal vise en feilmelding dersom reduksjonsdato er etter oppholdTil dato', () => {
    const inputValue = new Dato('2025-10-01').formaterForFrontend();
    const value = validerDatoErInnenforOppholdIkkeReduksjon(inputValue, oppholdFra, avsluttetDato);
    expect(value).toBe('Dato kan ikke være senere enn dagen etter oppholdets sluttdato: 02.08.2025');
  });

  it('skal returnere true dersom reduksjonsdato er innenfor perioden', () => {
    const inputValue = new Dato('2025-06-01').formaterForFrontend();
    const value = validerDatoErInnenforOppholdIkkeReduksjon(inputValue, oppholdFra, avsluttetDato);
    expect(value).toBeTruthy();
  });
});

describe('validerErIKronologiskRekkefølge', () => {
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

describe('lagReduksjonBeskrivelseNyttOpphold', () => {
  it('bruker standard regel når forrigeOppholdSisteVurderingVarRedukjson er undefined', () => {
    const resultat = lagReduksjonBeskrivelseNyttOpphold('01.07.2026');

    expect(resultat).toBe(
      'Innleggelsesmåned: juli 2026. Reduksjonen bør som regel starte 1. august 2026 ved reduksjon i forrige opphold, ellers 1. november 2026. Det finnes likevel unntak.'
    );
  });
});
