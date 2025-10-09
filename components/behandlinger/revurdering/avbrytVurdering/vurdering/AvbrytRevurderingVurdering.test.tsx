import { describe, expect, it } from 'vitest';
import { userEvent } from '@testing-library/user-event';
import { AvbrytRevurderingVurdering } from 'components/behandlinger/revurdering/avbrytVurdering/vurdering/AvbrytRevurderingVurdering';
import { render, screen } from 'lib/test/CustomRender';

const user = userEvent.setup();

describe('Avbryt revurdering', () => {
  it('har en overskrift', () => {
    render(
      <AvbrytRevurderingVurdering
        grunnlag={{ vurdering: { begrunnelse: '' } }}
        readOnly={false}
        behandlingVersjon={1}
      />
    );
    expect(screen.getByRole('heading', { name: 'Avbryt revurdering', level: 3 })).toBeVisible();
  });

  it('har et felt for å begrunne hvorfor revurdering skal avbrytes', () => {
    render(
      <AvbrytRevurderingVurdering
        grunnlag={{ vurdering: { begrunnelse: '' } }}
        readOnly={false}
        behandlingVersjon={1}
      />
    );
    expect(screen.getByRole('textbox', { name: 'Begrunnelse (obligatorisk)' })).toBeVisible();
  });

  it('viser en feilmelding dersom man forsøker å bekrefte uten å ha skrevet en begrunnelse', async () => {
    render(
      <AvbrytRevurderingVurdering
        grunnlag={{ vurdering: { begrunnelse: '' } }}
        readOnly={false}
        behandlingVersjon={1}
      />
    );
    await user.click(screen.getByRole('button', { name: 'Bekreft' }));
    expect(await screen.findByText('Du må begrunne hvorfor revurdering avbrytes')).toBeVisible();
  });
});
