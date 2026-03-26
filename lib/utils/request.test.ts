import { describe, expect, test } from 'vitest';
import { mineOppgaverQueryParams } from './request';
import {
  PathsMineOppgaverGetParametersQuerySortby,
  PathsMineOppgaverGetParametersQuerySortorder,
} from '@navikt/aap-oppgave-typescript-types';

describe('mineOppgaverQueryParams', () => {
  test('tomt', () => {
    const url = mineOppgaverQueryParams({});
    expect(url).to.equal('');
  });
  test('kunpåvent, sortby og sortorder', () => {
    const url = mineOppgaverQueryParams({
      kunPaaVent: true,
      sortby: PathsMineOppgaverGetParametersQuerySortby.PERSONIDENT,
      sortorder: PathsMineOppgaverGetParametersQuerySortorder.ASC,
    });
    expect(url).to.equal('kunPaaVent=true&sortby=PERSONIDENT&sortorder=ASC');
  });
});
