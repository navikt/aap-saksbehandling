import { describe, expect, it, vi } from 'vitest';
import { act, render, screen } from 'lib/test/CustomRender';
import { SkriveBrev } from 'components/behandlinger/brev/skriveBrev/SkriveBrev';
import createFetchMock from 'vitest-fetch-mock';
import { Behovstype } from 'lib/utils/form';

vi.mock('@navikt/aap-breveditor/', () => ({
  BrevbyggerBeta: () => null,
}));

const fetchMock = createFetchMock(vi);
fetchMock.enableMocks();

describe('Skriv brev', () => {
  it('skal vise action meny hvis det ikke er readonly', async () => {
    mockMellomLagring();
    await renderSkrivBrev(false);

    const actionMenu = screen.getByRole('button', { name: 'Andre handlinger' });
    expect(actionMenu).toBeVisible();
  });

  it('skal vise knapp for å ferdigstille brev hvis det ikke er readonly', async () => {
    mockMellomLagring();
    await renderSkrivBrev(false);

    const ferdigstillBrevKnapp = screen.getByRole('button', { name: 'Ferdigstill brev' });
    expect(ferdigstillBrevKnapp).toBeVisible();
  });

  it('skal ikke vise action meny hvis det er readonly', async () => {
    mockMellomLagring();
    await renderSkrivBrev(true);

    const actionMenu = screen.queryByRole('button', { name: 'Andre handlinger' });
    expect(actionMenu).not.toBeInTheDocument();
  });

  it('skal ikke vise knapp for å ferdigstille brev hvis det er readonly', async () => {
    mockMellomLagring();
    await renderSkrivBrev(true);

    const ferdigstillBrevKnapp = screen.queryByRole('button', { name: 'Ferdigstill brev' });
    expect(ferdigstillBrevKnapp).not.toBeInTheDocument();
  });
});

async function renderSkrivBrev(readOnly: boolean) {
  await act(async () => {
    render(
      <SkriveBrev
        referanse={'123'}
        behovstype={Behovstype.SKRIV_VEDTAKSBREV_KODE}
        bruker={{ ident: '123', navn: 'Iren Panikk' }}
        mottaker={{ ident: 'hei', navn: 'Iren Panikk' }}
        behandlingVersjon={1}
        grunnlag={{
          overskrift: 'Brev',
          kanOverstyreBrevtittel: false,
          tekstbolker: [],
          journalpostTittel: 'hello pello',
        }}
        signaturer={[]}
        status={'FORHÅNDSVISNING_KLAR'}
        readOnly={readOnly}
        brevtype={'INNVILGELSE'}
      />
    );
  });
}

function mockMellomLagring() {
  fetchMock.mockResponse(JSON.stringify({}), { status: 200 });
}
