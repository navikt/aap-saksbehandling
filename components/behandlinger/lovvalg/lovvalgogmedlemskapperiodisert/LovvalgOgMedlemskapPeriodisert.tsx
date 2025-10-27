'use client';

import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { Behovstype } from 'lib/utils/form';
import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import {
  LøsPeriodisertBehovPåBehandling,
  MellomlagretVurdering,
  PeriodisertLovvalgMedlemskapGrunnlag,
} from 'lib/types/types';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';
import { VilkårskortMedFormOgMellomlagringNyVisning } from 'components/vilkårskort/vilkårskortmedformogmellomlagringnyvisning/VilkårskortMedFormOgMellomlagringNyVisning';
import { useVilkårskortVisning } from 'hooks/saksbehandling/visning/VisningHook';
import { useFieldArray, useForm } from 'react-hook-form';
import { LovOgMedlemskapVurderingForm } from 'components/behandlinger/lovvalg/lovvalgogmedlemskapperiodisert/types';
import {
  getDefaultValuesFromGrunnlag,
  mapFormTilDto,
} from 'components/behandlinger/lovvalg/lovvalgogmedlemskapperiodisert/lovvalg-utils';
import { Button, VStack } from '@navikt/ds-react';
import { CustomExpandableCard } from 'components/customexpandablecard/CustomExpandableCard';
import { parseISO } from 'date-fns';
import { parseDatoFraDatePicker } from 'lib/utils/date';
import {
  NyPeriodeHeading,
  TidligerePeriodeHeading,
} from 'components/behandlinger/lovvalg/lovvalgogmedlemskapperiodisert/PeriodeHeading';
import { VurdertAv } from 'components/behandlinger/lovvalg/lovvalgogmedlemskapperiodisert/VurdertAv';
import { LovvalgOgMedlemskapFormInput } from 'components/behandlinger/lovvalg/lovvalgogmedlemskapperiodisert/LovvalgOgMedlemskapFormInput';
import { LovvalgOgMedlemskapTidligereVurdering } from 'components/behandlinger/lovvalg/lovvalgogmedlemskapperiodisert/LovvalgOgMedlemskapTidligereVurdering';
import { PlusIcon } from '@navikt/aksel-icons';

interface Props {
  behandlingVersjon: number;
  readOnly: boolean;
  grunnlag?: PeriodisertLovvalgMedlemskapGrunnlag;
  overstyring: boolean;
  initialMellomlagretVurdering?: MellomlagretVurdering;
  behovstype: Behovstype;
}

