import { TableStyled } from 'components/tablestyled/TableStyled';
import { Button, HStack, Table } from '@navikt/ds-react';
import { formaterDatoForFrontend, sorterEtterEldsteDato } from 'lib/utils/date';
import {
  Brudd,
  Vurdering11_9,
} from 'components/behandlinger/aktivitetsplikt/11-9/Vurder11_9/Vurder11_9MedDataFetching';
import styles from 'components/behandlinger/underveis/ikkeoppfyltmeldeplikt/rimeliggrunn.module.css';
import { formaterBrudd, formaterGrunn } from 'components/behandlinger/aktivitetsplikt/11-9/Vurder11_9/utils';

type Props = {
  readOnly?: boolean;
  tidligereVurderinger: Vurdering11_9[];
  ikkeIverksatteVurderinger: Vurdering11_9[];
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
  ikkeIverksatteVurderinger,
  mellomlagredeVurderinger,
  ikkeIverksatteVurderingerSomSkalSlettes,
  angreFjerning,
  valgtRad,
  velgRad,
  fjernRad,
}: Props) => {
  const rader = konstruerRader(
    tidligereVurderinger,
    ikkeIverksatteVurderinger,
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
                  ${['Iverksatt - overskrevet', 'Ny - slettet', 'Ny - overskrevet'].includes(rad.status) ? styles.overskrevetRad : ''} 
                  ${['Ny', 'Ny - ikke lagret'].includes(rad.status) ? styles.ny : ''}
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
  const klasse = `${['Iverksatt - overskrevet', 'Ny - slettet', 'Ny - overskrevet'].includes(rad.status) ? styles.overskrevetCelle : ''}`;
  return (
    <>
      <Table.DataCell className={klasse}>{formaterDatoForFrontend(rad.dato)}</Table.DataCell>
      <Table.DataCell className={klasse}>{formaterBrudd(rad.brudd)}</Table.DataCell>
      <Table.DataCell className={klasse}>{formaterGrunn(rad.grunn)}</Table.DataCell>
      <Table.DataCell className={klasse}>{rad.status}</Table.DataCell>
      <Table.DataCell>
        <HStack gap="1">
          <Button
            size="small"
            type="button"
            variant="secondary"
            disabled={readOnly}
            onClick={() => velgRad(erValgt ? undefined : rad)}
          >
            {erValgt ? 'Avbryt' : 'Endre'}
          </Button>
          {['Ny', 'Ny - ikke lagret'].includes(rad.status) && (
            <Button size="small" type="button" variant="secondary" disabled={readOnly} onClick={() => fjernRad(rad)}>
              Fjern
            </Button>
          )}
          {rad.status === 'Ny - slettet' && (
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
  brudd: Brudd;
  grunn: string;
  status: string;
  begrunnelse: string;
}

function konstruerRader(
  tidligereVurderinger: Vurdering11_9[],
  ikkeIverksatteVurderinger: Vurdering11_9[],
  mellomlagredeVurderinger: Vurdering11_9[],
  ikkeIverksatteVurderingerSomSkalSlettes: string[]
): BruddRad[] {
  const utledStatus = (vurdering: Vurdering11_9) => {
    const erIverksatt = tidligereVurderinger.some((v) => v.id === vurdering.id);

    if (erIverksatt) {
      const finnesNyRadMedSammeDato = [
        ...mellomlagredeVurderinger,
        ...ikkeIverksatteVurderinger.filter((v) => !ikkeIverksatteVurderingerSomSkalSlettes.includes(v.id)),
      ].some((v) => v.dato === vurdering.dato);

      return finnesNyRadMedSammeDato ? 'Iverksatt - overskrevet' : 'Iverksatt';
    } else {
      const erIkkeIverksatt = ikkeIverksatteVurderinger.some((v) => v.id === vurdering.id);
      const erSlettet = ikkeIverksatteVurderingerSomSkalSlettes.includes(vurdering.id);
      if (erSlettet) {
        return 'Ny - slettet';
      }
      const finnesMellomlagretRadMedSammeDato = mellomlagredeVurderinger.some((v) => v.dato === vurdering.dato);
      return erIkkeIverksatt ? (finnesMellomlagretRadMedSammeDato ? 'Ny - overskrevet' : 'Ny') : 'Ny - ikke lagret';
    }
  };

  return [...tidligereVurderinger, ...ikkeIverksatteVurderinger, ...mellomlagredeVurderinger]
    .sort((a, b) => sorterEtterEldsteDato(a.dato, b.dato))
    .map((vurdering) => ({ ...vurdering, status: utledStatus(vurdering) }));
}
