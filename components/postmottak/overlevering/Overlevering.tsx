'use client';

import { Behovstype, getJaNeiEllerUndefined, JaEllerNei, JaEllerNeiOptions } from 'lib/postmottakForm';
import { usePostmottakLøsBehovOgGåTilNesteSteg } from 'hooks/postmottak/PostmottakLøsBehovOgGåTilNesteStegHook';
import { OverleveringGrunnlag } from 'lib/types/postmottakTypes';
import { SubmitEventHandler } from 'react';
import { VStack } from '@navikt/ds-react';
import { ServerSentEventStatusAlert } from 'components/postmottak/serversenteventstatusalert/ServerSentEventStatusAlert';
import { useConfigForm } from 'components/form/FormHook';
import { FormField } from 'components/form/FormField';
import { PostmottakVilkårskort } from 'components/postmottak/vilkårskort/PostmottakVilkårskort';
import { usePostmottakVilkårskortVisning } from 'hooks/postmottak/PostmottakVisningHook';

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
        label: 'Bør saken vurderes på nytt på bakgrunn av dokumentet?',
        description: 'Velger du "Ja" kan det føre til en ny vurdering/revurdering.',
        rules: { required: 'Du må svare på om dokumentet skal overleveres til fagsystem' },
        defaultValue: getJaNeiEllerUndefined(grunnlag.vurdering?.skalOverleveres),
        options: JaEllerNeiOptions,
      },
    },
    { readOnly }
  );

  const { løsBehovOgGåTilNesteSteg, status, isLoading, løsBehovOgGåTilNesteStegError } =
    usePostmottakLøsBehovOgGåTilNesteSteg('OVERLEVER_TIL_FAGSYSTEM');

  const { visningActions, visningModus } = usePostmottakVilkårskortVisning(readOnly, 'OVERLEVER_TIL_FAGSYSTEM');

  const onSubmit: SubmitEventHandler = (event) => {
    form.handleSubmit((data) => {
      løsBehovOgGåTilNesteSteg({
        behandlingVersjon: behandlingsVersjon,
        behov: {
          behovstype: Behovstype.AVKLAR_OVERLEVERING,
          skalOverleveres: data.skalOverleveres === JaEllerNei.Ja,
        },
        referanse: behandlingsreferanse,
      });
    })(event);
  };

  return (
    <PostmottakVilkårskort
      heading={'Send dokument'}
      steg={'OVERLEVER_TIL_FAGSYSTEM'}
      onSubmit={onSubmit}
      isLoading={isLoading}
      status={status}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      knappTekst={'Send inn'}
      visningModus={visningModus}
      visningActions={visningActions}
      formReset={() => {}}
    >
      <VStack gap={'space-24'}>
        <ServerSentEventStatusAlert status={status} />
        <FormField form={form} formField={formFields.skalOverleveres} />
      </VStack>
    </PostmottakVilkårskort>
  );
};
