'use client';

import { BehandlendeEnhetGrunnlag, MellomlagretVurdering, TypeBehandling } from 'lib/types/types';
import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { useConfigForm } from 'components/form/FormHook';
import { FormEvent } from 'react';
import { FormField } from 'components/form/FormField';
import { Behovstype } from 'lib/utils/form';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';
import { useVilkårskortVisning } from 'hooks/saksbehandling/visning/VisningHook';
import { VilkårskortMedFormOgMellomlagringNyVisning } from 'components/vilkårskort/vilkårskortmedformogmellomlagringnyvisning/VilkårskortMedFormOgMellomlagringNyVisning';

interface Props {
  grunnlag?: BehandlendeEnhetGrunnlag;
  behandlingVersjon: number;
  typeBehandling: TypeBehandling;
  readOnly: boolean;
  initialMellomlagretVurdering?: MellomlagretVurdering;
}

interface FormFields {
  hvemSkalBehandle: string;
}

type DraftFormFields = Partial<FormFields>;

export const BehandlendeEnhet = ({ behandlingVersjon, grunnlag, readOnly, initialMellomlagretVurdering }: Props) => {
  const behandlingsreferanse = useBehandlingsReferanse();

  const { løsBehovOgGåTilNesteSteg, status, isLoading, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('BEHANDLENDE_ENHET');

  const { lagreMellomlagring, slettMellomlagring, nullstillMellomlagretVurdering, mellomlagretVurdering } =
    useMellomlagring(Behovstype.FASTSETT_BEHANDLENDE_ENHET, initialMellomlagretVurdering);

  const { visningActions, formReadOnly, visningModus } = useVilkårskortVisning(
    readOnly,
    'BEHANDLENDE_ENHET',
    mellomlagretVurdering
  );

  const defaultValue: DraftFormFields = initialMellomlagretVurdering
    ? JSON.parse(initialMellomlagretVurdering.data)
    : mapVurderingToDraftFormFields(grunnlag);

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
        defaultValue: defaultValue.hvemSkalBehandle,
      },
    },
    { readOnly: formReadOnly }
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit(
      (data) => {
        løsBehovOgGåTilNesteSteg({
          behandlingVersjon: behandlingVersjon,
          behov: {
            behovstype: Behovstype.FASTSETT_BEHANDLENDE_ENHET,
            behandlendeEnhetVurdering: mapValgTilBehandlendeEnhetVurdering(data.hvemSkalBehandle),
          },
          referanse: behandlingsreferanse,
        });
      },
      () => nullstillMellomlagretVurdering()
    )(event);
  };

  return (
    <VilkårskortMedFormOgMellomlagringNyVisning
      heading={'Klagebehandlende enhet'}
      steg={'BEHANDLENDE_ENHET'}
      onSubmit={handleSubmit}
      vilkårTilhørerNavKontor={false}
      status={status}
      isLoading={isLoading}
      visBekreftKnapp={!readOnly}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      vurdertAvAnsatt={grunnlag?.vurdering?.vurdertAv}
      mellomlagretVurdering={mellomlagretVurdering}
      readOnly={readOnly}
      onLagreMellomLagringClick={() => lagreMellomlagring(form.watch())}
      onDeleteMellomlagringClick={() =>
        slettMellomlagring(() =>
          form.reset(grunnlag?.vurdering ? mapVurderingToDraftFormFields(grunnlag) : emptyDraftFormFields())
        )
      }
      visningModus={visningModus}
      visningActions={visningActions}
      formReset={() => form.reset(mellomlagretVurdering ? JSON.parse(mellomlagretVurdering.data) : undefined)}
    >
      <FormField form={form} formField={formFields.hvemSkalBehandle} />
    </VilkårskortMedFormOgMellomlagringNyVisning>
  );
};

function mapVurderingToDraftFormFields(grunnlag?: BehandlendeEnhetGrunnlag): DraftFormFields {
  return {
    hvemSkalBehandle: finnValgFraGrunnlag(grunnlag),
  };
}

function emptyDraftFormFields(): DraftFormFields {
  return {
    hvemSkalBehandle: '',
  };
}

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

function mapValgTilBehandlendeEnhetVurdering(valgtBehandling: string) {
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
