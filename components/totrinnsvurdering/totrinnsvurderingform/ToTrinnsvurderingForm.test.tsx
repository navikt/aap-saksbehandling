import { render, screen } from '@testing-library/react';
import { Behovstype } from 'lib/utils/form';
import { TotrinnsvurderingForm } from 'components/totrinnsvurdering/totrinnsvurderingform/TotrinnsvurderingForm';
import { FatteVedtakGrunnlag } from 'lib/types/types';
import userEvent from '@testing-library/user-event';

const grunnlag: FatteVedtakGrunnlag = {
  vurderinger: [
    {
      definisjon: Behovstype.AVKLAR_SYKDOM_KODE,
    },
  ],
  historikk: [],
};

const link = `/sak/123/456`;

describe('totrinnsvurderingform', () => {
  const user = userEvent.setup();

  it('skal ha en overskrift som er en lenke til vilkårsvurderingen', () => {
    render(
      <TotrinnsvurderingForm
        grunnlag={grunnlag}
        erKvalitetssikring={false}
        link={link}
        readOnly={false}
        behandlingsReferanse={'456'}
        behandlingVersjon={0}
      />
    );

    const overskriftLenke = screen.getByRole('link', { name: /§ 11-5 avklar sykdom/i });
    expect(overskriftLenke).toBeVisible();
    expect(overskriftLenke).toHaveAttribute('href', `${link}/SYKDOM#AVKLAR_SYKDOM`);
  });

  it('skal ha en radio group hvor beslutter kan godkjenne eller avslå vurderingen til saksbehandler/veileder', () => {
    render(
      <TotrinnsvurderingForm
        grunnlag={grunnlag}
        erKvalitetssikring={false}
        link={link}
        readOnly={false}
        behandlingsReferanse={'456'}
        behandlingVersjon={0}
      />
    );

    const godkjennValg = screen.getByRole('radio', { name: /godkjenn/i });
    expect(godkjennValg).toBeVisible();

    const vurderPåNyttValg = screen.getByRole('radio', { name: /vurdèr på nytt/i });
    expect(vurderPåNyttValg).toBeVisible();
  });

  it('skal ha en knapp for å sende inn totrinnsvurderingene', () => {
    render(
      <TotrinnsvurderingForm
        grunnlag={grunnlag}
        erKvalitetssikring={false}
        link={link}
        readOnly={false}
        behandlingsReferanse={'456'}
        behandlingVersjon={0}
      />
    );

    const knapp = screen.getByRole('button', { name: /send inn/i });
    expect(knapp).toBeVisible();
  });

  it('skal dukke opp felt for begrunnelse dersom vurderingen har blitt avslått', async () => {
    render(
      <TotrinnsvurderingForm
        grunnlag={grunnlag}
        erKvalitetssikring={false}
        link={link}
        readOnly={false}
        behandlingsReferanse={'456'}
        behandlingVersjon={0}
      />
    );

    const vurderPåNyttValg = screen.getByRole('radio', { name: /vurdèr på nytt/i });
    await user.click(vurderPåNyttValg);

    const begrunnelseFelt = await screen.getByRole('textbox', { name: /begrunnelse/i });
    expect(begrunnelseFelt).toBeVisible();
  });

  it('skal dukke opp felt for å velge grunner for avslag dersom vurderingen har blitt avslått', async () => {
    render(
      <TotrinnsvurderingForm
        grunnlag={grunnlag}
        erKvalitetssikring={false}
        link={link}
        readOnly={false}
        behandlingsReferanse={'456'}
        behandlingVersjon={0}
      />
    );

    const vurderPåNyttValg = screen.getByRole('radio', { name: /vurdèr på nytt/i });
    await user.click(vurderPåNyttValg);

    const mangelfullBegrunnelse = screen.getByRole('checkbox', { name: /mangelfull begrunnelse/i });
    const manglendeUtredning = screen.getByRole('checkbox', { name: /manglende utredning/i });
    const feilLovanvendelse = screen.getByRole('checkbox', { name: /feil lovanvendelse/i });
    const annet = screen.getByRole('checkbox', {
      name: /annet/i,
    });

    expect(mangelfullBegrunnelse).toBeVisible();
    expect(manglendeUtredning).toBeVisible();
    expect(feilLovanvendelse).toBeVisible();
    expect(annet).toBeVisible();
  });

  it('skal ha riktige vlag i feltet for å velge grunner', async () => {
    render(
      <TotrinnsvurderingForm
        grunnlag={grunnlag}
        erKvalitetssikring={false}
        link={link}
        readOnly={false}
        behandlingsReferanse={'456'}
        behandlingVersjon={0}
      />
    );

    const vurderPåNyttValg = screen.getByRole('radio', { name: /vurdèr på nytt/i });
    await user.click(vurderPåNyttValg);

    const grunnerFelt = screen.getByRole('group', { name: /velg grunn/i });
    expect(grunnerFelt).toBeVisible();
  });

  it('skal dukke opp feilmelding hvis begrunnelse ikke har blitt besvart ved innsending', async () => {
    render(
      <TotrinnsvurderingForm
        grunnlag={grunnlag}
        erKvalitetssikring={false}
        link={link}
        readOnly={false}
        behandlingsReferanse={'456'}
        behandlingVersjon={0}
      />
    );

    const vurderPåNyttValg = screen.getByRole('radio', { name: /vurdèr på nytt/i });
    await user.click(vurderPåNyttValg);

    const knapp = screen.getByRole('button', { name: /send inn/i });
    await user.click(knapp);

    const errorMessage = screen.getByText('Du må gi en begrunnelse');
    expect(errorMessage).toBeVisible();
  });

  it('skal dukke opp feilmelding hvis ingen grunn har blitt valgt ved innsending', async () => {
    render(
      <TotrinnsvurderingForm
        grunnlag={grunnlag}
        erKvalitetssikring={false}
        link={link}
        readOnly={false}
        behandlingsReferanse={'456'}
        behandlingVersjon={0}
      />
    );

    const vurderPåNyttValg = screen.getByRole('radio', { name: /vurdèr på nytt/i });
    await user.click(vurderPåNyttValg);

    const knapp = screen.getByRole('button', { name: /send inn/i });
    await user.click(knapp);

    const errorMessage = await screen.getByText('Du må oppgi en grunn');
    expect(errorMessage).toBeVisible();
  });

  it('skal dukke opp et fritekst felt for å skrive inn en grunn dersom ANNET er valgt', async () => {
    render(
      <TotrinnsvurderingForm
        grunnlag={grunnlag}
        erKvalitetssikring={false}
        link={link}
        readOnly={false}
        behandlingsReferanse={'456'}
        behandlingVersjon={0}
      />
    );

    const vurderPåNyttValg = screen.getByRole('radio', { name: /vurdèr på nytt/i });
    await user.click(vurderPåNyttValg);

    const fritekstFelt = await screen.queryByRole('textbox', { name: /beskriv returårsak/i });
    expect(fritekstFelt).not.toBeInTheDocument();

    const annetValg = screen.getByRole('checkbox', { name: /annet/i });
    await user.click(annetValg);

    const fritekstFeltEtterAnnetErValgt = await screen.queryByRole('textbox', { name: /beskriv returårsak/i });
    expect(fritekstFeltEtterAnnetErValgt).toBeVisible();
  });

  it('skal dukke opp error på fritekst felt for å skrive inn en grunn dersom ANNET er valgt og det ikke er besvart', async () => {
    render(
      <TotrinnsvurderingForm
        grunnlag={grunnlag}
        erKvalitetssikring={false}
        link={link}
        readOnly={false}
        behandlingsReferanse={'456'}
        behandlingVersjon={0}
      />
    );

    const vurderPåNyttValg = screen.getByRole('radio', { name: /vurdèr på nytt/i });
    await user.click(vurderPåNyttValg);

    const fritekstFelt = await screen.queryByRole('textbox', { name: /beskriv returårsak/i });
    expect(fritekstFelt).not.toBeInTheDocument();

    const annetValg = screen.getByRole('checkbox', { name: /annet/i });
    await user.click(annetValg);

    const fritekstFeltEtterAnnetErValgt = await screen.queryByRole('textbox', { name: /beskriv returårsak/i });
    expect(fritekstFeltEtterAnnetErValgt).toBeVisible();

    const knapp = screen.getByRole('button', { name: /send inn/i });
    await user.click(knapp);

    const errorMessage = await screen.getByText('Du må skrive en grunn');
    expect(errorMessage).toBeVisible();
  });
});
