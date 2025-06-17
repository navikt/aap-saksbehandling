'use client';

import { BehandlendeEnhetGrunnlag, TypeBehandling } from 'lib/types/types';
import { useBehandlingsReferanse } from 'hooks/BehandlingHook';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { useConfigForm } from 'components/form/FormHook';
import { FormEvent } from 'react';
import { VilkårsKortMedForm } from 'components/vilkårskort/vilkårskortmedform/VilkårsKortMedForm';
import { FormField } from 'components/form/FormField';
import { Behovstype } from 'lib/utils/form';

interface Props {
  grunnlag?: BehandlendeEnhetGrunnlag;
  behandlingVersjon: number;
  typeBehandling: TypeBehandling;
  readOnly: boolean;
}

interface FormFields {
  hvemSkalBehandle: string;
}

export const BehandlendeEnhet = ({ behandlingVersjon, grunnlag, readOnly }: Props) => {
  const behandlingsreferanse = useBehandlingsReferanse();

  const { løsBehovOgGåTilNesteSteg, status, isLoading, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('BEHANDLENDE_ENHET');

  const { formFields, form } = useConfigForm<FormFields>(
    {
      hvemSkalBehandle: {
        type: 'radio',
        label: 'Hvem skal vurdere vilkårene det er klaget på?',
        rules: { required: 'Du må svare på hvem som skal vurdere vilkårene' },
        options: [
          { label: 'Nav-kontor', value: Valg.NAV_KONTOR },
          { label: 'NAY', value: Valg.NAY },
          { label: 'Begge', value: Valg.BEGGE },
        ],
        defaultValue: finnValgFraGrunnlag(grunnlag),
      },
    },
    { readOnly }
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit((data) => {
      løsBehovOgGåTilNesteSteg({
        behandlingVersjon: behandlingVersjon,
        behov: {
          behovstype: Behovstype.FASTSETT_BEHANDLENDE_ENHET,
          behandlendeEnhetVurdering: mapValgTilTilDto(data.hvemSkalBehandle),
        },
        referanse: behandlingsreferanse,
      });
    })(event);
  };

  return (
    <VilkårsKortMedForm
      heading={'Klagebehandlende enhet'}
      steg={'BEHANDLENDE_ENHET'}
      onSubmit={handleSubmit}
      vilkårTilhørerNavKontor={false}
      status={status}
      isLoading={isLoading}
      visBekreftKnapp={!readOnly}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
    >
      <FormField form={form} formField={formFields.hvemSkalBehandle} />
    </VilkårsKortMedForm>
  );
};

enum Valg {
  NAV_KONTOR = 'NAV_KONTOR',
  NAY = 'NAY',
  BEGGE = 'BEGGE',
}

function finnValgFraGrunnlag(grunnlag?: BehandlendeEnhetGrunnlag): string | undefined {
  if (grunnlag?.vurdering?.skalBehandlesAvKontor && grunnlag.vurdering?.skalBehandlesAvNay) {
    return Valg.BEGGE;
  } else if (grunnlag?.vurdering?.skalBehandlesAvKontor) {
    return Valg.NAV_KONTOR;
  }
  if (grunnlag?.vurdering?.skalBehandlesAvNay) {
    return Valg.NAY;
  }
  return undefined;
}

function mapValgTilTilDto(valgtBehandling: string) {
  switch (valgtBehandling) {
    case Valg.NAV_KONTOR:
      return { skalBehandlesAvKontor: true, skalBehandlesAvNay: false };
    case Valg.NAY:
      return { skalBehandlesAvKontor: false, skalBehandlesAvNay: true };
    case Valg.BEGGE:
      return { skalBehandlesAvKontor: true, skalBehandlesAvNay: true };
    default:
      return { skalBehandlesAvKontor: false, skalBehandlesAvNay: false };
  }
}
