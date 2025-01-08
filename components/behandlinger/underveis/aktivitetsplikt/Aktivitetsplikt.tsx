'use client';

import { FormField, useConfigForm } from '@navikt/aap-felles-react';
import { Table } from '@navikt/ds-react';
import {
  hentBruddTekst,
  hentGrunnTekst,
} from 'components/aktivitetsplikt/aktivitetsplikthendelser/aktivitetsplikthendelsertabell/aktivitetsplikthendelsertabellrad/AktivitetspliktHendelserTabellRad';
import { Form } from 'components/form/Form';
import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { useBehandlingsReferanse } from 'hooks/BehandlingHook';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { AktivitetspliktGrunnlag, AktivitetspliktPeriode } from 'lib/types/types';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { Behovstype } from 'lib/utils/form';
import { FormEvent } from 'react';

interface Props {
  grunnlag?: AktivitetspliktGrunnlag;
  behandlingVersjon: number;
  readOnly: boolean;
}

interface FormFields {
  begrunnelse: string;
}

export const Aktivitetsplikt = ({ grunnlag, behandlingVersjon, readOnly }: Props) => {
  const behandlingsreferanse = useBehandlingsReferanse();
  const { løsBehovOgGåTilNesteSteg, isLoading, status } = useLøsBehovOgGåTilNesteSteg('EFFEKTUER_11_7');
  const { form, formFields } = useConfigForm<FormFields>({
    begrunnelse: {
      type: 'textarea',
      label: 'Vurdering',
      defaultValue: grunnlag?.begrunnelse || undefined, // TODO sjekk ut denne
      rules: { required: 'Du må begrunne' },
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit((data) => {
      løsBehovOgGåTilNesteSteg({
        behandlingVersjon: behandlingVersjon,
        behov: {
          behovstype: Behovstype.EFFEKTUER_11_7_KODE,
          begrunnelse: data.begrunnelse,
        },
        referanse: behandlingsreferanse,
      });
    })(event);
  };

  if (!grunnlag || grunnlag.gjeldendeBrudd.length === 0) {
    return;
  }

  return (
    <VilkårsKort steg={'EFFEKTUER_11_7'} heading={'§ 11-7 Bidrar ikke til egen avklaring / behandling'}>
      <Table size={'small'}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Brudd</Table.HeaderCell>
            <Table.HeaderCell>Grunn</Table.HeaderCell>
            <Table.HeaderCell>Begrunnelse</Table.HeaderCell>
            <Table.HeaderCell>Periode</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {grunnlag.gjeldendeBrudd.map((gjeldendeBrudd) => (
            <Table.Row key={gjeldendeBrudd.brudd + gjeldendeBrudd.grunn}>
              <Table.DataCell>{hentBruddTekst(gjeldendeBrudd.brudd)}</Table.DataCell>
              <Table.DataCell>{hentGrunnTekst(gjeldendeBrudd.grunn)}</Table.DataCell>
              <Table.DataCell>{gjeldendeBrudd.begrunnelse}</Table.DataCell>
              <Table.DataCell>{formaterPeriodeForVisning(gjeldendeBrudd.periode)}</Table.DataCell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      <Form
        onSubmit={handleSubmit}
        status={status}
        isLoading={isLoading}
        steg={'EFFEKTUER_11_7'}
        visBekreftKnapp={!readOnly}
      >
        <FormField form={form} formField={formFields.begrunnelse} />
      </Form>
    </VilkårsKort>
  );
};

function formaterPeriodeForVisning(periode: AktivitetspliktPeriode) {
  if (periode.tom) {
    return `${formaterDatoForFrontend(periode.fom)} - ${formaterDatoForFrontend(periode.tom)}`;
  }
  return `${formaterDatoForFrontend(periode.fom)} - `;
}
