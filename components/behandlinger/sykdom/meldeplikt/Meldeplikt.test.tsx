import { render, screen } from 'lib/test/setUpTests';
import { Meldeplikt } from 'components/behandlinger/sykdom/meldeplikt/Meldeplikt';

describe('Meldeplikt', () => {
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
});
