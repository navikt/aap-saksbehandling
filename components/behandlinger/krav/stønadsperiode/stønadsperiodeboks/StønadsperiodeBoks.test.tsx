import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, within } from 'lib/test/CustomRender';
import userEvent from '@testing-library/user-event';
import { FormProvider, useForm } from 'react-hook-form';
import { StønadsperiodeFormFields } from 'components/behandlinger/krav/utils/stønadsperiodeutils';
import { StønadsperiodeVurdering } from 'lib/types/types';
import { StønadsperiodeBoks } from './StønadsperiodeBoks';

const initialFelter = {
  begrunnelse: '',
  brukerenHarHattOrdinærAAPInnen52Uker: '',
  harGjenværendeKvote: '',
  datoKravetSkalVurderesFra: '',
};

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

interface TestFormProps {
  onLukk?: () => void;
  initialFelter?: typeof initialFelter;
}

function TestForm({ onLukk = vi.fn(), initialFelter: felter = initialFelter }: TestFormProps) {
  const form = useForm<StønadsperiodeFormFields>({
    defaultValues: {
      valgteKrav: [],
      vurderinger: {
        [vurdering.referanse]: felter,
      },
    },
    mode: 'onChange',
  });
  return (
    <FormProvider {...form}>
      <StønadsperiodeBoks vurdering={vurdering} onLukk={onLukk} />
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

  it('viser stans- eller opphør-valget bare når begge svarene er Ja', async () => {
    const user = userEvent.setup();
    render(<TestForm />);

    expect(screen.queryByRole('radiogroup', { name: 'Er det stans eller opphør?' })).not.toBeInTheDocument();

    await user.click(
      within(screen.getByRole('radiogroup', { name: 'Har brukeren hatt ordinær AAP innen 52 uker?' })).getByRole(
        'radio',
        { name: 'Ja' }
      )
    );
    expect(screen.queryByRole('radiogroup', { name: 'Er det stans eller opphør?' })).not.toBeInTheDocument();

    await user.click(
      within(screen.getByRole('radiogroup', { name: 'Har brukeren gjenværende kvote?' })).getByRole('radio', {
        name: 'Ja',
      })
    );
    expect(screen.getByRole('radiogroup', { name: 'Er det stans eller opphør?' })).toBeVisible();

    await user.click(
      within(screen.getByRole('radiogroup', { name: 'Har brukeren hatt ordinær AAP innen 52 uker?' })).getByRole(
        'radio',
        { name: 'Nei' }
      )
    );
    expect(screen.queryByRole('radiogroup', { name: 'Er det stans eller opphør?' })).not.toBeInTheDocument();
  });

  it('viser stansårsaker bare ved stans og viser leselig årsakstekst', async () => {
    const user = userEvent.setup();
    render(
      <TestForm
        initialFelter={{
          ...initialFelter,
          brukerenHarHattOrdinærAAPInnen52Uker: 'ja',
          harGjenværendeKvote: 'ja',
        }}
      />
    );

    await user.click(screen.getByRole('radio', { name: 'Opphør' }));
    expect(screen.queryByRole('combobox', { name: 'Stansårsak' })).not.toBeInTheDocument();

    await user.click(screen.getByRole('radio', { name: 'Stans' }));
    const årsakCombobox = screen.getByRole('combobox', { name: 'Stansårsak' });
    await user.click(årsakCombobox);
    expect(screen.getByRole('option', { name: 'Brukeren er under 18 år' })).toBeVisible();
    expect(screen.queryByRole('option', { name: 'BRUKER_UNDER_18' })).not.toBeInTheDocument();
  });

  it('kobler feltene til kravets referanse og kaller onLukk når boksen lukkes', async () => {
    const user = userEvent.setup();
    const onLukk = vi.fn();
    render(<TestForm onLukk={onLukk} />);
    await user.type(screen.getByRole('textbox', { name: 'Begrunnelse' }), 'Vurdering for krav 1');
    const begrunnelse = screen.getByRole('textbox', { name: 'Begrunnelse' });
    fireEvent.change(begrunnelse, { target: { value: 'Vurdering for krav 1' } });
    expect(begrunnelse).toHaveAttribute('name', 'vurderinger.krav-1.begrunnelse');
    expect(begrunnelse).toHaveValue('Vurdering for krav 1');

    await user.click(screen.getByRole('button', { name: 'Lukk' }));
    expect(onLukk).toHaveBeenCalledOnce();
  });

  it('viser valideringsfeil for ugyldig dato', async () => {
    const user = userEvent.setup();
    render(<TestForm />);

    await user.type(screen.getByRole('textbox', { name: 'Dato kravet skal vurderes fra' }), '32.13.2025');
    await user.click(screen.getByRole('button', { name: 'Valider' }));

    expect(await screen.findByText('Datoen er ikke gyldig')).toBeVisible();
  });
});
