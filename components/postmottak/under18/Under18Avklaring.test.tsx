import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, expect, it, vi } from 'vitest';
import type { StegType, Under18Grunnlag } from 'lib/types/postmottakTypes';
import { usePostmottakLøsBehovOgGåTilNesteSteg } from 'hooks/postmottak/PostmottakLøsBehovOgGåTilNesteStegHook';
import { Under18Avklaring } from './Under18Avklaring';
import { PostmottakFlytResponse, setPostmottakMockFlytResponse } from 'vitestSetup';

const send = vi.hoisted(() => vi.fn());
const hookState: Pick<
  ReturnType<typeof usePostmottakLøsBehovOgGåTilNesteSteg>,
  'status' | 'isLoading' | 'løsBehovOgGåTilNesteStegError'
> = vi.hoisted(() => ({
  status: undefined,
  isLoading: false,
  løsBehovOgGåTilNesteStegError: undefined,
}));
vi.mock('hooks/postmottak/PostmottakLøsBehovOgGåTilNesteStegHook', () => ({
  usePostmottakLøsBehovOgGåTilNesteSteg: () => ({ løsBehovOgGåTilNesteSteg: send, ...hookState }),
}));
const grunnlag: Under18Grunnlag = {
  behandling: {
    aktivtSteg: 'AVKLAR_UNDER18',
    status: 'UTREDES',
    referanse: 'forelder',
    versjon: 4,
    åpneBehov: [],
    vent: [],
    prosesseringFeilet: false,
  },
  søknader: [],
};
const samtykkespørsmål = 'Er samtykket vedlagt og signert av foreldre med foreldreansvar?';

function visUnder18(
  situasjon: NonNullable<Under18Grunnlag['aldersgrunnlag']>['aldersgruppe'],
  testGrunnlag = grunnlag,
  readOnly = false,
  aktivtSteg: StegType = situasjon === 'SAMTYKKE' ? 'AVKLAR_UNDER18_SAMTYKKE' : 'AVKLAR_UNDER18',
  steg: 'AVKLAR_UNDER18' | 'AVKLAR_UNDER18_SAMTYKKE' = situasjon === 'SAMTYKKE'
    ? 'AVKLAR_UNDER18_SAMTYKKE'
    : 'AVKLAR_UNDER18'
) {
  setPostmottakMockFlytResponse({
    ...PostmottakFlytResponse,
    aktivGruppe: 'UNDER18',
    aktivtSteg,
    behandlingVersjon: testGrunnlag.behandling.versjon,
    visning: { ...PostmottakFlytResponse.visning, typeBehandling: 'Under18', readOnly },
  });
  return render(
    <Under18Avklaring
      behandlingsreferanse={testGrunnlag.behandling.referanse}
      behandlingsVersjon={testGrunnlag.behandling.versjon}
      grunnlag={testGrunnlag}
      situasjon={situasjon}
      steg={steg}
      readOnly={readOnly}
    />
  );
}

beforeEach(() => {
  send.mockClear();
  hookState.status = undefined;
  hookState.isLoading = false;
  hookState.løsBehovOgGåTilNesteStegError = undefined;
});

it('krever bekreftelse før søknaden henlegges for en som er for ung', async () => {
  const user = userEvent.setup();
  visUnder18('FOR_UNG');
  expect(screen.getByRole('heading', { name: 'Henlegg søknaden' })).toBeVisible();
  expect(
    screen.getByText('Gå i dialog med brukeren om å henlegge søknaden og eventuelt søke igjen senere.')
  ).toBeVisible();
  const knapp = screen.getByRole('button', { name: 'Henlegg søknaden' });
  await user.click(knapp);
  expect(
    await within(screen.getByRole('group', { name: 'Bekreft henleggelse' })).findByText('Du må bekrefte henleggelsen.')
  ).toBeVisible();
  expect(send).not.toHaveBeenCalled();
  await user.click(screen.getByRole('checkbox'));
  await user.click(knapp);
  expect(send).toHaveBeenCalledExactlyOnceWith({
    referanse: 'forelder',
    behandlingVersjon: 4,
    behov: {
      behovstype: '1344',
      fylt17ÅrOg9Måneder: false,
      situasjon: 'SØKER_FOR_UNG',
      søkerVilFortsette: false,
    },
  });
});

it.each(['Ja', 'Nei'])('registrerer svaret %s når søkeren har fylt 18', async (svar) => {
  const user = userEvent.setup();
  visUnder18('FYLT_18');
  const spørsmål = screen.getByRole('radiogroup', {
    name: 'Søkeren har fylt 18 år. Vil søkeren fortsette med søknaden?',
  });
  await user.click(within(spørsmål).getByRole('radio', { name: svar }));
  await user.click(screen.getByRole('button', { name: 'Lagre svar' }));
  expect(send).toHaveBeenCalledWith(
    expect.objectContaining({
      behov: {
        behovstype: '1344',
        fylt17ÅrOg9Måneder: true,
        situasjon: 'SØKER_FYLT_18',
        søkerVilFortsette: svar === 'Ja',
      },
    })
  );
});

