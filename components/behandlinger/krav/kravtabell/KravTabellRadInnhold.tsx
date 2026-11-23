import { BodyShort, Detail, HStack, Label, VStack } from '@navikt/ds-react';
import { ReactNode } from 'react';
import { KravVurderingForSøknad } from 'lib/types/types';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { MuligRettFraTilbakedateresOptions, SøknadsdatoEndresOptions } from 'lib/utils/form';
import { ValuePair } from 'components/form/FormField';
import {
  finnMuligRettFra,
  finnOverstyrMuligRettFra,
  finnSøknadsdato,
  formaterKravtype,
} from 'components/behandlinger/krav/vurderKravUtils';

export const KravTabellRadInnhold = ({ rad }: { rad: KravVurderingForSøknad }) => {
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
