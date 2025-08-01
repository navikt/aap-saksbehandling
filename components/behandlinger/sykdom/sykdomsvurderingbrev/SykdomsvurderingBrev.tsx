'use client';

import { BodyLong, Box, Heading, List, VStack } from '@navikt/ds-react';
import { useBehandlingsReferanse } from 'hooks/BehandlingHook';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { SykdomsvurderingBrevGrunnlag } from 'lib/types/types';
import { Behovstype } from 'lib/utils/form';
import { FormEvent } from 'react';
import { useConfigForm } from 'components/form/FormHook';
import { VilkårsKortMedForm } from 'components/vilkårskort/vilkårskortmedform/VilkårsKortMedForm';
import { FormField } from 'components/form/FormField';

type Props = {
  behandlingVersjon: number;
  grunnlag?: SykdomsvurderingBrevGrunnlag;
  readOnly: boolean;
};

type VurderingBrevFormFields = {
  vurdering: string;
};

export const SykdomsvurderingBrev = ({ behandlingVersjon, grunnlag, readOnly }: Props) => {
  const { formFields, form } = useConfigForm<VurderingBrevFormFields>(
    {
      vurdering: {
        type: 'textarea',
        label: 'Innhold til vedtaksbrevet',
        defaultValue: grunnlag?.vurdering?.vurdering ?? '',
        rules: { required: 'Du må legge til innhold for vedtaksbrevet' },
      },
    },
    { shouldUnregister: true, readOnly: readOnly }
  );

  const behandlingsreferanse = useBehandlingsReferanse();

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
        <Box>
          <Heading size={'xsmall'}>Hva skal være med i teksten?</Heading>
          <BodyLong size={'small'}>
            Denne teksten blir synlig for bruker, og du må begrunne vurderingene og resultatet av saksbehandlingen.
            Melding om innvilgelse skal innholde en beskrivelse av
          </BodyLong>
          <List size={'small'}>
            <List.Item>hvilke opplysninger som er lagt til grunn, eksempelvis fra lege</List.Item>
            <List.Item>hvilke hovedhensyn som har vært avgjørende for utfallet</List.Item>
          </List>
          <BodyLong size={'small'}>Melding om avslag skal inneholde</BodyLong>
          <List size={'small'}>
            <List.Item>opplysninger om vilkåret eller vilkårene som er avslått</List.Item>
            <List.Item>begrunnelse for vilkåret eller vilkårene som er avslått</List.Item>
            <List.Item>
              informasjon om hvilke av sakens opplysninger som har vært avgjørende for at vilkår/ vilkårene er ansett
              for ikke å være oppfylt
            </List.Item>
          </List>
        </Box>
        <FormField form={form} formField={formFields.vurdering} className={'begrunnelse'} />
      </VStack>
    </VilkårsKortMedForm>
  );
};
