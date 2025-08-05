'use client';

import { BodyLong, Box, List, VStack } from '@navikt/ds-react';
import { useBehandlingsReferanse } from 'hooks/BehandlingHook';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { SykdomsvurderingBrevGrunnlag } from 'lib/types/types';
import { Behovstype, getJaNeiEllerUndefined, JaEllerNei, JaEllerNeiOptions } from 'lib/utils/form';
import { FormEvent } from 'react';
import { useConfigForm } from 'components/form/FormHook';
import { VilkårsKortMedForm } from 'components/vilkårskort/vilkårskortmedform/VilkårsKortMedForm';
import { FormField } from 'components/form/FormField';
import { TidligereVurderingerV3 } from 'components/tidligerevurderinger/TidligereVurderingerV3';
import { sorterEtterNyesteDato } from 'lib/utils/date';
import { Veiledning } from 'components/veiledning/Veiledning';

type Props = {
  behandlingVersjon: number;
  grunnlag?: SykdomsvurderingBrevGrunnlag;
  readOnly: boolean;
};

type VurderingBrevFormFields = {
  vurderingSkalFyllesUt: JaEllerNei;
  vurdering: string;
};

export const SykdomsvurderingBrev = ({ behandlingVersjon, grunnlag, readOnly }: Props) => {
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
        label: 'Innhold til vedtaksbrevet',
        defaultValue: grunnlag?.vurdering?.vurdering ?? undefined,
        rules: { required: 'Du må legge til innhold for vedtaksbrevet' },
      },
    },
    { shouldUnregister: true, readOnly: readOnly }
  );

  const behandlingsreferanse = useBehandlingsReferanse();

  const historiskeVurderinger = grunnlag?.historiskeVurderinger
    .sort((a, b) => sorterEtterNyesteDato(a.vurdertAv.dato, b.vurdertAv.dato))
    .map((vurdering) => ({
      periode: { fom: vurdering.vurdertAv.dato },
      vurdertAvIdent: vurdering.vurdertAv.ident,
      vurdertDato: vurdering.vurdertAv.dato,
      erGjeldendeVurdering: true,
      felter: [
        {
          label: 'Vurdering',
          value: vurdering.vurdering || '',
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
        {historiskeVurderinger && historiskeVurderinger.length > 0 && (
          <TidligereVurderingerV3 tidligereVurderinger={historiskeVurderinger} />
        )}

        <FormField form={form} formField={formFields.vurderingSkalFyllesUt} horizontalRadio />
        {form.watch('vurderingSkalFyllesUt') === JaEllerNei.Ja && (
          <>
            <Veiledning
              header={'Hva skal være med i teksten?'}
              tekst={
                <Box>
                  <BodyLong size={'small'}>
                    Denne teksten blir synlig for bruker, og du må begrunne vurderingene og resultatet av
                    saksbehandlingen. Melding om innvilgelse skal innholde en beskrivelse av
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
                      informasjon om hvilke av sakens opplysninger som har vært avgjørende for at vilkår/ vilkårene er
                      ansett for ikke å være oppfylt
                    </List.Item>
                  </List>
                </Box>
              }
              defaultOpen={false}
            />

            <FormField form={form} formField={formFields.vurdering} className={'begrunnelse'} />
          </>
        )}
      </VStack>
    </VilkårsKortMedForm>
  );
};