export const LovvalgOgMedlemskapPeriodisert = ({
  grunnlag,
  readOnly,
  behandlingVersjon,
  overstyring,
  initialMellomlagretVurdering,
  behovstype,
}: Props) => {
  const behandlingsReferanse = useBehandlingsReferanse();
  const { løsPeriodisertBehovOgGåTilNesteSteg, status, løsBehovOgGåTilNesteStegError, isLoading } =
    useLøsBehovOgGåTilNesteSteg('VURDER_LOVVALG');

  const { lagreMellomlagring, slettMellomlagring, mellomlagretVurdering, nullstillMellomlagretVurdering } =
    useMellomlagring(Behovstype.AVKLAR_LOVVALG_MEDLEMSKAP, initialMellomlagretVurdering);

  const { visningActions, formReadOnly, visningModus } = useVilkårskortVisning(
    readOnly,
    'VURDER_LOVVALG',
    mellomlagretVurdering
  );

  const defaultValues =
    mellomlagretVurdering != null
      ? (JSON.parse(mellomlagretVurdering.data) as LovOgMedlemskapVurderingForm)
      : getDefaultValuesFromGrunnlag(grunnlag);

  const form = useForm<LovOgMedlemskapVurderingForm>({
    defaultValues,
    reValidateMode: 'onChange',
  });

  const { fields: vurderingerFields, append, remove } = useFieldArray({ control: form.control, name: 'vurderinger' });

  function onAddPeriode() {
    append({
      begrunnelse: '',
      lovvalg: {
        begrunnelse: '',
        lovvalgsEØSLand: 'NOR',
      },
      medlemskap: undefined,
      fraDato: undefined,
    });
  }

  function onSubmit(data: LovOgMedlemskapVurderingForm) {
    const losning: LøsPeriodisertBehovPåBehandling = {
      behandlingVersjon: behandlingVersjon,
      referanse: behandlingsReferanse,

      behov: {
        behovstype: behovstype,
        løsningerForPerioder: data.vurderinger.map((periode, index) => {
          const isLast = index === data.vurderinger.length - 1;
          const tilDato = isLast ? undefined : data.vurderinger[index + 1].fraDato;
          return mapFormTilDto(periode, tilDato);
        }),
      },
    };

    løsPeriodisertBehovOgGåTilNesteSteg(losning, () => {
      nullstillMellomlagretVurdering();
    });
  }

  const heading = overstyring ? 'Overstyring av lovvalg og medlemskap' : 'Lovvalg og medlemskap';

  const tidligereVurderinger = grunnlag?.sisteVedtatteVurderinger ?? [];
  const vedtatteVurderinger = grunnlag?.sisteVedtatteVurderinger ?? [];
  const foersteNyePeriode = vurderingerFields.length > 0 ? form.watch('vurderinger.0.fraDato') : null;

  return (
    <VilkårskortMedFormOgMellomlagringNyVisning
      heading={heading}
      steg={'VURDER_LOVVALG'}
      onSubmit={form.handleSubmit(onSubmit)}
      visBekreftKnapp={!readOnly}
      isLoading={isLoading}
      status={status}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      vilkårTilhørerNavKontor={false}
      mellomlagretVurdering={mellomlagretVurdering}
      onLagreMellomLagringClick={() => lagreMellomlagring({ ...form.watch(), overstyring })}
      onDeleteMellomlagringClick={() => slettMellomlagring(() => form.reset())}
      readOnly={readOnly}
      visningModus={visningModus}
      visningActions={visningActions}
      extraActions={
        <Button variant={'secondary'} icon={<PlusIcon />} onClick={onAddPeriode} type="button">
          Legg til ny vurdering
        </Button>
      }
    >
      <VStack gap="8">
        <VStack gap="2">
          {vedtatteVurderinger.map((vurdering) => (
            <CustomExpandableCard
              key={vurdering.fom}
              editable={false}
              defaultOpen={false}
              heading={
                <TidligerePeriodeHeading
                  fom={parseISO(vurdering.fom)}
                  tom={vurdering.tom != null ? parseISO(vurdering.tom) : null}
                  foersteNyePeriode={foersteNyePeriode != null ? parseDatoFraDatePicker(foersteNyePeriode) : null}
                  oppfylt={
                    vurdering.lovvalg.lovvalgsEØSLand === 'NOR' && vurdering.medlemskap?.varMedlemIFolketrygd === true
                  }
                />
              }
            >
              <>
                <LovvalgOgMedlemskapTidligereVurdering vurdering={vurdering} />
                {vurdering.vurdertAv != null && (
                  <VurdertAv
                    navn={vurdering.vurdertAv.ansattnavn}
                    ident={vurdering.vurdertAv.ident}
                    dato={vurdering.vurdertAv.dato}
                  />
                )}
              </>
            </CustomExpandableCard>
          ))}
          {vurderingerFields.map((vurdering, index) => (
            <CustomExpandableCard
              key={vurdering.id}
              editable
              defaultOpen
              heading={<NyPeriodeHeading form={form} index={index} isLast={index === vurderingerFields.length - 1} />}
            >
              <>
                <LovvalgOgMedlemskapFormInput
                  form={form}
                  readOnly={formReadOnly}
                  index={index}
                  harTidligereVurderinger={tidligereVurderinger.length !== 0}
                  onRemove={() => remove(index)}
                  visningModus={visningModus}
                />
                {vurdering.vurdertAv != null && (
                  <VurdertAv
                    navn={vurdering.vurdertAv.navn}
                    ident={vurdering.vurdertAv.ident}
                    dato={vurdering.vurdertAv.dato}
                  />
                )}
              </>
            </CustomExpandableCard>
          ))}
        </VStack>
      </VStack>
    </VilkårskortMedFormOgMellomlagringNyVisning>
  );
};
