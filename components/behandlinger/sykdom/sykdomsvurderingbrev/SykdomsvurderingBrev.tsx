'use client';

import { BodyLong, Box, Heading, List, VStack } from '@navikt/ds-react';
import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import {
  MellomlagretVurdering,
  SykdomBrevVurdering,
  SykdomsvurderingBrevGrunnlag,
  TypeBehandling,
} from 'lib/types/types';
import { Behovstype } from 'lib/utils/form';
import { FormEvent } from 'react';
import { useConfigForm } from 'components/form/FormHook';
import { FormField, ValuePair } from 'components/form/FormField';
import { TidligereVurderinger } from 'components/tidligerevurderinger/TidligereVurderinger';
import { Veiledning } from 'components/veiledning/Veiledning';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';
import { useVilkårskortVisning } from 'hooks/saksbehandling/visning/VisningHook';
import { VilkårskortMedFormOgMellomlagringNyVisning } from 'components/vilkårskort/vilkårskortmedformogmellomlagringnyvisning/VilkårskortMedFormOgMellomlagringNyVisning';

interface Props {
  behandlingVersjon: number;
  grunnlag?: SykdomsvurderingBrevGrunnlag;
  typeBehandling: TypeBehandling;
  readOnly: boolean;
  initialMellomlagretVurdering?: MellomlagretVurdering;
}

interface VurderingBrevFormFields {
  vurdering: string;
}

type DraftFormFields = Partial<VurderingBrevFormFields>;

export const SykdomsvurderingBrev = ({
  behandlingVersjon,
  grunnlag,
  typeBehandling,
  readOnly,
  initialMellomlagretVurdering,
}: Props) => {
  const behandlingsreferanse = useBehandlingsReferanse();

  const { løsBehovOgGåTilNesteSteg, isLoading, status, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('SYKDOMSVURDERING_BREV');

  const { mellomlagretVurdering, nullstillMellomlagretVurdering, lagreMellomlagring, slettMellomlagring } =
    useMellomlagring(Behovstype.SYKDOMSVURDERING_BREV_KODE, initialMellomlagretVurdering);

  const { visningActions, formReadOnly, visningModus } = useVilkårskortVisning(
    readOnly,
    'SYKDOMSVURDERING_BREV',
    mellomlagretVurdering
  );

  const defaultValues: DraftFormFields = initialMellomlagretVurdering
    ? JSON.parse(initialMellomlagretVurdering.data)
    : mapVurderingToDraftFormFields(grunnlag?.vurdering);

  const { formFields, form } = useConfigForm<VurderingBrevFormFields>(
    {
      vurdering: {
        type: 'textarea',
        label: 'Derfor får du AAP / Derfor får du ikke AAP',
        defaultValue: defaultValues?.vurdering,
        rules: { required: 'Du må skrive en individuell begrunnelse' },
      },
    },
    { shouldUnregister: true, readOnly: formReadOnly }
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit(
      (data) => {
        løsBehovOgGåTilNesteSteg({
          behandlingVersjon: behandlingVersjon,
          referanse: behandlingsreferanse,
          behov: {
            behovstype: Behovstype.SYKDOMSVURDERING_BREV_KODE,
            vurdering: data.vurdering,
          },
        });
      },
      () => nullstillMellomlagretVurdering()
    )(event);
  };

  const historiskeVurderinger = grunnlag?.historiskeVurderinger;
  const skalViseTidligereVurderinger =
    typeBehandling === 'Revurdering' && historiskeVurderinger && historiskeVurderinger.length > 0;

  return (
    <VilkårskortMedFormOgMellomlagringNyVisning
      heading={'Individuell begrunnelse til vedtaksbrev'}
      steg="SYKDOMSVURDERING_BREV"
      vilkårTilhørerNavKontor={true}
      defaultOpen={true}
      onSubmit={handleSubmit}
      status={status}
      isLoading={isLoading}
      visBekreftKnapp={!formReadOnly}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      vurdertAvAnsatt={grunnlag?.vurdering?.vurdertAv}
      mellomlagretVurdering={mellomlagretVurdering}
      onLagreMellomLagringClick={() => lagreMellomlagring(form.watch())}
      onDeleteMellomlagringClick={() => {
        slettMellomlagring(() => {
          form.reset(grunnlag?.vurdering ? mapVurderingToDraftFormFields(grunnlag.vurdering) : emptyDraftFormFields());
        });
      }}
      readOnly={formReadOnly}
      visningModus={visningModus}
      visningActions={visningActions}
      knappTekst={'Bekreft og send videre'}
      formReset={() => form.reset(mellomlagretVurdering ? JSON.parse(mellomlagretVurdering.data) : undefined)}
    >
      <VStack gap={'4'}>
        {skalViseTidligereVurderinger && (
          <TidligereVurderinger
            data={historiskeVurderinger}
            buildFelter={byggFelter}
            getErGjeldende={() => true}
            getFomDato={(v) => v.vurdertAv.dato}
            getVurdertAvIdent={(v) => v.vurdertAv.ident}
            getVurdertDato={(v) => v.vurdertAv.dato}
          />
        )}

        <Veiledning
          header={'Hva skal være med i teksten?'}
          tekst={
            <Box>
              <BodyLong size={'small'}>Melding om innvilgelse skal innholde en beskrivelse av</BodyLong>
              <List size={'small'}>
                <List.Item>hvilke opplysninger som er lagt til grunn, eksempelvis fra lege</List.Item>
                <List.Item>hvilke hovedhensyn som har vært avgjørende for utfallet</List.Item>
              </List>
              <BodyLong size={'small'}>Melding om avslag skal i tillegg inneholde</BodyLong>
              <List size={'small'}>
                <List.Item>opplysninger om vilkåret eller vilkårene som er avslått</List.Item>
                <List.Item>begrunnelse for vilkåret eller vilkårene som er avslått</List.Item>
                <List.Item>
                  informasjon om hvilke av sakens opplysninger som har vært avgjørende for at vilkår/ vilkårene er
                  ansett for ikke å være oppfylt
                </List.Item>
              </List>
            </Box>
          }
          defaultOpen={false}
        />

        <Veiledning
          header={'Hvor står denne teksten i brevet?'}
          tekst={
            <Box>
              <BodyLong size={'small'}>Før avsnittet du skriver, står dette avsnittet:</BodyLong>
              <Box marginBlock={'3 0'}>
                <Heading size={'xsmall'}>Hvem kan få AAP?</Heading>
                <BodyLong size={'small'}>
                  For å ha rett til arbeidsavklaringspenger må arbeidsevnen din være nedsatt med minst halvparten på
                  grunn av sykdom eller skade, og du trenger behandling eller bistand fra Nav for å bedre arbeidsevnen
                  din. Dette går fram av folketrygdloven § 11-5 og § 11-6.
                </BodyLong>
              </Box>
            </Box>
          }
          defaultOpen={false}
        />
        <FormField form={form} formField={formFields.vurdering} className={'begrunnelse'} />
      </VStack>
    </VilkårskortMedFormOgMellomlagringNyVisning>
  );
};

function mapVurderingToDraftFormFields(vurdering?: SykdomBrevVurdering): DraftFormFields {
  return {
    vurdering: vurdering?.vurdering || undefined,
  };
}

function emptyDraftFormFields(): DraftFormFields {
  return {
    vurdering: '',
  };
}

function byggFelter(vurdering: SykdomBrevVurdering): ValuePair[] {
  return [
    {
      label: 'Vurdering',
      value: vurdering?.vurdering || 'Ikke relevant for behandling',
    },
  ];
}
