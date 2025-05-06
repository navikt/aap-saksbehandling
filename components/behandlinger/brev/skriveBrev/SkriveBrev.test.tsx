import { describe, expect, it, vi } from 'vitest';
import { render, screen } from 'lib/test/CustomRender';
import { SkriveBrev } from 'components/behandlinger/brev/skriveBrev/SkriveBrev';
import createFetchMock from 'vitest-fetch-mock';
import { Behovstype } from 'lib/utils/form';

const fetchMock = createFetchMock(vi);
fetchMock.enableMocks();

describe('Skriv brev', () => {
  it('skal vise action meny hvis det ikke er readonly', () => {
    mockMellomLagring();
    renderSkrivBrev(false);

    const actionMenu = screen.getByText('Andre handlinger');
    expect(actionMenu).toBeVisible();
  });

  it('skal vise knapp for å sende brev hvis det ikke er readonly', () => {
    mockMellomLagring();
    renderSkrivBrev(false);

    const sendBrevKnapp = screen.getByRole('button', { name: 'Send brev' });
    expect(sendBrevKnapp).toBeVisible();
  });

  it('skal ikke vise action meny hvis det er readonly', () => {
    mockMellomLagring();
    renderSkrivBrev(true);

    const actionMenu = screen.queryByText('Andre handlinger');
    expect(actionMenu).not.toBeInTheDocument();
  });

  it('skal ikke vise knapp for å sende brev hvis det er readonly', () => {
    mockMellomLagring();
    renderSkrivBrev(true);

    const sendBrevKnapp = screen.queryByRole('button', { name: 'Send brev' });
    expect(sendBrevKnapp).not.toBeInTheDocument();
  });
});

function renderSkrivBrev(readOnly: boolean) {
  render(
    <SkriveBrev
      referanse={'123'}
      behovstype={Behovstype.SKRIV_VEDTAKSBREV_KODE}
      mottaker={{ ident: 'hei', navn: 'Iren Panikk' }}
      behandlingVersjon={1}
      grunnlag={{ overskrift: 'Brev', tekstbolker: [], journalpostTittel: 'hello pello' }}
      signaturer={[]}
      status={'FORHÅNDSVISNING_KLAR'}
      readOnly={readOnly}
    />
  );
}

function mockMellomLagring() {
  fetchMock.mockResponse(JSON.stringify({}), { status: 200 });
}
