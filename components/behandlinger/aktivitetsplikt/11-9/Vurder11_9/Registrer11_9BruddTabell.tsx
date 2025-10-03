import { TableStyled } from 'components/tablestyled/TableStyled';
import { Button, HStack, Table } from '@navikt/ds-react';
import { formaterDatoForFrontend, sorterEtterEldsteDato } from 'lib/utils/date';
import { Vurdering11_9 } from 'components/behandlinger/aktivitetsplikt/11-9/Vurder11_9/Vurder11_9MedDataFetching';
import styles from './vurder-11-9.module.css';
import {
  BruddStatus,
  erNy,
  erOverskrevet,
  formaterBrudd,
  formaterGrunn,
  formaterStatus,
} from 'components/behandlinger/aktivitetsplikt/11-9/Vurder11_9/utils';
import { Brudd } from 'lib/types/types';

type Props = {
  readOnly?: boolean;
  tidligereVurderinger: Vurdering11_9[];
  mellomlagredeVurderinger: Vurdering11_9[];
  velgRad: (rad: BruddRad | undefined) => void;
  fjernRad: (rad: BruddRad) => void;
  valgtRad?: BruddRad;
};

export const Registrer11_9BruddTabell = ({
  readOnly = false,
  tidligereVurderinger,
  mellomlagredeVurderinger,
  valgtRad,
  velgRad,
  fjernRad,
}: Props) => {
  const rader = konstruerRader(tidligereVurderinger, mellomlagredeVurderinger);

  return (
    <div>
      <TableStyled size="medium">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell></Table.HeaderCell>
            <Table.HeaderCell>Dato</Table.HeaderCell>
            <Table.HeaderCell>Brudd</Table.HeaderCell>
            <Table.HeaderCell>Grunn</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {rader.map((rad) => {
            const erValgt = valgtRad?.id === rad.id;
            return (
              <Table.ExpandableRow
                key={rad.id}
                className={`
                  ${erOverskrevet(rad) ? styles.overskrevetRad : ''} 
                  ${erNy(rad) ? styles.ny : ''}
                  ${erValgt ? styles.valgtRad : ''}
                `}
                content={rad.begrunnelse}
              >
                <Rad rad={rad} erValgt={erValgt} readOnly={readOnly} velgRad={velgRad} fjernRad={fjernRad} />
              </Table.ExpandableRow>
            );
          })}
        </Table.Body>
      </TableStyled>
    </div>
  );
};

const Rad = ({
  rad,
  erValgt,
  velgRad,
  fjernRad,
  readOnly,
}: {
  rad: BruddRad;
  erValgt: boolean;
  velgRad: (rad: BruddRad | undefined) => void;
  fjernRad: (rad: BruddRad) => void;
  readOnly: boolean;
}) => {
  const klasse = `${erOverskrevet(rad) ? styles.overskrevetCelle : ''}`;
  return (
    <>
      <Table.DataCell className={klasse}>{formaterDatoForFrontend(rad.dato)}</Table.DataCell>
      <Table.DataCell className={klasse}>{formaterBrudd(rad.brudd!!)}</Table.DataCell>
      <Table.DataCell className={klasse}>{formaterGrunn(rad.grunn)}</Table.DataCell>
      <Table.DataCell className={klasse}>{formaterStatus(rad.status!!)}</Table.DataCell>
      <Table.DataCell>
        {!readOnly && (
          <HStack gap="1">
            {!erOverskrevet(rad) && (
              <Button
                size="small"
                type="button"
                variant="secondary"
                disabled={readOnly}
                onClick={() => velgRad(erValgt ? undefined : rad)}
              >
                Endre
              </Button>
            )}
            {[BruddStatus.NY].includes(rad.status!!) && (
              <Button size="small" type="button" variant="secondary" disabled={readOnly} onClick={() => fjernRad(rad)}>
                Fjern
              </Button>
            )}
          </HStack>
        )}
      </Table.DataCell>
    </>
  );
};

export interface BruddRad {
  id: string;
  dato: string;
  brudd: Brudd | undefined;
  grunn: string;
  status: BruddStatus | undefined;
  begrunnelse: string;
}

function konstruerRader(tidligereVurderinger: Vurdering11_9[], mellomlagredeVurderinger: Vurdering11_9[]): BruddRad[] {
  const utledStatus = (vurdering: Vurdering11_9) => {
    const erIverksatt = tidligereVurderinger.some((v) => v.id === vurdering.id);

    if (erIverksatt) {
      const finnesNyRadMedSammeDato = mellomlagredeVurderinger.some((v) => v.dato === vurdering.dato);
      return finnesNyRadMedSammeDato ? BruddStatus.IVERKSATT_OVERSKREVET : BruddStatus.IVERKSATT;
    } else {
      return BruddStatus.NY;
    }
  };

  return [...tidligereVurderinger, ...mellomlagredeVurderinger]
    .sort((a, b) => sorterEtterEldsteDato(a.dato, b.dato))
    .map((vurdering) => ({ ...vurdering, status: utledStatus(vurdering) }));
}
