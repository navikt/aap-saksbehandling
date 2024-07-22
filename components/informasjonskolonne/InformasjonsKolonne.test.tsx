import { describe, it, expect } from 'vitest';
import { InformasjonsKolonne } from 'components/informasjonskolonne/InformasjonsKolonne';
import { render, screen } from '@testing-library/react';

describe('Informasjonskolonne', () => {
  it('skal ha overskrift "Vilkårsvurderinger"', () => {
    render(<InformasjonsKolonne stegSomSkalVises={['AVKLAR_STUDENT']} className={'nope'} />);
    expect(screen.getByRole('heading', { name: 'Vilkårsvurderinger', level: 2 })).toBeVisible();
  });

  it('skal ha lenke til steg som skal vises', () => {
    render(<InformasjonsKolonne stegSomSkalVises={['AVKLAR_STUDENT']} className={'nope'} />);
    expect(screen.getByRole('link', { name: 'Student § 11-14' })).toBeVisible();
  });

  it('skal ha en liste lenke med lenker', () => {
    render(<InformasjonsKolonne stegSomSkalVises={['AVKLAR_STUDENT', 'AVKLAR_SYKDOM']} className={'nope'} />);
    expect(screen.getAllByRole('link')).toHaveLength(2);
    expect(screen.getByRole('link', { name: 'Student § 11-14' })).toBeVisible();
    expect(screen.getByRole('link', { name: 'Nedsatt arbeidsevne § 11-5' })).toBeVisible();
  });
});
