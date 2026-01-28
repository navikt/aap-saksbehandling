import { describe, expect, it } from 'vitest';
import { beregnTidligsteReduksjonsdato, validerDatoErInnenforOpphold } from 'lib/utils/institusjonsopphold';
import { Dato } from 'lib/types/Dato';

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
