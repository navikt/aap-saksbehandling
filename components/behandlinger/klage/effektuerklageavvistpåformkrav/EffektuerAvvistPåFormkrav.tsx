'use client';

import { EffektuerAvvistPåFormkravGrunnlag } from 'lib/types/types';
import { formaterDatoForFrontend } from 'lib/utils/date';

import { VilkårsKortMedForm } from 'components/vilkårskort/vilkårskortmedform/VilkårsKortMedForm';
import { Behovstype, JaEllerNei, JaEllerNeiOptions } from 'lib/utils/form';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { useConfigForm } from 'components/form/FormHook';
import { getJaNeiEllerUndefined } from 'lib/postmottakForm';
import { BodyShort, VStack } from '@navikt/ds-react';
import { FormField } from 'components/form/FormField';
import { useBehandlingsReferanse } from 'hooks/BehandlingHook';
import { FormEvent } from 'react';

interface Props {
  grunnlag?: EffektuerAvvistPåFormkravGrunnlag;
  behandlingVersjon: number;
  readOnly?: boolean; // ikke i bruk, kun midlertidig
}

interface FormFields {
  skalEndeligAvvises: JaEllerNei;
}

export const EffektuerAvvistPåFormkrav = ({ grunnlag, behandlingVersjon, readOnly }: Props) => {
  const behandlingsreferanse = useBehandlingsReferanse();
  const { løsBehovOgGåTilNesteSteg, isLoading, status, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('EFFEKTUER_AVVIST_PÅ_FORMKRAV');
  const { form, formFields } = useConfigForm<FormFields>(
    {
      skalEndeligAvvises: {
        type: 'radio',
        label: 'Skal klagen endelig avvises på formkrav?',
        options: JaEllerNeiOptions,
        defaultValue: getJaNeiEllerUndefined(grunnlag?.vurdering?.skalEndeligAvvises),
        rules: { required: 'Du må svare på om klagen skal endelig avvises på formkrav' },
      },
    },
    { readOnly: readOnly }
  );

  const endeligAvvisesValg = form.watch('skalEndeligAvvises');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit((data) => {
      løsBehovOgGåTilNesteSteg({
        behandlingVersjon: behandlingVersjon,
        behov: {
          behovstype: Behovstype.EFFEKTUER_AVVIST_PÅ_FORMKRAV_KODE,
          effektuerAvvistPåFormkravVurdering: { skalEndeligAvvises: data.skalEndeligAvvises == JaEllerNei.Ja },
        },
        referanse: behandlingsreferanse,
      });
    })(event);
  };

  if (!grunnlag) {
    return;
  }

  const skalViseBekreftKnapp = endeligAvvisesValg !== undefined;

  return (
    <VilkårsKortMedForm
      steg={'EFFEKTUER_AVVIST_PÅ_FORMKRAV'}
      heading={'Effektuer avvist på formkrav'}
      vilkårTilhørerNavKontor={false}
      onSubmit={handleSubmit}
      status={status}
      isLoading={isLoading}
      visBekreftKnapp={skalViseBekreftKnapp} // OIST ignorerer flagg fra backend midlertidig
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
    >
      <VStack gap={'4'}>
        <BodyShort>
          {grunnlag.varsel?.brevFerdigstilt
            ? `Forhåndsvarsel sendt: ${formaterDatoForFrontend(grunnlag.varsel.brevFerdigstilt)}`
            : 'Forhåndsvarsel er ikke sendt. Vennligst fullfør brevet.'}
        </BodyShort>
        <BodyShort>
          {grunnlag.varsel?.frist && `Frist for svar: ${formaterDatoForFrontend(grunnlag.varsel.frist)}`}
        </BodyShort>
        {grunnlag.varsel?.brevFerdigstilt && <FormField form={form} formField={formFields.skalEndeligAvvises} />}
      </VStack>
    </VilkårsKortMedForm>
  );
};
