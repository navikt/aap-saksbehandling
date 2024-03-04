import { render, screen } from '@testing-library/react';
import { FastsettBeregning } from 'components/behandlinger/grunnlag/fastsettberegning/FastsettBeregning';
import { SykdomsGrunnlag } from 'lib/types/types';

const sykdomsgrunnlag: SykdomsGrunnlag = {
  opplysninger: { innhentedeYrkesskader: [], oppgittYrkesskadeISøknad: false },
  skalVurdereYrkesskade: false,
};

describe('Fastsett beregning', () => {
  it('Skal ha heading', () => {
    render(<FastsettBeregning behandlingsReferanse={'123'} sykdomsgrunnlag={sykdomsgrunnlag} />);
    const heading = screen.getByText('Fastsett beregning');
    expect(heading).toBeVisible();
  });
});
