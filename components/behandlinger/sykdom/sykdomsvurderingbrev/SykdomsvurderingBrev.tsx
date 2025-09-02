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
import { Behovstype, getJaNeiEllerUndefined, JaEllerNei, JaEllerNeiOptions } from 'lib/utils/form';
import { FormEvent } from 'react';
import { useConfigForm } from 'components/form/FormHook';
import { VilkårskortMedFormOgMellomlagring } from 'components/vilkårskort/vilkårskortmedformogmellomlagring/VilkårsKortMedFormOgMellomlagring';
import { FormField, ValuePair } from 'components/form/FormField';
import { TidligereVurderinger } from 'components/tidligerevurderinger/TidligereVurderinger';
import { Veiledning } from 'components/veiledning/Veiledning';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';

interface Props {
  behandlingVersjon: number;
  grunnlag?: SykdomsvurderingBrevGrunnlag;
  typeBehandling: TypeBehandling;
  readOnly: boolean;
  initialMellomlagretVurdering?: MellomlagretVurdering;
}

interface VurderingBrevFormFields {
  vurderingSkalFyllesUt: string;
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

  const defaultValues: DraftFormFields = initialMellomlagretVurdering
    ? JSON.parse(initialMellomlagretVurdering.data)
    : mapVurderingToDraftFormFields(grunnlag?.vurdering);

  const { formFields, form } = useConfigForm<VurderingBrevFormFields>(
    {
      vurderingSkalFyllesUt: {
        type: 'radio',
        label: 'Er det behov for en individuell begrunnelse i vedtaksbrevet?',
        defaultValue: defaultValues?.vurderingSkalFyllesUt,
        options: JaEllerNeiOptions,
        rules: {
          required: 'Du må svare på om det er behov for en individuell begrunnelse i vedtaksbrevet',
        },
      },
      vurdering: {
        type: 'textarea',
        label: 'Derfor får du AAP / Derfor får du ikke AAP',
        defaultValue: defaultValues?.vurdering,
        rules: { required: 'Du må legge til innhold for vedtaksbrevet' },
      },
    },
    { shouldUnregister: true, readOnly: readOnly }
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
    <VilkårskortMedFormOgMellomlagring
      heading={'Individuell begrunnelse for §§ 11-5 og 11-6 til vedtaksbrev'}
      steg="SYKDOMSVURDERING_BREV"
      vilkårTilhørerNavKontor={true}
      defaultOpen={true}
      onSubmit={handleSubmit}
      status={status}
      isLoading={isLoading}
      visBekreftKnapp={!readOnly}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      vurdertAvAnsatt={grunnlag?.vurdering?.vurdertAv}
      mellomlagretVurdering={mellomlagretVurdering}
      onLagreMellomLagringClick={() => lagreMellomlagring(form.watch())}
      onDeleteMellomlagringClick={() => {
        slettMellomlagring(() => {
          form.reset(grunnlag?.vurdering ? mapVurderingToDraftFormFields(grunnlag.vurdering) : emptyDraftFormFields());
        });
      }}
      readOnly={readOnly}
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
                  For å ha rett til AAP må arbeidsevnen din være nedsatt med minst halvparten på grunn av sykdom eller
                  skade, og du må ha aktiv behandling eller bistand fra NAV for å kunne bedre arbeidsevnen din. Dette
                  går fram av folketrygdlovens §§ 11-5 og 11-6.
                </BodyLong>
              </Box>
            </Box>
          }
          defaultOpen={false}
        />

        <FormField form={form} formField={formFields.vurderingSkalFyllesUt} horizontalRadio />
        {form.watch('vurderingSkalFyllesUt') === JaEllerNei.Ja && (
          <>
            <FormField form={form} formField={formFields.vurdering} className={'begrunnelse'} />
          </>
        )}
      </VStack>
    </VilkårskortMedFormOgMellomlagring>
  );
};

function mapVurderingToDraftFormFields(vurdering?: SykdomBrevVurdering): DraftFormFields {
  return {
    vurdering: vurdering?.vurdering || undefined,
    vurderingSkalFyllesUt: getJaNeiEllerUndefined(vurdering?.vurdering ? !!vurdering?.vurdering : undefined),
  };
}

function emptyDraftFormFields(): DraftFormFields {
  return {
    vurdering: '',
    vurderingSkalFyllesUt: '',
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
