import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { VilkårsKort } from './VilkårsKort';

describe('VilkårsKort', () => {
  it('skal vise overskrift', () => {
    render(
      <VilkårsKort heading={'Dette er en overskrift'}>
        <span>Dette er innhold</span>
      </VilkårsKort>
    );
    expect(screen.getByText('Dette er en overskrift')).toBeVisible();
  });

  it('skal vise innhold', async () => {
    render(
      <VilkårsKort heading={'Dette er en overskrift'}>
        <span>Dette er innhold</span>
      </VilkårsKort>
    );

    expect(screen.getByText('Dette er innhold')).toBeVisible();
  });
});
