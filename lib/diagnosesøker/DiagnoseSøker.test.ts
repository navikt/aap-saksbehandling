import { describe, it, expect } from 'vitest';
import { diagnoseSøker } from 'lib/diagnosesøker/DiagnoseSøker';

describe('diagnose søker', () => {
  it('skal returnere 50 elementer fra ICPC2 dersom det ikke er sendt inn et søk', () => {
    const resultat = diagnoseSøker('ICPC2', '');
    expect(resultat.length).toBe(50);
  });

  it('skal returnere 50 elementer fra ICD10 dersom det ikke er sendt inn et søk', () => {
    const resultat = diagnoseSøker('ICD10', '');
    expect(resultat.length).toBe(50);
  });

  it('skal returnere korrekt resultat når man søker på kode', () => {
    const resultat = diagnoseSøker('ICD10', 'u071');
    expect(resultat.length).toBe(1);

    const covid19 = resultat[0];
    expect(covid19.label).toBe('Covid-19 med påvist virus (U071)');
    expect(covid19.value).toBe('U071');
  });

  it('skal returnere et tomt array dersom det ikke finnes et treff', () => {
    const resultat = diagnoseSøker('ICD10', 'hello pello diagnosen');
    expect(resultat).toStrictEqual([]);
  });
});
