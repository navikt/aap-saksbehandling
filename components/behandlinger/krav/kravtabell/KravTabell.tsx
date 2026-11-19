import { BodyShort, Button, Detail, Heading, HStack, Label, Table, Tag, VStack } from '@navikt/ds-react';
import { KravGrunnlag, KravVurdering, KravVurderingForSøknad } from 'lib/types/types';
import { formaterDatoForFrontend } from 'lib/utils/date';

import {
  finnMuligRettFra,
  finnOverstyrMuligRettFra,
  finnSøknadsdato,
  formaterKravtype,
  getKravVurderingerForSøknad,
  hentOriginaleFormFelter,
} from 'components/behandlinger/krav/vurderKravUtils';
import { TableStyled } from 'components/tablestyled/TableStyled';
import { useFormContext, useWatch } from 'react-hook-form';
import { KravFormFields } from 'components/behandlinger/krav/vurderkrav/VurderKrav';
import { MuligRettFraTilbakedateresOptions, SøknadsdatoEndresOptions } from 'lib/utils/form';
import { ValuePair } from 'components/form/FormField';
import { ReactNode } from 'react';

interface Props {
  grunnlag: KravGrunnlag;
  readOnly: boolean;
}

export const KravTabell = ({ grunnlag, readOnly }: Props) => {
  const form = useFormContext<KravFormFields>();
  const { control, getValues, setValue } = form;
  const valgteKrav = useWatch({ control, name: 'valgteKrav' }) ?? [];

  const toggleValgtKrav = (referanse: string) => {
    const gjeldende = getValues('valgteKrav') ?? [];
    const erÅpen = gjeldende.includes(referanse);

    if (erÅpen) {
      const originaleFelter = hentOriginaleFormFelter(grunnlag, referanse);
      if (originaleFelter) {
        setValue(`vurderinger.${referanse}`, originaleFelter);
      }
    }

    const nyeValgteKrav = erÅpen ? gjeldende.filter((r) => r !== referanse) : [...gjeldende, referanse];
    setValue('valgteKrav', nyeValgteKrav);
  };

  const nyeVurderinger = getKravVurderingerForSøknad(grunnlag.nyeVurderinger);
  const vedtatteVurderinger = getKravVurderingerForSøknad(grunnlag.vedtatteVurderinger);

  return (
    <>
      <Heading size="xsmall">Søknader</Heading>
      <TableStyled size="small">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell></Table.HeaderCell>
            <Table.HeaderCell>JournalpostId</Table.HeaderCell>
            <Table.HeaderCell>Type</Table.HeaderCell>
            <Table.HeaderCell>Mulig rett fra</Table.HeaderCell>
            <Table.HeaderCell>Vurdert av</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            {!readOnly && <Table.HeaderCell>Valg</Table.HeaderCell>}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {nyeVurderinger.map((vurdering) => {
            return (
              <Table.ExpandableRow content={<ExpandableRowContent rad={vurdering} />} key={vurdering.referanse}>
                <Table.DataCell textSize={'small'}>{vurdering.journalpostId.identifikator}</Table.DataCell>
                <Table.DataCell textSize={'small'}>{formaterKravtype(vurdering.type)}</Table.DataCell>
                <Table.DataCell textSize={'small'}>{formaterOverstyrMuligRettFraRad(vurdering)}</Table.DataCell>
                <Table.DataCell textSize={'small'}>{vurdering.vurdertAv}</Table.DataCell>
                <Table.DataCell textSize={'small'}>
                  <Tag variant="alt1" size="small">
                    Ny
                  </Tag>
                </Table.DataCell>
                {!readOnly && (
                  <Table.DataCell textSize={'small'}>
                    <Button
                      type="button"
                      size="small"
                      variant={valgteKrav.includes(vurdering.referanse) ? 'primary' : 'secondary'}
                      onClick={() => toggleValgtKrav(vurdering.referanse)}
                      disabled={readOnly}
                    >
                      {valgteKrav.includes(vurdering.referanse) ? 'Lukk' : 'Endre'}
                    </Button>
                  </Table.DataCell>
                )}
              </Table.ExpandableRow>
            );
          })}

          {vedtatteVurderinger.map((vurdering) => {
            return (
              <Table.ExpandableRow content={<ExpandableRowContent rad={vurdering} />} key={vurdering.referanse}>
                <Table.DataCell textSize={'small'}>{vurdering.journalpostId.identifikator}</Table.DataCell>
                <Table.DataCell textSize={'small'}>{formaterKravtype(vurdering.type)}</Table.DataCell>
                <Table.DataCell textSize={'small'}>{formaterOverstyrMuligRettFraRad(vurdering)}</Table.DataCell>
                <Table.DataCell textSize={'small'}>{vurdering.vurdertAv}</Table.DataCell>
                <Table.DataCell textSize={'small'}>
                  <Tag variant="success" size="small">
                    Vedtatt
                  </Tag>
                </Table.DataCell>
                {!readOnly && (
                  <Table.DataCell textSize={'small'}>
                    <Button
                      type="button"
                      size="small"
                      variant={valgteKrav.includes(vurdering.referanse) ? 'primary' : 'secondary'}
                      onClick={() => toggleValgtKrav(vurdering.referanse)}
                      disabled={readOnly}
                    >
                      {valgteKrav.includes(vurdering.referanse) ? 'Lukk' : 'Endre'}
                    </Button>
                  </Table.DataCell>
                )}
              </Table.ExpandableRow>
            );
          })}

          {grunnlag.søknaderUtenKravvurdering.map((søknad) => {
            const referanse = søknad.journalpostId.identifikator;

            return (
              <Table.ExpandableRow content="Søknaden har ikke en kravvurdering ennå." key={referanse}>
                <Table.DataCell textSize={'small'}>{søknad.journalpostId.identifikator}</Table.DataCell>
                <Table.DataCell textSize={'small'}>-</Table.DataCell>
                <Table.DataCell textSize={'small'}>-</Table.DataCell>
                <Table.DataCell textSize={'small'}>-</Table.DataCell>
                <Table.DataCell textSize={'small'}>
                  <Tag variant="warning" size="small">
                    Må vurderes
                  </Tag>
                </Table.DataCell>
                <Table.DataCell textSize={'small'}></Table.DataCell>
              </Table.ExpandableRow>
            );
          })}
        </Table.Body>
      </TableStyled>
    </>
  );
};

