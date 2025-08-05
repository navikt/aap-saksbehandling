import { describe, expect, it } from 'vitest';
import { render, screen, within } from 'lib/test/CustomRender';
import { userEvent } from '@testing-library/user-event';
import { SykdomsvurderingBrevGrunnlag } from 'lib/types/types';
import { SykdomsvurderingBrev } from 'components/behandlinger/sykdom/sykdomsvurderingbrev/SykdomsvurderingBrev';

const user = userEvent.setup();
const grunnlag: SykdomsvurderingBrevGrunnlag = {
  vurdering: undefined,
  historiskeVurderinger: [],
  kanSaksbehandle: true,
};

describe('sykdomsvurdering for brev', () => {
  it('Skal gi feilmelding dersom det ikke svares på om vurdering for brev er relevant', async () => {
    render(<SykdomsvurderingBrev grunnlag={grunnlag} readOnly={false} behandlingVersjon={0} />);
    const button = screen.getByRole('button', { name: 'Bekreft' });
    await user.click(button);

    expect(
      await screen.findByText(
        'Du må svare på om det er relevant å informere bruker om hva som er vurdert i sykdomssteget'
      )
    ).toBeVisible();
  });

  it('Skal ha et vurderingsfelt hvis det er valgt at dette er relevant for behandlingen', async () => {
    render(<SykdomsvurderingBrev grunnlag={grunnlag} readOnly={false} behandlingVersjon={0} />);
    await velgAtVurderingSkalLeggesTil();
    const textbox = screen.getByRole('textbox', { name: 'Innhold til vedtaksbrevet' });
    expect(textbox).toBeVisible();
  });

  it('Skal vise feilmelding dersom vurderingsfeltet ikke har blitt besvart', async () => {
    render(<SykdomsvurderingBrev grunnlag={grunnlag} readOnly={false} behandlingVersjon={0} />);
    await velgAtVurderingSkalLeggesTil();
    const button = screen.getByRole('button', { name: 'Bekreft' });
    await user.click(button);

    expect(await screen.findByText('Du må legge til innhold for vedtaksbrevet')).toBeVisible();
  });
});

const velgAtVurderingSkalLeggesTil = async () => {
  const jaValg = within(
    screen.getByRole('group', {
      name: 'Er det relevant å informere bruker om hva som er vurdert i sykdomssteget i denne behandlingen?',
    })
  ).getByRole('radio', {
    name: 'Ja',
  });
  await user.click(jaValg);
};
