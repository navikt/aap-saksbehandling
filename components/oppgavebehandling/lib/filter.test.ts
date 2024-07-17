import { describe, test, expect } from 'vitest';
import { Kø } from 'components/oppgavebehandling/KøContext';
import { byggFilterFraKø } from 'components/oppgavebehandling/lib/filter';

describe('filter utils', () => {
  const enKø: Kø = {
    id: 1,
    navn: 'min kø',
    beskrivelse: 'Beskrivelse av min kø',
    flervalgsfilter: [
      {
        navn: 'flervalgsfilter',
        valgteFilter: [{ value: 'verdi2', label: 'Verdi 2' }],
        alleFilter: [
          { value: 'verdi1', label: 'Verdi 1' },
          { value: 'verdi2', label: 'Verdi 2' },
          { value: 'verdi3', label: 'Verdi 3' },
        ],
      },
    ],
    sortering: {
      orderBy: 'opprettetTid',
      direction: 'ascending',
    },
  };

  test('kø har riktig navn', () => {
    const res = byggFilterFraKø('Nytt kønavn', 'Ny købeskrivelse', enKø);
    expect(res.tittel).toEqual('Nytt kønavn');
  });

  test('kø har riktig beskrivelse', () => {
    const res = byggFilterFraKø('kønavn', 'Ny købeskrivelse', enKø);
    expect(res.beskrivelse).toEqual('Ny købeskrivelse');
  });

  test('lagrer kun valgte filter for flervalgsfilter', () => {
    const res = byggFilterFraKø('Nytt kønavn', 'Ny købeskrivelse', enKø);
    expect(res.filter).not.toContain('verdi1');
    expect(res.filter).not.toContain('verdi3');
    expect(res.filter).toContain('verdi2');
  });

  test('filter-parameter bygges rett', () => {
    const res = byggFilterFraKø('Nytt kønavn', 'Ny købeskrivelse', enKø);
    expect(res.filter).toBeDefined();
    expect(res.filter).toEqual(
      '{"flervalgsfilter":[{"navn":"flervalgsfilter","valgteFilter":[{"value":"verdi2","label":"Verdi 2"}]}],"sortering":{"orderBy":"opprettetTid","direction":"ascending"}}'
    );
  });
});
