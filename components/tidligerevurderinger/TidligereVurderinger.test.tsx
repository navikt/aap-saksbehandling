import { formaterDatoForVisning } from '@navikt/aap-felles-utils-client';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  HistoriskVurdering,
  TidligereVurderinger,
  Vurdering,
} from 'components/tidligerevurderinger/TidligereVurderinger';
import { ReactNode } from 'react';

import { describe, expect, test } from 'vitest';

const testvurdering: HistoriskVurdering = {
  id: '1234',
  vurdertAv: 'XSAKSBEH',
  status: 'oppfylt',
  vedtaksdato: '2024-11-28',
  begrunnelse: 'En begrunnelse av hvorfor vilkåret er vurdert slik det er vurdert.',
};

const user = userEvent.setup();

describe('Tidligere vurderinger', () => {
  test('har en overskrift', () => {
    render(<TidligereVurderinger />);
    expect(screen.getByRole('heading', { name: 'Tidligere vurderinger', level: 3 })).toBeVisible();
  });
});

describe('Tidligere vurdering', () => {
  test('overskrift består av om vilkår er oppfylt, hvem som har saksbehandlet og vedtaksdato', () => {
    render(
      <TableWrapper>
        <Vurdering vurdering={testvurdering} />
      </TableWrapper>
    );
    expect(screen.getByText('Vilkår oppfylt')).toBeVisible();
    expect(screen.getByText(/(XSAKSBEH)/)).toBeVisible();

    const exp = new RegExp(formaterDatoForVisning(testvurdering.vedtaksdato));

    expect(screen.getByText(exp)).toBeVisible();
  });

  test('viser beskrivelse', async () => {
    render(
      <TableWrapper>
        <Vurdering vurdering={testvurdering} />
      </TableWrapper>
    );
    const visMerKnapp = screen.getByRole('button', { name: 'Vis mer' });
    await user.click(visMerKnapp);
    expect(screen.getByText(testvurdering.begrunnelse)).toBeVisible();
  });
});

// generisk wrapper for tester hvor vi kun rendrer en rad. Gjør at vi slipper warnings fra vitest om ugyldig struktur på tabell-rader
function TableWrapper({ children }: { children: ReactNode }) {
  return (
    <table>
      <tbody>{children}</tbody>
    </table>
  );
}
