import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Kort } from './Kort';

describe('Kort', () => {
  test('tegner innhold som blir sendt inn', () => {
    render(
      <Kort>
        <div>Enkelt innhold</div>
      </Kort>
    );
    expect(screen.getByText('Enkelt innhold')).toBeVisible();
  });
});
