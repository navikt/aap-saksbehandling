import { render, screen } from '@testing-library/react';
import { Meldeplikt } from 'components/behandlinger/sykdom/meldeplikt/Meldeplikt';
import userEvent from '@testing-library/user-event';

describe('Meldeplikt', () => {
  const user = userEvent.setup();

  it('Skal ha en overskrift', () => {
    render(<Meldeplikt behandlingsReferanse={'123'} />);
    const heading = screen.getByText('Unntak fra meldeplikt § 11-10');
    expect(heading).toBeVisible();
  });

  it('Skal ha et begrunnelse felt', () => {
    render(<Meldeplikt behandlingsReferanse={'123'} />);
    const textbox = screen.getByRole('textbox', {
      name: /vurder om det vil være unødig tyngende for søker å overholde meldeplikten/i,
    });
    expect(textbox).toBeVisible();
  });

  it('Skal ha et felt for om søker kan unntas fra meldeplikten', () => {
    render(<Meldeplikt behandlingsReferanse={'123'} />);
    const checkBoxGroup = screen.getByRole('group', { name: /det vurderes at søker kan unntas fra meldeplikten/i });
    expect(checkBoxGroup).toBeVisible();
  });

  it('Skal ha informasjonstekst om unntak fra meldeplikten', () => {
    render(<Meldeplikt behandlingsReferanse={'123'} />);
    expect(screen.getByText('Unntak fra meldeplikten skal kun vurderes dersom saksbehandler:')).toBeVisible();
    expect(
      screen.getByText('a) vurderer at det vil være unødig tyngende for søker å overholde meldeplikten')
    ).toBeVisible();
    expect(
      screen.getByText('b) er usikker på om det vil være unødig tyngende for søker å overholde meldeplikten')
    ).toBeVisible();
  });

  it('Skal vise felt for startdato og sluttdato dersom unntak fra meldeplikten er valgt', async () => {
    render(<Meldeplikt behandlingsReferanse={'123'} />);

    const unntakFraMeldeepliktenValg = screen.getByRole('checkbox', { name: /unntak fra meldeplikten/i });

    await user.click(unntakFraMeldeepliktenValg);

    expect(unntakFraMeldeepliktenValg).toBeChecked();

    const sluttDatoFelt = await screen.findByRole('textbox', { name: /sluttdato for fritak fra meldeplikt/i });
    const startDatoFelt = await screen.findByRole('textbox', { name: /startdato for fritak fra meldeplikt/i });

    expect(sluttDatoFelt).toBeVisible();
    expect(startDatoFelt).toBeVisible();
  });

  it('Skal ikke vise felt for startdato og sluttdato dersom unntak fra meldeplikten ikke er valgt', async () => {
    render(<Meldeplikt behandlingsReferanse={'123'} />);

    const unntakFraMeldeepliktenValg = screen.getByRole('checkbox', { name: /unntak fra meldeplikten/i });
    expect(unntakFraMeldeepliktenValg).not.toBeChecked();

    const sluttDatoFelt = await screen.queryByRole('textbox', { name: /sluttdato for fritak fra meldeplikt/i });
    const startDatoFelt = await screen.queryByRole('textbox', { name: /startdato for fritak fra meldeplikt/i });

    expect(sluttDatoFelt).not.toBeInTheDocument();
    expect(startDatoFelt).not.toBeInTheDocument();
  });
});
