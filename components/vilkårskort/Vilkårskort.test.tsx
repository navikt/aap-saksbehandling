import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { VilkRskort } from 'components/vilkårskort/Vilkårskort';

describe('VilkRskort', () => {
  it('skal vise overskrift', () => {
    render(
      <VilkRskort heading={'Dette er en overskrift'} steg={'UDEFINERT'}>
        <span>Dette er innhold</span>
      </VilkRskort>
    );
    expect(screen.getByText('Dette er en overskrift')).toBeVisible();
  });

  it('skal vise innhold', async () => {
    render(
      <VilkRskort heading={'Dette er en overskrift'} steg={'UDEFINERT'}>
        <span>Dette er innhold</span>
      </VilkRskort>
    );

    expect(screen.getByText('Dette er innhold')).toBeVisible();
  });
});
