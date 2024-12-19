import { describe, expect, it, vitest } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Form } from 'components/form/Form';

describe('Form', () => {
  it('skal ha en knapp som har teksten bekreft dersom knapptekst ikke er definert ', () => {
    render(
      <Form steg={'AVKLAR_STUDENT'} onSubmit={() => vitest.fn()} isLoading={false} status={'DONE'}>
        <div>Innhold</div>
      </Form>
    );

    const button = screen.getByRole('button', { name: 'Bekreft' });
    expect(button).toBeVisible();
  });

  it('skal ha en knapp som har korrekt tekst dersom knapptekst  er definert ', () => {
    render(
      <Form
        steg={'AVKLAR_STUDENT'}
        onSubmit={() => vitest.fn()}
        isLoading={false}
        status={'DONE'}
        knappTekst={'Bekreft vurderingen'}
      >
        <div>Innhold</div>
      </Form>
    );

    const button = screen.getByRole('button', { name: 'Bekreft vurderingen' });
    expect(button).toBeVisible();
  });

  it('skal vise children', () => {
    render(
      <Form
        steg={'AVKLAR_STUDENT'}
        onSubmit={() => vitest.fn()}
        isLoading={false}
        status={'DONE'}
        knappTekst={'Bekreft vurderingen'}
      >
        <div>Innhold</div>
      </Form>
    );

    const innhold = screen.getByText('Innhold');
    expect(innhold).toBeVisible();
  });
});
