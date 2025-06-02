'use client';

import { Behovstype, getJaNeiEllerUndefined, JaEllerNei, JaEllerNeiOptions } from 'lib/postmottakForm';
import { usePostmottakLøsBehovOgGåTilNesteSteg } from 'hooks/postmottak/PostmottakLøsBehovOgGåTilNesteStegHook';
import { OverleveringGrunnlag } from 'lib/types/postmottakTypes';
import { FormEvent, FormEventHandler } from 'react';
import { Button, VStack } from '@navikt/ds-react';
import { VilkårsKort } from 'components/postmottak/vilkårskort/VilkårsKort';
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
  const { løsBehovOgGåTilNesteSteg, status, isLoading } =
    usePostmottakLøsBehovOgGåTilNesteSteg('OVERLEVER_TIL_FAGSYSTEM');

  const onSubmit: FormEventHandler<HTMLFormElement> = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit((data) => {
      løsBehovOgGåTilNesteSteg({
        behandlingVersjon: behandlingsVersjon,
        behov: {
          behovstype: Behovstype.AVKLAR_OVERLEVERING,
          skalOverleveres: data.skalOverleveres === JaEllerNei.Ja,
        },
        // @ts-ignore
        referanse: behandlingsreferanse,
      });
    })(event);
  };

  return (
    <VilkårsKort heading={'Send dokument'}>
      <form onSubmit={onSubmit}>
        <VStack gap={'6'}>
          <ServerSentEventStatusAlert status={status} />
          <FormField form={form} formField={formFields.skalOverleveres} />
          {!readOnly && (
            <Button loading={isLoading} className={'fit-content'}>
              Send inn
            </Button>
          )}
        </VStack>
      </form>
    </VilkårsKort>
  );
};
