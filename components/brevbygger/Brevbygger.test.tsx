import { render, screen } from '@testing-library/react';
import { Brevbygger } from 'components/brevbygger/Brevbygger';
import { DelAvBrev, PortableTextMedRef } from 'components/brevmalvelger/BrevmalVelger';

const brevMedInnhold: DelAvBrev[] = [
  {
    type: 'standardtekst',
    brukEditor: true,
    id: '4d20d7e6-f9ec-46c6-9979-9cb241ca2811',
    hjelpetekst: [
      {
        style: 'normal',
        _key: 'c054c74783bf',
        markDefs: [],
        children: [
          {
            _type: 'span',
            marks: [],
            text: 'Hva var problemstillingen som skulle vurderes i denne saken? ',
            _key: 'b5df4d3b5cf0',
          },
        ],
        _type: 'contentUtenVariabler',
      },
    ],
  },
];
const portableTextMedRef: PortableTextMedRef[] = [
  {
    innhold: [
      {
        markDefs: [],
        children: [
          {
            _type: 'span',
            marks: [],
            text: 'Hva det gjelder: Om du har rett til arbeidsavklaringspenger (AAP).',
            _key: 'be03a2705f9a',
          },
        ],
        _type: 'content',
        style: 'normal',
        _key: '3e581996e80e',
      },
    ],
    ref: '4d20d7e6-f9ec-46c6-9979-9cb241ca2811',
  },
];

describe('Brevbygger', () => {
  it('Skal ha overskrift Vedtak', () => {
    render(<Brevbygger brevMedInnhold={[]} portableTextMedRef={[]} tittel={'Brevbygger'} />);
    const heading = screen.getByRole('heading', { level: 2, name: 'Vedtak' });
    expect(heading).toBeVisible();
  });

  it('Skal vise knapp for forhåndsvisning av pdf', () => {
    render(<Brevbygger brevMedInnhold={[]} portableTextMedRef={[]} tittel={'Brevbygger'} />);
    const button = screen.getByRole('button', { name: 'Forhåndsvis pdf' });
    expect(button).toBeVisible();
  });

  it('Skal ha tittel på brev', () => {
    render(<Brevbygger brevMedInnhold={[]} portableTextMedRef={[]} tittel={'Brevbygger'} />);
    const heading = screen.getByRole('heading', { level: 1, name: 'Brevbygger' });
    expect(heading).toBeVisible();
  });

  it('Skal vise tekst i tiptap-editor', () => {
    render(
      <Brevbygger brevMedInnhold={brevMedInnhold} portableTextMedRef={portableTextMedRef} tittel={'Brevbygger'} />
    );
    const text = screen.getByText('Hva det gjelder: Om du har rett til arbeidsavklaringspenger (AAP).');
    expect(text).toBeVisible();
  });

  it('Skal vise skrivetips', () => {
    render(
      <Brevbygger brevMedInnhold={brevMedInnhold} portableTextMedRef={portableTextMedRef} tittel={'Brevbygger'} />
    );
    const button = screen.getByRole('button', { name: 'Få tips til skrivingen her' });
    expect(button).toBeVisible();
  });
});
