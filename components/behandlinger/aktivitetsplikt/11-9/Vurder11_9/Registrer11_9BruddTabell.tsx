import { TableStyled } from 'components/tablestyled/TableStyled';
import { Button, HStack, Table } from '@navikt/ds-react';
import { formaterDatoForFrontend, sorterEtterEldsteDato } from 'lib/utils/date';
import {
  Brudd,
  Vurdering11_9,
} from 'components/behandlinger/aktivitetsplikt/11-9/Vurder11_9/Vurder11_9MedDataFetching';
import styles from 'components/behandlinger/underveis/ikkeoppfyltmeldeplikt/rimeliggrunn.module.css';
import {
  BruddStatus,
  erNy,
  erOverskrevet,
  formaterBrudd,
  formaterGrunn,
  formaterStatus,
} from 'components/behandlinger/aktivitetsplikt/11-9/Vurder11_9/utils';

type Props = {
  readOnly?: boolean;
  tidligereVurderinger: Vurdering11_9[];
  vurderingerSendtTilBeslutter: Vurdering11_9[];
  ikkeIverksatteVurderingerSomSkalSlettes: string[];
  angreFjerning: (id: string) => void;
  mellomlagredeVurderinger: Vurdering11_9[];
  velgRad: (rad: BruddRad | undefined) => void;
  fjernRad: (rad: BruddRad) => void;
  valgtRad?: BruddRad;
};

export const Registrer11_9BruddTabell = ({
  readOnly = false,
  tidligereVurderinger,
  vurderingerSendtTilBeslutter,
  mellomlagredeVurderinger,
  ikkeIverksatteVurderingerSomSkalSlettes,
  angreFjerning,
  valgtRad,
  velgRad,
  fjernRad,
}: Props) => {
  const rader = konstruerRader(
    tidligereVurderinger,
    vurderingerSendtTilBeslutter,
    mellomlagredeVurderinger,
    ikkeIverksatteVurderingerSomSkalSlettes
  );

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
                <Rad
                  rad={rad}
                  erValgt={erValgt}
                  readOnly={readOnly}
                  velgRad={velgRad}
                  fjernRad={fjernRad}
                  angreFjerning={angreFjerning}
                />
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
  angreFjerning,
  readOnly,
}: {
  rad: BruddRad;
  erValgt: boolean;
  velgRad: (rad: BruddRad | undefined) => void;
  fjernRad: (rad: BruddRad) => void;
  angreFjerning: (id: string) => void;
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
        <HStack gap="1">
          {!erOverskrevet(rad) && (
            <Button
              size="small"
              type="button"
              variant="secondary"
              disabled={readOnly}
              onClick={() => velgRad(erValgt ? undefined : rad)}
            >
              {erValgt ? 'Avbryt' : 'Endre'}
            </Button>
          )}
          {[BruddStatus.SENDT_TIL_BESLUTTER, BruddStatus.NY].includes(rad.status!!) && (
            <Button size="small" type="button" variant="secondary" disabled={readOnly} onClick={() => fjernRad(rad)}>
              Fjern
            </Button>
          )}
          {rad.status === BruddStatus.SENDT_TIL_BESLUTTER_SLETTET && (
            <Button
              size="small"
              type="button"
              variant="secondary"
              disabled={readOnly}
              onClick={() => angreFjerning(rad.id)}
            >
              Angre
            </Button>
          )}
        </HStack>
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

function konstruerRader(
  tidligereVurderinger: Vurdering11_9[],
  vurderingerSendtTilBeslutter: Vurdering11_9[],
  mellomlagredeVurderinger: Vurdering11_9[],
  vurderingerSendTilBeslutterSomSkalSlettes: string[]
): BruddRad[] {
  const utledStatus = (vurdering: Vurdering11_9) => {
    const erIverksatt = tidligereVurderinger.some((v) => v.id === vurdering.id);

    if (erIverksatt) {
      const finnesNyRadMedSammeDato = [
        ...mellomlagredeVurderinger,
        ...vurderingerSendtTilBeslutter.filter((v) => !vurderingerSendTilBeslutterSomSkalSlettes.includes(v.id)),
      ].some((v) => v.dato === vurdering.dato);

      return finnesNyRadMedSammeDato ? BruddStatus.IVERKSATT_OVERSKREVET : BruddStatus.IVERKSATT;
    } else {
      const erSendTilBeslutter = vurderingerSendtTilBeslutter.some((v) => v.id === vurdering.id);
      const erSlettet = vurderingerSendTilBeslutterSomSkalSlettes.includes(vurdering.id);
      if (erSlettet) {
        return BruddStatus.SENDT_TIL_BESLUTTER_SLETTET;
      }
      const finnesMellomlagretRadMedSammeDato = mellomlagredeVurderinger.some((v) => v.dato === vurdering.dato);
      return erSendTilBeslutter
        ? finnesMellomlagretRadMedSammeDato
          ? BruddStatus.SENDT_TIL_BESLUTTER_OVERSKREVET
          : BruddStatus.SENDT_TIL_BESLUTTER
        : BruddStatus.NY;
    }
  };

  return [...tidligereVurderinger, ...vurderingerSendtTilBeslutter, ...mellomlagredeVurderinger]
    .sort((a, b) => sorterEtterEldsteDato(a.dato, b.dato))
    .map((vurdering) => ({ ...vurdering, status: utledStatus(vurdering) }));
}
