import { describe, expect, it } from 'vitest';
import { render, screen } from 'lib/test/CustomRender';
import { userEvent } from '@testing-library/user-event';
import { SykdomsvurderingBrevGrunnlag } from 'lib/types/types';
import { SykdomsvurderingBrev } from 'components/behandlinger/sykdom/sykdomsvurderingbrev/SykdomsvurderingBrev';

const user = userEvent.setup();
const grunnlag: SykdomsvurderingBrevGrunnlag = {
  vurdering: undefined,
  kanSaksbehandle: true,
};

describe('felt for begrunnelse', () => {
  it('Skal ha et begrunnelsefelt', () => {
    render(<SykdomsvurderingBrev grunnlag={grunnlag} readOnly={false} behandlingVersjon={0} />);
    const textbox = screen.getByRole('textbox', { name: 'Innhold til vedtaksbrevet' });
    expect(textbox).toBeVisible();
  });

  it('Skal vise feilmelding dersom begrunnelse felt ikke har blitt besvart', async () => {
    render(<SykdomsvurderingBrev grunnlag={grunnlag} readOnly={false} behandlingVersjon={0} />);
    const button = screen.getByRole('button', { name: 'Bekreft' });
    await user.click(button);

    expect(await screen.findByText('Du må legge til innhold for vedtaksbrevet')).toBeVisible();
  });
});
