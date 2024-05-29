import { EndreAktivitetForm } from 'components/aktivitethistorikk/EndreAktivitetForm';
import { render, screen } from '@testing-library/react';

describe('EndreAktivitetForm', () => {
  beforeEach(() => {
    render(<EndreAktivitetForm />);
  });
  it('skal ha feltet rimeligGrunn', () => {
    const radio = screen.getByRole('group', { name: /Er det rimelig grunn til fraværet\?/i });
    expect(radio).toBeVisible();
  });
  it('skal ha feltet begrunnelse', () => {
    const textbox = screen.getByRole('textbox', {
      name: /Begrunnelse/i,
    });

    expect(textbox).toBeVisible();
  });
});
