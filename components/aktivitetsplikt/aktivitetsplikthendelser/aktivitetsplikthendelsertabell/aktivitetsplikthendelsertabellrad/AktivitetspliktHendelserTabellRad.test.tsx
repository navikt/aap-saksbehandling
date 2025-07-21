import { describe, expect, it } from 'vitest';
import { AktivitetspliktHendelserMedFormId } from 'components/aktivitetsplikt/aktivitetsplikthendelser/AktivitetspliktHendelser';
import { render, screen } from '@testing-library/react';
import { AktivitetspliktHendelserTabellRad } from 'components/aktivitetsplikt/aktivitetsplikthendelser/aktivitetsplikthendelsertabell/aktivitetsplikthendelsertabellrad/AktivitetspliktHendelserTabellRad';
import { userEvent } from '@testing-library/user-event';
import { ReactNode } from 'react';

const aktivitetspliktHendelse117: AktivitetspliktHendelserMedFormId = {
  id: '3cae893b-fc1e-44b8-a3af-e5a098d5de3b',
  brudd: 'IKKE_AKTIVT_BIDRAG',
  paragraf: 'PARAGRAF_11_7',
  grunn: 'INGEN_GYLDIG_GRUNN',
  periode: {
    fom: '2024-12-20',
    tom: null,
  },
  begrunnelse: 'Min begrunnelse',
};

const aktivitetspliktHendelse118: AktivitetspliktHendelserMedFormId = {
  id: '5efce92a-bd27-4fa3-b1a7-6d7c3d5692de',
  brudd: 'IKKE_MØTT_TIL_TILTAK',
  paragraf: 'PARAGRAF_11_8',
  grunn: 'SYKDOM_ELLER_SKADE',
  periode: {
    fom: '2024-12-21',
    tom: '2024-12-21',
  },
  begrunnelse: 'Min begrunnelse',
};

const aktivitetspliktHendelse119: AktivitetspliktHendelserMedFormId = {
  id: '63a71868-7ca3-4cc2-a4e0-5829b3f976a0',
  brudd: 'IKKE_MØTT_TIL_BEHANDLING_ELLER_UTREDNING',
  paragraf: 'PARAGRAF_11_9',
  grunn: 'RIMELIG_GRUNN',
  periode: {
    fom: '2024-12-22',
    tom: '2024-12-22',
  },
  begrunnelse: 'Min begrunnelse',
};

const user = userEvent.setup();

