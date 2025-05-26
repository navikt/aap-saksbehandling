'use client';

import { Behovstype } from '../../../../../lib/utils/form';
import { useLøsBehovOgGåTilNesteSteg } from '../../../../../hooks/LøsBehovOgGåTilNesteStegHook';
import { useBehandlingsReferanse } from '../../../../../hooks/BehandlingHook';
import {
  PåklagetBehandlingGrunnlag,
  PåklagetBehandlingVurdering,
  PåklagetBehandlingVurderingLøsning,
  TypeBehandling,
} from '../../../../../lib/types/types';
import { useConfigForm } from '../../../../form/FormHook';
import { VilkårsKortMedForm } from '../../../../vilkårskort/vilkårskortmedform/VilkårsKortMedForm';
import { FormEvent } from 'react';
import { FormField } from '../../../../form/FormField';
import { BodyShort, VStack } from '@navikt/ds-react';
import { formaterDatoForFrontend } from 'lib/utils/date';

interface Props {
  behandlingVersjon: number;
  erAktivtSteg: boolean;
  typeBehandling: TypeBehandling;
  readOnly: boolean;
  grunnlag?: PåklagetBehandlingGrunnlag;
}

interface FormFields {
  påklagetBehandling: string;
}

const ARENA_VEDTAK = 'arenavedtak';

export const PåklagetBehandling = ({ behandlingVersjon, grunnlag, readOnly, erAktivtSteg }: Props) => {
  const behandlingsreferanse = useBehandlingsReferanse();

  const { løsBehovOgGåTilNesteSteg, status, løsBehovOgGåTilNesteStegError, isLoading } =
    useLøsBehovOgGåTilNesteSteg('PÅKLAGET_BEHANDLING');

  const { form, formFields } = useConfigForm<FormFields>(
    {
      påklagetBehandling: {
        type: 'combobox',
        label: 'Velg behandlingen det klages på',
        rules: { required: 'Du må velge behandlingen det klages på' },
        options: [...mapGrunnlagTilValg(grunnlag), { label: 'Arenavedtak', value: ARENA_VEDTAK }],
        defaultValue: mapDtoTilValgalternativ(grunnlag?.gjeldendeVurdering),
      },
    },
    { readOnly: readOnly }
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit((data) => {
      console.log(data);
      løsBehovOgGåTilNesteSteg({
        behandlingVersjon: behandlingVersjon,
        behov: {
          behovstype: Behovstype.FASTSETT_PÅKLAGET_BEHANDLING,
          påklagetBehandlingVurdering: mapValgTilTilDto(data.påklagetBehandling),
        },
        referanse: behandlingsreferanse,
      });
    })(event);
  };

  return (
    <VilkårsKortMedForm
      heading={'Påklaget behandling'}
      steg={'PÅKLAGET_BEHANDLING'}
      onSubmit={handleSubmit}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      visBekreftKnapp={!readOnly}
      erAktivtSteg={erAktivtSteg}
      vilkårTilhørerNavKontor={false}
      isLoading={isLoading}
      status={status}
    >
      <VStack gap={'1'}>
        <BodyShort size={'small'} weight={'semibold'}>
          Krav mottatt
        </BodyShort>
        <BodyShort size={'small'}>
          {grunnlag?.kravMottatt ? formaterDatoForFrontend(grunnlag.kravMottatt) : 'Mangler krav mottatt dato'}
        </BodyShort>
      </VStack>

      <FormField form={form} formField={formFields.påklagetBehandling} />
    </VilkårsKortMedForm>
  );
};

function mapGrunnlagTilValg(grunnlag?: PåklagetBehandlingGrunnlag) {
  return (
    grunnlag?.behandlinger.map((behandling) => ({
      value: behandling.referanse,
      label: `Vedtakstidspunkt: ${behandling.vedtakstidspunkt}`,
    })) ?? []
  );
}

function mapValgTilTilDto(valgtBehandling: string): PåklagetBehandlingVurderingLøsning {
  switch (valgtBehandling) {
    case ARENA_VEDTAK:
      return { påklagetVedtakType: 'ARENA_VEDTAK' };
    default:
      return { påklagetVedtakType: 'KELVIN_BEHANDLING', påklagetBehandling: valgtBehandling };
  }
}

function mapDtoTilValgalternativ(valgtVurdering?: PåklagetBehandlingVurdering): string {
  if (valgtVurdering == null) {
    return '';
  }
  switch (valgtVurdering.påklagetVedtakType) {
    case 'ARENA_VEDTAK':
      return ARENA_VEDTAK;
    case 'KELVIN_BEHANDLING':
      return valgtVurdering.påklagetBehandling ?? '';
  }
}
