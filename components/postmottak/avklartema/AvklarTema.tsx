'use client';

import { VilkårsKort } from 'components/postmottak/vilkårskort/VilkårsKort';
import { Behovstype, JaEllerNei, JaEllerNeiOptions, getJaNeiEllerUndefined } from 'lib/postmottakForm';
import { FormEvent, FormEventHandler } from 'react';
import { usePostmottakLøsBehovOgGåTilNesteSteg } from 'hooks/postmottak/LøsBehovOgGåTilNesteStegHook';
import { AvklarTemaGrunnlag } from 'lib/types/postmottakTypes';
import { ServerSentEventStatusAlert } from 'components/serversenteventstatusalert/ServerSentEventStatusAlert';
import { postmottakEndreTemaClient, postmottakLøsBehovClient } from 'lib/postmottakClientApi';
import { Nesteknapp } from 'components/postmottak/nesteknapp/Nesteknapp';
import { VStack } from '@navikt/ds-react';
import { useConfigForm } from 'components/form/FormHook';
import { FormField } from 'components/form/FormField';

interface Props {
  behandlingsVersjon: number;
  behandlingsreferanse: string;
  grunnlag: AvklarTemaGrunnlag;
  readOnly: boolean;
}

interface FormFields {
  erTemaAAP: string;
}

export const AvklarTema = ({ behandlingsVersjon, behandlingsreferanse, grunnlag, readOnly }: Props) => {
  const { formFields, form } = useConfigForm<FormFields>(
    {
      erTemaAAP: {
        type: 'radio',
        label: 'Hører dette dokumentet til tema AAP?',
        rules: { required: 'Du må svare på om dokumentet har riktig tema' },
        defaultValue: getJaNeiEllerUndefined(grunnlag.vurdering?.skalTilAap),
        options: JaEllerNeiOptions,
      },
    },
    { readOnly }
  );
  const { løsBehovOgGåTilNesteSteg, status } = usePostmottakLøsBehovOgGåTilNesteSteg('AVKLAR_TEMA');
  const onSubmit: FormEventHandler<HTMLFormElement> = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit((data) => {
      if (data.erTemaAAP === JaEllerNei.Ja) {
        løsBehovOgGåTilNesteSteg({
          behandlingVersjon: behandlingsVersjon,
          behov: {
            behovstype: Behovstype.AVKLAR_TEMA,
            skalTilAap: data.erTemaAAP === JaEllerNei.Ja,
          },
          // @ts-ignore
          referanse: behandlingsreferanse,
        });
      } else {
        postmottakLøsBehovClient({
          behandlingVersjon: behandlingsVersjon,
          behov: {
            behovstype: Behovstype.AVKLAR_TEMA,
            skalTilAap: data.erTemaAAP === JaEllerNei.Ja,
          },
          // @ts-ignore
          referanse: behandlingsreferanse,
        }).then(() =>
          postmottakEndreTemaClient(behandlingsreferanse).then(
            (redirectUrl) => redirectUrl && window.location.replace(redirectUrl)
          )
        );
      }
    })(event);
  };

  return (
    <VStack padding={'4'} gap={'4'}>
      <VilkårsKort heading={'Avklar tema'}>
        <form onSubmit={onSubmit}>
          <VStack gap={'6'}>
            <ServerSentEventStatusAlert status={status} />
            <FormField form={form} formField={formFields.erTemaAAP} />
            <Nesteknapp>Neste</Nesteknapp>
          </VStack>
        </form>
      </VilkårsKort>
    </VStack>
  );
};