describe('aktivitetspliktHendelserTabellRad', () => {
  describe('generelt', () => {
    it('skal vise begrunnelsen', async () => {
      render(
        <TableWrapper>
          <AktivitetspliktHendelserTabellRad aktivitetspliktHendelse={aktivitetspliktHendelse117} />
        </TableWrapper>
      );
      await åpneRad();
      const begrunnelse = screen.getAllByText('Min begrunnelse')[1]; // Det første elementet er i table row og ikke i expandable content
      expect(begrunnelse).toBeVisible();
    });

    it('skal ha en knapp for å lagre endringene', async () => {
      render(
        <TableWrapper>
          <AktivitetspliktHendelserTabellRad aktivitetspliktHendelse={aktivitetspliktHendelse117} />
        </TableWrapper>
      );
      await åpneRad();
      const lagreKnapp = screen.getByRole('button', { name: 'Lagre' });
      expect(lagreKnapp).toBeVisible();
    });

    it('skal ha en knapp for å avbryte endringene', async () => {
      render(
        <TableWrapper>
          <AktivitetspliktHendelserTabellRad aktivitetspliktHendelse={aktivitetspliktHendelse117} />
        </TableWrapper>
      );
      await åpneRad();
      const avbrytKnapp = screen.getByRole('button', { name: 'Avbryt' });
      expect(avbrytKnapp).toBeVisible();
    });
  });

  describe('felt for å endre grunn', () => {
    it('skal vise et felt', async () => {
      render(
        <TableWrapper>
          <AktivitetspliktHendelserTabellRad aktivitetspliktHendelse={aktivitetspliktHendelse117} />
        </TableWrapper>
      );
      await åpneRad();

      const felt = screen.getByRole('group', { name: 'Endre grunn' });
      expect(felt).toBeVisible();
    });

    it('skal ha riktige valg dersom det er 11-7', async () => {
      render(
        <TableWrapper>
          <AktivitetspliktHendelserTabellRad aktivitetspliktHendelse={aktivitetspliktHendelse117} />
        </TableWrapper>
      );
      await åpneRad();

      const ingenGyldigGrunnValg = screen.getByRole('radio', { name: 'Uten rimelig grunn' });
      expect(ingenGyldigGrunnValg).toBeVisible();

      const bidrarAktivtIgjenValg = screen.getByRole('radio', { name: 'Bidrar aktivt igjen' });
      expect(bidrarAktivtIgjenValg).toBeVisible();

      const feilregistreringValg = screen.getByRole('radio', {
        name: 'Feilregistrering (Konsekvens tekst kommer her)',
      });
      expect(feilregistreringValg).toBeVisible();
    });

    it('skal ha riktige valg dersom det er 11-8', async () => {
      render(
        <TableWrapper>
          <AktivitetspliktHendelserTabellRad aktivitetspliktHendelse={aktivitetspliktHendelse118} />
        </TableWrapper>
      );
      await åpneRad();

      const ingenGyldigGrunnValg = screen.getByRole('radio', { name: 'Uten rimelig grunn' });
      expect(ingenGyldigGrunnValg).toBeVisible();

      const sykdomEllerSkadeValg = screen.getByRole('radio', { name: 'Sykdom eller skade' });
      expect(sykdomEllerSkadeValg).toBeVisible();

      const sterkeVelferdsgrunnerValg = screen.getByRole('radio', { name: 'Sterke velferdsgrunner' });
      expect(sterkeVelferdsgrunnerValg).toBeVisible();

      const feilregistreringValg = screen.getByRole('radio', {
        name: 'Feilregistrering (Konsekvens tekst kommer her)',
      });
      expect(feilregistreringValg).toBeVisible();
    });

    it('skal ha riktige valg dersom det er 11-9', async () => {
      render(
        <TableWrapper>
          <AktivitetspliktHendelserTabellRad aktivitetspliktHendelse={aktivitetspliktHendelse119} />
        </TableWrapper>
      );
      await åpneRad();

      const ingenGyldigGrunnValg = screen.getByRole('radio', { name: 'Uten rimelig grunn' });
      expect(ingenGyldigGrunnValg).toBeVisible();

      const rimeligGrunnValg = screen.getByRole('radio', { name: 'Rimelig grunn' });
      expect(rimeligGrunnValg).toBeVisible();

      const feilregistreringValg = screen.getByRole('radio', {
        name: 'Feilregistrering (Konsekvens tekst kommer her)',
      });
      expect(feilregistreringValg).toBeVisible();
    });
  });

  describe('felt for å skrive begrunelse', () => {
    it('skal vise felt', async () => {
      render(
        <TableWrapper>
          <AktivitetspliktHendelserTabellRad aktivitetspliktHendelse={aktivitetspliktHendelse117} />
        </TableWrapper>
      );
      await åpneRad();
      const felt = screen.getByRole('textbox', { name: 'Begrunnelse' });
      expect(felt).toBeVisible();
    });

    it('skal vise en feilmeliding dersom begrunnelse ikke er besvart', async () => {
      render(
        <TableWrapper>
          <AktivitetspliktHendelserTabellRad aktivitetspliktHendelse={aktivitetspliktHendelse117} />
        </TableWrapper>
      );
      await åpneRad();
      const lagreKnapp = screen.getByRole('button', { name: 'Lagre' });
      await user.click(lagreKnapp);

      const feilmelding = screen.getByText('Du må skrive en begrunnelse');
      expect(feilmelding).toBeVisible();
    });
  });

  describe('felt for å sette en dato brukeren bidrar aktivt igjen fra', () => {
    it('Skal vise felt dersom brukeren bidrar aktivt igjen', async () => {
      render(
        <TableWrapper>
          <AktivitetspliktHendelserTabellRad aktivitetspliktHendelse={aktivitetspliktHendelse117} />
        </TableWrapper>
      );
      await åpneRad();

      expect(screen.queryByRole('textbox', { name: 'Bidrar aktivt igjen fra' })).not.toBeInTheDocument();

      const bidrarAktivtIgjenValg = screen.getByText('Bidrar aktivt igjen');
      await user.click(bidrarAktivtIgjenValg);

      expect(screen.getByRole('textbox', { name: 'Bidrar aktivt igjen fra' })).toBeVisible();
    });

    it('skal vise en feilmelding dersom det ikke er besvart', async () => {
      render(
        <TableWrapper>
          <AktivitetspliktHendelserTabellRad aktivitetspliktHendelse={aktivitetspliktHendelse117} />
        </TableWrapper>
      );
      await åpneRad();

      const bidrarAktivtIgjenValg = screen.getByText('Bidrar aktivt igjen');
      await user.click(bidrarAktivtIgjenValg);

      const lagreKnapp = screen.getByRole('button', { name: 'Lagre' });
      await user.click(lagreKnapp);

      const feilmelding = screen.getByText('Du må sette en dato');
      expect(feilmelding).toBeVisible();
    });
  });
});

async function åpneRad() {
  await user.click(screen.getByRole('img', { name: 'Vis mer' }));
}

const TableWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <table>
      <tbody>{children}</tbody>
    </table>
  );
};