it.each(['FYLT_18', 'SAMTYKKE'] as const)('viser valideringsfeilen ved spørsmålet for %s', async (situasjon) => {
  const user = userEvent.setup();
  visUnder18(situasjon);
  const spørsmål = screen.getByRole('radiogroup', {
    name: situasjon === 'SAMTYKKE' ? samtykkespørsmål : 'Søkeren har fylt 18 år. Vil søkeren fortsette med søknaden?',
  });

  await user.click(screen.getByRole('button', { name: 'Lagre svar' }));

  expect(await within(spørsmål).findByText('Velg ja eller nei.')).toBeVisible();
  expect(send).not.toHaveBeenCalled();

  await user.click(within(spørsmål).getByRole('radio', { name: 'Ja' }));
  await user.click(screen.getByRole('button', { name: 'Lagre svar' }));

  expect(within(spørsmål).queryByText('Velg ja eller nei.')).not.toBeInTheDocument();
  expect(send).toHaveBeenCalledTimes(1);
});

it('viser felles statusmelding mens prosesseringen pågår', () => {
  hookState.status = 'POLLING';
  hookState.isLoading = true;
  visUnder18('SAMTYKKE');

  expect(screen.getByText('Maskinen bruker litt lengre tid på å jobbe enn vanlig.')).toBeVisible();
});

it('viser felles feil ved innsending', () => {
  hookState.løsBehovOgGåTilNesteStegError = {
    message: 'Kunne ikke lagre løsningen',
  };
  visUnder18('SAMTYKKE');

  expect(screen.getByText('Kunne ikke lagre løsningen')).toBeVisible();
  expect(screen.getByRole('button', { name: 'Lagre svar' })).toBeVisible();
});

it('kan registrere samtykke uten journalposter', async () => {
  const user = userEvent.setup();
  visUnder18('SAMTYKKE');
  expect(screen.queryByText('Opprett ny sak')).not.toBeInTheDocument();
  await user.click(
    within(screen.getByRole('radiogroup', { name: samtykkespørsmål })).getByRole('radio', { name: 'Ja' })
  );
  expect(screen.getByText('Opprett ny sak')).toBeVisible();
  expect(screen.getByText('Når søknaden med signert samtykke er på plass, vil ny sak opprettes.')).toBeVisible();
  await user.click(screen.getByRole('button', { name: 'Lagre svar' }));
  expect(send).toHaveBeenCalledWith(
    expect.objectContaining({
      behov: {
        behovstype: '1345',
        beggeForeldreSamtykket: true,
        samtykkeJournalpostIder: [],
      },
    })
  );
});

