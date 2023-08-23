import { Søker } from '../../lib/types/types';
import { Link, Table } from '@navikt/ds-react';
import { DATO_FORMATER, formaterDatoFødselsdag } from '../../lib/utils/date';
import { CheckmarkIcon, XMarkIcon } from '@navikt/aksel-icons';

interface Props {
  søker: Søker;
}

export const Saksrad = ({ søker }: Props) => {
  return (
    <Table.Row key={søker.sak.saksid}>
      <Table.DataCell>
        {søker.sak.søknadstidspunkt && (
          <Link to={`/sak/${søker.personident}`} as={Link}>
            {formaterDatoFødselsdag(søker.sak.søknadstidspunkt, DATO_FORMATER.ddMMMyyyy)}
          </Link>
        )}
      </Table.DataCell>
      <Table.DataCell>{søker.personident}</Table.DataCell>
    </Table.Row>
  );
};