function formaterOverstyrMuligRettFraRad(vurdering: KravVurdering) {
  const dato = finnMuligRettFra(vurdering);
  return dato ? formaterDatoForFrontend(dato) : '-';
}

const ExpandableRowContent = ({ rad }: { rad: KravVurderingForSøknad }) => {
  const erRelevantKrav = rad.type === 'RELEVANT_KRAV';
  const søknadsdato = finnSøknadsdato(rad);
  const overstyrMuligRettFra = finnOverstyrMuligRettFra(rad);
  const muligRettFra = finnMuligRettFra(rad);

  return (
    <VStack gap={'space-12'}>
      <HStack gap={'space-16'}>
        <LabelValueHorizontal value={formaterDatoForFrontend(rad.opprettet)} label={'Opprettet'} />
        <LabelValueHorizontal value={rad.vurdertAv} label={'Vurdert av'} />
      </HStack>

      <VStack gap={'space-16'}>
        <Bolk tittel={'Type krav'}>
          <Felt label={'Type'} value={formaterKravtype(rad.type)} />
          <Felt label={'Vurdering'} value={rad.begrunnelse} />
        </Bolk>

        {erRelevantKrav && (
          <Bolk tittel={'Søknadsdato'}>
            <Felt label={'Søknadsdato'} value={søknadsdato ? formaterDatoForFrontend(søknadsdato.dato) : '-'} />
            <Felt
              label={'Skal søknadsdato endres?'}
              value={finnValgLabel(SøknadsdatoEndresOptions, søknadsdato?.årsak)}
            />
            {søknadsdato?.begrunnelse && <Felt label={'Begrunnelse'} value={søknadsdato.begrunnelse} />}
          </Bolk>
        )}

        {erRelevantKrav && (
          <Bolk tittel={'Mulig rett fra'}>
            <Felt label={'Mulig rett fra'} value={muligRettFra ? formaterDatoForFrontend(muligRettFra) : '-'} />
            <Felt
              label={'Skal rett til ytelse tilbakedateres før søknadstidspunktet?'}
              value={finnValgLabel(MuligRettFraTilbakedateresOptions, overstyrMuligRettFra?.årsak)}
            />
            {overstyrMuligRettFra && (
              <>
                <Felt label={'Tidligst rett til AAP fra'} value={formaterDatoForFrontend(overstyrMuligRettFra.dato)} />
                <Felt label={'Begrunnelse'} value={overstyrMuligRettFra.begrunnelse} />
              </>
            )}
          </Bolk>
        )}
      </VStack>
    </VStack>
  );
};

function Bolk({ tittel, children }: { tittel: string; children: ReactNode }) {
  return (
    <VStack gap={'space-4'}>
      <Label size={'small'}>{tittel}</Label>
      <VStack gap={'space-2'}>{children}</VStack>
    </VStack>
  );
}

function Felt({ label, value }: { label: string; value: string }) {
  return (
    <BodyShort size={'small'} style={{ whiteSpace: 'pre-wrap' }}>
      <Detail as={'span'} textColor={'subtle'}>
        {label}:
      </Detail>{' '}
      {value}
    </BodyShort>
  );
}

/** Finner visningstekst for en lagret årsak. Mangler årsaken (eller er den ikke et valg) vises "Nei" */
function finnValgLabel(options: ValuePair[], årsak?: string | null) {
  return options.find((option) => option.value === årsak)?.label ?? 'Nei';
}

function LabelValueHorizontal({ label, value }: { label: string; value: string }) {
  return (
    <HStack gap={'space-4'}>
      <BodyShort size={'small'} weight={'semibold'}>
        {label}
      </BodyShort>
      <BodyShort size={'small'}>{value}</BodyShort>
    </HStack>
  );
}
