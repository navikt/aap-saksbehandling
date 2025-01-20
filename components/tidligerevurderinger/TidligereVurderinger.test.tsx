import { formaterDatoForVisning } from '@navikt/aap-felles-utils-client';
import { render, screen } from '@testing-library/react';
import {
  HistoriskVurdering,
  TidligereVurderinger,
  Vurdering,
} from 'components/tidligerevurderinger/TidligereVurderinger';

import { describe, expect, test } from 'vitest';

describe('Tidligere vurderinger', () => {
  test('har en overskrift', () => {
    render(<TidligereVurderinger />);
    expect(screen.getByRole('heading', { name: 'Tidligere vurderinger', level: 3 })).toBeVisible();
  });
});

describe('Tidligere vurdering', () => {
  const vurdering: HistoriskVurdering = {
    id: '1234',
    vurdertAv: 'XSAKSBEH',
    status: 'oppfylt',
    vedtaksdato: '2024-11-28',
  };
  test('overskrift består av om vilkår er oppfylt, hvem som har saksbehandlet og vedtaksdato', () => {
    render(<Vurdering vurdering={vurdering} />);
    expect(screen.getByText('Vilkår oppfylt')).toBeVisible();
    expect(screen.getByText(/(XSAKSBEH)/)).toBeVisible();

    const exp = new RegExp(formaterDatoForVisning(vurdering.vedtaksdato));

    expect(screen.getByText(exp)).toBeVisible();
  });
});
