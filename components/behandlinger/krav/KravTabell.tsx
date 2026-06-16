import { KravGrunnlag, KravVurdering } from 'lib/types/types';
import { BodyShort, Button, Table } from '@navikt/ds-react';
import { TableStyled } from 'components/tablestyled/TableStyled';
import { finnOverstyrMuligRettFra, finnSøknadsdato, formaterKravtype } from 'components/behandlinger/krav/kravutils';
import { formaterDatoForFrontend } from 'lib/utils/date';

type Props = {
  readOnly?: boolean;
  grunnlag?: KravGrunnlag;
  mellomlagredeVurderinger: KravVurdering[];
};

export const KravTabell = ({ readOnly, grunnlag, mellomlagredeVurderinger }: Props) => {
  return !grunnlag || (grunnlag?.vedtatteVurderinger.length === 0 && grunnlag?.nyeVurderinger.length === 0) ? (
    <BodyShort>Det finnes ingen vedtatte vurderinger.</BodyShort>
  ) : (
    <TableStyled size="medium">
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell></Table.HeaderCell>
          <Table.HeaderCell>JournalpostId</Table.HeaderCell>
          <Table.HeaderCell>Type</Table.HeaderCell>
          <Table.HeaderCell>Søknadsdato</Table.HeaderCell>
          <Table.HeaderCell>Mulig rett fra</Table.HeaderCell>
          <Table.HeaderCell>Vurdert av</Table.HeaderCell>
          <Table.HeaderCell>Valg</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {grunnlag.nyeVurderinger.map((vurdering) => (
          <Table.ExpandableRow content={vurdering.begrunnelse} key={vurdering.journalpostId.identifikator}>
            <Table.DataCell>{vurdering.journalpostId.identifikator}</Table.DataCell>
            <Table.DataCell>{formaterKravtype(vurdering.type)}</Table.DataCell>
            <Table.DataCell>{formaterSøknadsdato(vurdering)}</Table.DataCell>
            <Table.DataCell>{formaterOverstyrMuligRettFra(vurdering)}</Table.DataCell>
            <Table.DataCell>{vurdering.vurdertAv.ident}</Table.DataCell>
            <Table.DataCell>
              <Button size="small" variant="secondary">
                Endre
              </Button>
            </Table.DataCell>
          </Table.ExpandableRow>
        ))}
        {grunnlag.vedtatteVurderinger.map((vurdering) => (
          <Table.ExpandableRow content={vurdering.begrunnelse} key={vurdering.journalpostId.identifikator}>
            <Table.DataCell>{vurdering.journalpostId.identifikator}</Table.DataCell>
            <Table.DataCell>{formaterKravtype(vurdering.type)}</Table.DataCell>
            <Table.DataCell>{formaterSøknadsdato(vurdering)}</Table.DataCell>
            <Table.DataCell>{formaterOverstyrMuligRettFra(vurdering)}</Table.DataCell>
            <Table.DataCell>{vurdering.vurdertAv.ident}</Table.DataCell>
            <Table.DataCell>
              <Button size="small" variant="secondary">
                Endre
              </Button>
            </Table.DataCell>
          </Table.ExpandableRow>
        ))}
      </Table.Body>
    </TableStyled>
  );
};

function formaterSøknadsdato(vurdering: KravVurdering) {
  const søknadsdato = finnSøknadsdato(vurdering)?.dato;
  return søknadsdato ? formaterDatoForFrontend(søknadsdato) : '-';
}

function formaterOverstyrMuligRettFra(vurdering: KravVurdering) {
  const muligRettFra = finnOverstyrMuligRettFra(vurdering)?.dato;
  return muligRettFra ? formaterDatoForFrontend(muligRettFra) : '-';
}
