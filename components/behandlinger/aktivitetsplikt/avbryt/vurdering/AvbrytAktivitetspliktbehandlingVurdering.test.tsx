import { userEvent } from '@testing-library/user-event/dist/cjs/index.js';
import { beforeEach, describe, expect, it } from 'vitest';
import { defaultFlytResponse, setMockFlytResponse } from 'vitestSetup';
import { render, screen } from 'lib/test/CustomRender';
import {
  AvbrytAktivitetspliktbehandlingVurdering
} from 'components/behandlinger/aktivitetsplikt/avbryt/vurdering/AvbrytAktivitetspliktbehandlingVurdering';
import { AvbrytAktivitetspliktbehandlingGrunnlag } from 'lib/types/types';

const user = userEvent.setup();

beforeEach(() => {
  setMockFlytResponse({ ...defaultFlytResponse, aktivtSteg: 'AVBRYT_AKTIVITETSPLIKTBEHANDLING' });
});

const grunnlag: AvbrytAktivitetspliktbehandlingGrunnlag = {
  vurdering: {
    begrunnelse: 'trykket feil',
    årsak: 'BEHANDLINGEN_BLE_OPPRETTET_VED_EN_FEIL',
    vurderingerMeta: {}
  },
}

describe('Avbryt aktivitetspliktbehandling', () => {
  it('har en overskrift', () => {
    render(
      <AvbrytAktivitetspliktbehandlingVurdering
        grunnlag={grunnlag}
        readOnly={false}
        behandlingVersjon={1}
      />
    );
    expect(screen.getByRole('heading', { name: 'Avbryt behandling', level: 3 })).toBeVisible();
  });

  it('har et felt for å begrunne hvorfor behandling skal avbrytes', () => {
    render(
      <AvbrytAktivitetspliktbehandlingVurdering
        grunnlag={grunnlag}
        readOnly={false}
        behandlingVersjon={1}
      />
    );
    expect(screen.getByRole('textbox', { name: 'Begrunnelse (obligatorisk)' })).toBeVisible();
  });

  it('viser en feilmelding dersom man forsøker å bekrefte uten å ha skrevet en begrunnelse', async () => {
    render(
      <AvbrytAktivitetspliktbehandlingVurdering
        grunnlag={{ vurdering: { begrunnelse: '', vurderingerMeta: {}, årsak: 'BEHANDLINGEN_BLE_OPPRETTET_VED_EN_FEIL' } }}
        readOnly={false}
        behandlingVersjon={1}
      />
    );
    await user.click(screen.getByRole('button', { name: 'Bekreft' }));
    expect(await screen.findByText('Du må begrunne hvorfor behandlingen avbrytes')).toBeVisible();
  });
});