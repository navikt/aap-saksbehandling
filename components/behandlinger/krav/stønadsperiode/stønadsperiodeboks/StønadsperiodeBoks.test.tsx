import { describe, expect, it, vi } from 'vitest';
import { render, screen, within } from 'lib/test/CustomRender';
import userEvent from '@testing-library/user-event';
import { FormProvider, useForm } from 'react-hook-form';
import { StønadsperiodeFormFields } from 'components/behandlinger/krav/utils/stønadsperiodeutils';
import { StønadsperiodeVurdering } from 'lib/types/types';
import { StønadsperiodeBoks } from './StønadsperiodeBoks';

const vurdering: StønadsperiodeVurdering = {
  referanse: 'krav-1',
  begrunnelse: '',
  harGjenværendeKvote: false,
  harHattOrdinærSiste52Uker: false,
  opprettet: '2025-04-01T10:30:00Z',
  relevantKravType: { type: 'NY_STØNADSPERIODE' },
  startDato: '2025-04-15',
  vurdertAv: 'Z000000',
  vurdertIBehandling: { id: 1 },
};

function TestForm() {
  const form = useForm<StønadsperiodeFormFields>({
    defaultValues: {
      valgteKrav: [],
      vurderinger: {
        [vurdering.referanse]: {
          begrunnelse: '',
          brukerenHarHattOrdinærAAPInnen52Uker: '',
          harGjenværendeKvote: '',
          datoKravetSkalVurderesFra: '',
        },
      },
    },
    mode: 'onChange',
  });
  return (
    <FormProvider {...form}>
      <StønadsperiodeBoks vurdering={vurdering} onLukk={vi.fn()} />
      <button type="button" onClick={() => void form.trigger()}>
        Valider
      </button>
    </FormProvider>
  );
}

describe('StønadsperiodeBoks', () => {
  it('krever alle fire felt og godtar både Ja og Nei som svar', async () => {
    const user = userEvent.setup();
    render(<TestForm />);
    await user.click(screen.getByRole('button', { name: 'Valider' }));
    expect(await screen.findByText('Du må skrive en begrunnelse.')).toBeVisible();
    expect(screen.getByText('Du må svare på om brukeren har hatt ordinær AAP innen 52 uker.')).toBeVisible();
    expect(screen.getByText('Du må svare på om brukeren har gjenværende kvote.')).toBeVisible();
    expect(screen.getByText('Du må sette en dato kravet skal vurderes fra.')).toBeVisible();

    await user.type(screen.getByRole('textbox', { name: 'Begrunnelse' }), 'Vurdering');
    await user.type(screen.getByRole('textbox', { name: 'Dato kravet skal vurderes fra' }), '15.04.2025');
    await user.click(
      within(screen.getByRole('radiogroup', { name: 'Har brukeren hatt ordinær AAP innen 52 uker?' })).getByRole(
        'radio',
        {
          name: 'Nei',
        }
      )
    );
    await user.click(
      within(screen.getByRole('radiogroup', { name: 'Har brukeren gjenværende kvote?' })).getByRole('radio', {
        name: 'Ja',
      })
    );
    await user.click(screen.getByRole('button', { name: 'Valider' }));
    expect(screen.queryByText(/Du må/)).not.toBeInTheDocument();
  });
});
