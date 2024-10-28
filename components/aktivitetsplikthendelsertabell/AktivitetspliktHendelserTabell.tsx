import { AktivitetspliktHendelse } from 'lib/types/types';

import styles from 'components/aktivitetsplikthendelsertabell/AktivitetspliktHendelserTabell.module.css';
import { Button, Table } from '@navikt/ds-react';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { FormField, useConfigForm } from '@navikt/aap-felles-react';

interface Props {
  aktivitetspliktHendelser?: AktivitetspliktHendelse[];
}

interface FormFields {
  gyldigFravær: string[];
}

export const AktivitetspliktHendelserTabell = ({ aktivitetspliktHendelser }: Props) => {
  const harAktivitetsmeldingeraktivitetsmeldinger = aktivitetspliktHendelser && aktivitetspliktHendelser.length > 0;

  const { form, formFields } = useConfigForm<FormFields>({
    gyldigFravær: {
      type: 'checkbox_nested',
    },
  });

  return (
    <div>
      <section className={styles.heading}>
        <b>Tidligere brudd på aktivitetsplikten</b>
        {!harAktivitetsmeldingeraktivitetsmeldinger ? (
          <span>Ingen tidligere brudd registrert</span>
        ) : (
          <form onSubmit={form.handleSubmit((data) => console.log(data))} className={'flex-column'}>
            <FormField form={form} formField={formFields.gyldigFravær}>
              <Table size={'small'}>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Type brudd</Table.HeaderCell>
                    <Table.HeaderCell>Årsak</Table.HeaderCell>
                    <Table.HeaderCell>Dato fra og med</Table.HeaderCell>
                    <Table.HeaderCell>Dato til og med</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {aktivitetspliktHendelser?.map((aktivitetspliktHendelse, index) => {
                    return (
                      <Table.Row key={index}>
                        <Table.DataCell>{aktivitetspliktHendelse.paragraf}</Table.DataCell>
                        <Table.DataCell>{aktivitetspliktHendelse.brudd}</Table.DataCell>
                        <Table.DataCell>{formaterDatoForFrontend(aktivitetspliktHendelse.periode.fom)}</Table.DataCell>
                        <Table.DataCell>{formaterDatoForFrontend(aktivitetspliktHendelse.periode.tom)}</Table.DataCell>
                      </Table.Row>
                    );
                  })}
                </Table.Body>
              </Table>
            </FormField>
            <Button className={'fit-content-button'} size={'small'}>
              Send inn
            </Button>
          </form>
        )}
      </section>
    </div>
  );
};
