'use client';

import { Behovstype } from 'lib/utils/form';
import { Label, Table } from '@navikt/ds-react';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { LøsBehovOgGåTilNesteStegStatusAlert } from 'components/løsbehovoggåtilnestestegstatusalert/LøsBehovOgGåTilNesteStegStatusAlert';

import styles from './ForeslåVedtak.module.css';
import { FormEvent } from 'react';
import { ForeslåVedtakGrunnlag } from 'lib/types/types';
import { ForeslåVedtakTabell } from 'components/behandlinger/vedtak/foreslåvedtak/foreslåvedtaktabell/ForeslåVedtakTabell';
import { useVilkårskortVisning } from 'hooks/saksbehandling/visning/VisningHook';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { useFeatureFlag } from 'context/UnleashContext';
import { TableStyled } from 'components/tablestyled/TableStyled';
import { VilkårskortMedForm } from 'components/vilkårskort/vilkårskortmedform/VilkårskortMedForm';
import { useParamsMedType } from 'hooks/saksbehandling/BehandlingHook';

interface Props {
  behandlingVersjon: number;
  readOnly: boolean;
  grunnlag: ForeslåVedtakGrunnlag;
}

export const ForeslåVedtak = ({ behandlingVersjon, readOnly, grunnlag }: Props) => {
  const { behandlingsreferanse } = useParamsMedType();
  const { status, løsBehovOgGåTilNesteSteg, isLoading, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('FORESLÅ_VEDTAK');
  const visStansOpphørFeature = useFeatureFlag('VisStansOpphorFrontend');

  const { visningActions, visningModus } = useVilkårskortVisning(readOnly, 'FORESLÅ_VEDTAK', undefined);

  return (
    <VilkårskortMedForm
      heading="Foreslå vedtak"
      steg={'FORESLÅ_VEDTAK'}
      vilkårTilhørerNavKontor={false}
      status={status}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      isLoading={isLoading}
      onSubmit={(event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        løsBehovOgGåTilNesteSteg({
          behandlingVersjon: behandlingVersjon,
          behov: {
            behovstype: Behovstype.FORESLÅ_VEDTAK_KODE,
          },
          referanse: behandlingsreferanse,
        });
      }}
      knappTekst={'Send til beslutter'}
      visningModus={visningModus}
      visningActions={visningActions}
      formReset={() => {}}
    >
      <div className={styles.foreslåvedtak}>
        <Label as="p" size={'medium'}>
          Vedtaket medfører følgende konsekvens for brukeren:
        </Label>
        <ForeslåVedtakTabell grunnlag={grunnlag} />
        {visStansOpphørFeature && (
          <TableStyled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Fra og med</Table.HeaderCell>
                <Table.HeaderCell>Stans eller opphør</Table.HeaderCell>
                <Table.HeaderCell>Årsak</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {grunnlag.stansOpphør.map(({ stansOpphørFraOgMed, historikk }) => {
                return (
                  <Table.Row key={stansOpphørFraOgMed}>
                    <Table.DataCell>{formaterDatoForFrontend(stansOpphørFraOgMed)}</Table.DataCell>
                    <Table.DataCell>{historikk[0].type}</Table.DataCell>
                    <Table.DataCell>{historikk[0].årsaker}</Table.DataCell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </TableStyled>
        )}
        <LøsBehovOgGåTilNesteStegStatusAlert
          status={status}
          løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
        />
      </div>
    </VilkårskortMedForm>
  );
};