it.each([{ søknader: [{ journalpostId: 12 }] }, { søknader: [{ journalpostId: 11 }, { journalpostId: 12 }] }])(
  'sender valgte søknadsjournalposter og tidligere valgte journalposter uavhengig av samtykkesvaret',
  async ({ søknader }) => {
    const user = userEvent.setup();
    visUnder18('SAMTYKKE', {
      ...grunnlag,
      samtykkevurdering: { beggeForeldreSamtykket: false, samtykkeJournalpostIder: [11] },
      søknader,
    });
    expect(screen.getAllByRole('checkbox')).toHaveLength(2);
    await user.click(screen.getByRole('checkbox', { name: /Journalpost 12/ }));
    await user.click(
      within(screen.getByRole('radiogroup', { name: samtykkespørsmål })).getByRole('radio', { name: 'Nei' })
    );
    expect(screen.getByText('Hent inn samtykke')).toBeVisible();
    expect(screen.getByText(/Send søknaden og samtykkeskjemaet i posten til foresatte/)).toBeVisible();
    expect(screen.getByText('Behandlingen settes på vent.')).toBeVisible();
    expect(screen.queryByText('Opprett ny sak')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Lagre svar' }));
    expect(send).toHaveBeenCalledWith(
      expect.objectContaining({
        behov: {
          behovstype: '1345',
          beggeForeldreSamtykket: false,
          samtykkeJournalpostIder: [11, 12],
        },
      })
    );
  }
);

it.each([
  { situasjon: 'FOR_UNG' as const, svar: 'Nei' },
  { situasjon: 'SAMTYKKE' as const, svar: 'Ja' },
  { situasjon: 'FYLT_18' as const, svar: 'Ja' },
])('forhåndsutfyller aldersvurderingen for $situasjon og lar den endres', async ({ situasjon, svar }) => {
  const user = userEvent.setup();
  visUnder18(situasjon, grunnlag, false, 'AVKLAR_UNDER18', 'AVKLAR_UNDER18');
  const aldersspørsmål = screen.getByRole('radiogroup', { name: /Er brukeren over 17 år og 9 måneder/ });
  const valgtSvar = within(aldersspørsmål).getByRole('radio', { name: svar });
  expect(valgtSvar).toBeChecked();
  await user.click(within(aldersspørsmål).getByRole('radio', { name: svar === 'Ja' ? 'Nei' : 'Ja' }));
  expect(valgtSvar).not.toBeChecked();
  expect(send).not.toHaveBeenCalled();
});

it.each(['FOR_UNG', 'SAMTYKKE'] as const)('lagrer alderssvaret i søknadssteget for %s', async (situasjon) => {
  const user = userEvent.setup();
  visUnder18(situasjon, grunnlag, false, 'AVKLAR_UNDER18', 'AVKLAR_UNDER18');
  await user.click(
    within(screen.getByRole('radiogroup', { name: /Er brukeren over 17 år og 9 måneder/ })).getByRole('radio', {
      name: 'Ja',
    })
  );
  await user.click(screen.getByRole('button', { name: 'Lagre svar' }));

  expect(send).toHaveBeenCalledExactlyOnceWith({
    referanse: 'forelder',
    behandlingVersjon: 4,
    behov: {
      behovstype: '1344',
      fylt17ÅrOg9Måneder: true,
    },
  });
});

it('bruker backendens aldersgruppe som standard', () => {
  visUnder18('FOR_UNG', {
    ...grunnlag,
    aldersgrunnlag: { aldersgruppe: 'FOR_UNG', fødselsdato: '2009-01-01' },
  });
  expect(
    within(screen.getByRole('radiogroup', { name: /Er brukeren over 17 år og 9 måneder/ })).getByRole('radio', {
      name: 'Nei',
    })
  ).toBeChecked();
});

it('krever bekreftet henleggelse når alderssvaret endres til nei for FYLT_18', async () => {
  const user = userEvent.setup();
  visUnder18('FYLT_18');
  await user.click(
    within(screen.getByRole('radiogroup', { name: /Er brukeren over 17 år og 9 måneder/ })).getByRole('radio', {
      name: 'Nei',
    })
  );
  await user.click(screen.getByRole('button', { name: 'Henlegg søknaden' }));
  expect(send).not.toHaveBeenCalled();
  expect(await screen.findByText('Du må bekrefte henleggelsen.')).toBeVisible();
  await user.click(screen.getByRole('checkbox'));
  await user.click(screen.getByRole('button', { name: 'Henlegg søknaden' }));
  expect(send).toHaveBeenCalledWith(
    expect.objectContaining({
      behov: {
        behovstype: '1344',
        fylt17ÅrOg9Måneder: false,
        situasjon: 'SØKER_FOR_UNG',
        søkerVilFortsette: false,
      },
    })
  );
});

it('viser tidligere samtykke uten redigeringsknapper når behandlingen er skrivebeskyttet', async () => {
  const user = userEvent.setup();
  visUnder18(
    'SAMTYKKE',
    { ...grunnlag, samtykkevurdering: { beggeForeldreSamtykket: true, samtykkeJournalpostIder: [] } },
    true
  );
  const spørsmål = screen.getByRole('radiogroup', {
    name: /Er samtykket vedlagt og signert av foreldre med foreldreansvar/,
  });

  expect(within(spørsmål).getByRole('radio', { name: 'Ja' })).toBeChecked();
  await user.click(within(spørsmål).getByRole('radio', { name: 'Nei' }));

  expect(within(spørsmål).getByRole('radio', { name: 'Ja' })).toBeChecked();
  expect(screen.queryByRole('radiogroup', { name: /Er brukeren over 17 år og 9 måneder/ })).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Lagre svar' })).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Endre' })).not.toBeInTheDocument();
  expect(send).not.toHaveBeenCalled();
});

it('kan endre og avbryte en tidligere vurdering med de vanlige knappene', async () => {
  const user = userEvent.setup();
  visUnder18(
    'SAMTYKKE',
    { ...grunnlag, samtykkevurdering: { beggeForeldreSamtykket: false, samtykkeJournalpostIder: [] } },
    false,
    'OPPRETT_UNDER18_SAK'
  );
  const spørsmål = screen.getByRole('radiogroup', {
    name: /Er samtykket vedlagt og signert av foreldre med foreldreansvar/,
  });

  expect(within(spørsmål).getByRole('radio', { name: 'Nei' })).toBeChecked();
  expect(screen.queryByRole('button', { name: 'Lagre svar' })).not.toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'Endre' }));
  await user.click(within(spørsmål).getByRole('radio', { name: 'Ja' }));
  expect(screen.getByRole('button', { name: 'Lagre svar' })).toBeVisible();
  await user.click(screen.getByRole('button', { name: 'Avbryt' }));

  expect(within(spørsmål).getByRole('radio', { name: 'Nei' })).toBeChecked();
  expect(screen.getByRole('button', { name: 'Endre' })).toBeVisible();
  expect(send).not.toHaveBeenCalled();
});
