import { describe, expect, test } from 'vitest';
import { statistikkQueryparams } from '../../../aap-produksjonsstyring/lib/utils/request';

describe('statistikkQueryParams', () => {
  test('tomt', () => {
    const url = statistikkQueryparams({ behandlingstyper: [] });
    expect(url).to.equal('');
  });
  test('behandlingstyper', () => {
    const url = statistikkQueryparams({
      behandlingstyper: ['Førstegangsbehandling', 'Revurdering', 'Tilbakekreving', 'Klage'],
    });
    expect(url).to.equal(
      'behandlingstyper=F%C3%B8rstegangsbehandling&behandlingstyper=Revurdering&behandlingstyper=Tilbakekreving&behandlingstyper=Klage'
    );
  });
  test('behandlingstyper og antallDager', () => {
    const url = statistikkQueryparams({
      behandlingstyper: ['Revurdering', 'Klage'],
      antallDager: 10,
    });
    expect(url).to.equal('behandlingstyper=Revurdering&behandlingstyper=Klage&antallDager=10');
  });
  test('antallBøtter, bøttestørrelse, enhet og behandlingstype', () => {
    const url = statistikkQueryparams({
      behandlingstyper: ['Klage'],
      antallBøtter: 20,
      bøtteStørrelse: 1,
      enhet: 'UKE',
    });
    expect(url).to.equal('behandlingstyper=Klage&antallB%C3%B8tter=20&b%C3%B8tteSt%C3%B8rrelse=1&enhet=UKE');
  });
});
