'use client';

import { Behovstype, getJaNeiEllerUndefined, JaEllerNei, JaEllerNeiOptions } from 'lib/postmottakForm';
import { usePostmottakLøsBehovOgGåTilNesteSteg } from 'hooks/postmottak/LøsBehovOgGåTilNesteStegHook';
import { OverleveringGrunnlag } from 'lib/types/postmottakTypes';
import { FormEvent, FormEventHandler } from 'react';
import { VStack } from '@navikt/ds-react';
import { VilkårsKort } from 'components/postmottak/vilkårskort/VilkårsKort';
import { Nesteknapp } from 'components/postmottak/nesteknapp/Nesteknapp';
import { ServerSentEventStatusAlert } from 'components/postmottak/serversenteventstatusalert/ServerSentEventStatusAlert';
import { useConfigForm } from 'components/form/FormHook';
import { FormField } from 'components/form/FormField';

interface Props {
  behandlingsVersjon: number;
  behandlingsreferanse: string;
  grunnlag: OverleveringGrunnlag;
  readOnly: boolean;
}

interface FormFields {
  skalOverleveres: JaEllerNei;
}

export const Overlevering = ({ behandlingsVersjon, behandlingsreferanse, grunnlag, readOnly }: Props) => {
  const { formFields, form } = useConfigForm<FormFields>(
    {
      skalOverleveres: {
        type: 'radio',
        label: 'Skal dokumentet sendes til fagsystem?',
        description: 'Hvis dokumentet sendes til fagsystemet kan det føre til en revurdering',
        rules: { required: 'Du må svare på om dokumentet skal overleveres til fagsystem' },
        defaultValue: getJaNeiEllerUndefined(grunnlag.vurdering?.skalOverleveres),
        options: JaEllerNeiOptions,
      },
    },
    { readOnly }
  );
  const { løsBehovOgGåTilNesteSteg, status } = usePostmottakLøsBehovOgGåTilNesteSteg('OVERLEVER_TIL_FAGSYSTEM');

  const onSubmit: FormEventHandler<HTMLFormElement> = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit((data) => {
      løsBehovOgGåTilNesteSteg({
        behandlingVersjon: behandlingsVersjon,
        behov: {
          behovstype: Behovstype.AVKLAR_OVERLEVERING,
          // @ts-ignore
          skalOverleveres: data.skalOverleveres === JaEllerNei.Ja,
        },
        // @ts-ignore
        referanse: behandlingsreferanse,
      });
    })(event);
  };

  return (
    <VStack padding={'4'} gap={'4'}>
      <VilkårsKort heading={'Send dokument'}>
        <form onSubmit={onSubmit}>
          <VStack gap={'6'}>
            <ServerSentEventStatusAlert status={status} />
            <FormField form={form} formField={formFields.skalOverleveres} />
            <Nesteknapp disabled={readOnly}>Send inn</Nesteknapp>
          </VStack>
        </form>
      </VilkårsKort>
    </VStack>
  );
};
