import { describe, expect, it } from 'vitest';
import { render, screen } from '../../../../../lib/test/CustomRender';
import { userEvent } from '@testing-library/user-event';
import { KansellerRevurderingVurdering } from './KansellerRevurderingVurdering';

const user = userEvent.setup();

describe('Kanseller revurdering', () => {
  it('har en overskrift', () => {
    render(<KansellerRevurderingVurdering grunnlag={{ vurdering: { begrunnelse: '', vurdertAv: '' } }} readOnly={false} behandlingVersjon={1} />);
    expect(screen.getByRole('heading', { name: 'Kanseller revurdering', level: 3 })).toBeVisible();
  });

  it('har et felt for å begrunne hvorfor revurdering skal kanselleres', () => {
    render(<KansellerRevurderingVurdering grunnlag={{ vurdering: { begrunnelse: '', vurdertAv: '' } }} readOnly={false} behandlingVersjon={1} />);
    expect(screen.getByRole('textbox', { name: 'Begrunnelse (obligatorisk)' })).toBeVisible();
  });

  it('viser en feilmelding dersom man forsøker å bekrefte uten å ha skrevet en begrunnelse', async () => {
    render(<KansellerRevurderingVurdering grunnlag={{ vurdering: { begrunnelse: '', vurdertAv: '' } }} readOnly={false} behandlingVersjon={1} />);
    await user.click(screen.getByRole('button', { name: 'Bekreft' }));
    expect(await screen.findByText('Du må begrunne hvorfor revurdering kanselleres')).toBeVisible();
  });
});
