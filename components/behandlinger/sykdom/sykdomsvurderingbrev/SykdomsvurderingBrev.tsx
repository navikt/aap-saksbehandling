'use client';

import { BodyLong, Box, Heading, List, VStack } from '@navikt/ds-react';
import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { SykdomsvurderingBrevGrunnlag, TypeBehandling } from 'lib/types/types';
import { Behovstype, getJaNeiEllerUndefined, JaEllerNei, JaEllerNeiOptions } from 'lib/utils/form';
import { FormEvent } from 'react';
import { useConfigForm } from 'components/form/FormHook';
import { VilkårsKortMedForm } from 'components/vilkårskort/vilkårskortmedform/VilkårsKortMedForm';
import { FormField } from 'components/form/FormField';
import { TidligereVurderingerV3 } from 'components/tidligerevurderinger/TidligereVurderingerV3';
import { Veiledning } from 'components/veiledning/Veiledning';

type Props = {
  behandlingVersjon: number;
  grunnlag?: SykdomsvurderingBrevGrunnlag;
  typeBehandling: TypeBehandling;
  readOnly: boolean;
};

type VurderingBrevFormFields = {
  vurderingSkalFyllesUt: JaEllerNei;
  vurdering: string;
};

export const SykdomsvurderingBrev = ({ behandlingVersjon, grunnlag, typeBehandling, readOnly }: Props) => {
  const { formFields, form } = useConfigForm<VurderingBrevFormFields>(
    {
      vurderingSkalFyllesUt: {
        type: 'radio',
        label: 'Er det relevant å informere bruker om hva som er vurdert i sykdomssteget i denne behandlingen?',
        defaultValue: getJaNeiEllerUndefined(grunnlag?.vurdering ? !!grunnlag?.vurdering?.vurdering : undefined),
        options: JaEllerNeiOptions,
        rules: {
          required: 'Du må svare på om det er relevant å informere bruker om hva som er vurdert i sykdomssteget',
        },
      },
      vurdering: {
        type: 'textarea',
        label: 'Derfor får du AAP / Derfor får du ikke AAP',
        defaultValue: grunnlag?.vurdering?.vurdering ?? undefined,
        rules: { required: 'Du må legge til innhold for vedtaksbrevet' },
      },
    },
    { shouldUnregister: true, readOnly: readOnly }
  );

  const behandlingsreferanse = useBehandlingsReferanse();

  const historiskeVurderinger = grunnlag?.historiskeVurderinger.map((vurdering) => ({
    periode: { fom: vurdering.vurdertAv.dato },
    vurdertAvIdent: vurdering.vurdertAv.ident,
    vurdertDato: vurdering.vurdertAv.dato,
    erGjeldendeVurdering: true,
    felter: [
      {
        label: 'Vurdering',
        value: vurdering.vurdering || 'Ikke relevant for behandling',
      },
    ],
  }));

  const { løsBehovOgGåTilNesteSteg, isLoading, status, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('SYKDOMSVURDERING_BREV');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit((data) => {
      løsBehovOgGåTilNesteSteg({
        behandlingVersjon: behandlingVersjon,
        referanse: behandlingsreferanse,
        behov: {
          behovstype: Behovstype.SYKDOMSVURDERING_BREV_KODE,
          vurdering: data.vurdering,
        },
      });
    })(event);
  };

  const skalViseTidligereVurderinger =
    typeBehandling === 'Revurdering' && historiskeVurderinger && historiskeVurderinger.length > 0;

  return (
    <VilkårsKortMedForm
      heading={'Tekst til vedtaksbrev'}
      steg="SYKDOMSVURDERING_BREV"
      vilkårTilhørerNavKontor={true}
      defaultOpen={true}
      onSubmit={handleSubmit}
      status={status}
      isLoading={isLoading}
      visBekreftKnapp={!readOnly}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      vurdertAvAnsatt={grunnlag?.vurdering?.vurdertAv}
    >
      <VStack gap={'4'}>
        {skalViseTidligereVurderinger && <TidligereVurderingerV3 tidligereVurderinger={historiskeVurderinger} />}

        <Veiledning
          header={'Hva skal være med i teksten?'}
          tekst={
            <Box>
              <BodyLong size={'small'}>Melding om innvilgelse skal innholde en beskrivelse av</BodyLong>
              <List size={'small'}>
                <List.Item>hvilke opplysninger som er lagt til grunn, eksempelvis fra lege</List.Item>
                <List.Item>hvilke hovedhensyn som har vært avgjørende for utfallet</List.Item>
              </List>
              <BodyLong size={'small'}>Melding om avslag skal inneholde</BodyLong>
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
                  For å ha rett til AAP må arbeidsevnen din må være nedsatt med minst halvparten på grunn av sykdom
                  eller skade, og du må ha aktiv behandling eller bistand fra NAV for å kunne bedre arbeidsevnen din.
                  Dette går fram av folketrygdlovens §§ 11-5 og 11-6.
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
    </VilkårsKortMedForm>
  );
};
