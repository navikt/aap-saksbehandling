'use client';

import { BodyShort, ReadMore } from '@navikt/ds-react';
import { getDay, isFuture, parse, startOfDay } from 'date-fns';
import { useParamsMedType } from 'hooks/saksbehandling/BehandlingHook';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';
import { useVilkårskortVisning } from 'hooks/saksbehandling/visning/VisningHook';
import { MellomlagretVurdering, MigreringsdatoGrunnlag } from 'lib/types/types';
import { formaterDatoForBackend, formaterDatoForFrontend } from 'lib/utils/date';
import { Behovstype } from 'lib/utils/form';
import { validerDato } from 'lib/validation/dateValidation';
import { SubmitEventHandler } from 'react';

import { FormField } from 'components/form/FormField';
import { useConfigForm } from 'components/form/FormHook';
import { VilkårskortMedFormOgMellomlagring } from 'components/vilkårskort/vilkårskortmedformogmellomlagring/VilkårskortMedFormOgMellomlagring';

interface Props {
  behandlingsversjon: number;
  grunnlag: MigreringsdatoGrunnlag;
  readOnly: boolean;
  initialMellomlagretVurdering?: MellomlagretVurdering;
}

interface FormFields {
  migreringsdato: string;
}

type DraftFormFields = Partial<FormFields>;

export const MigreringstidspunktVurdering = ({
  behandlingsversjon,
  grunnlag,
  readOnly,
  initialMellomlagretVurdering,
}: Props) => {
  const { behandlingsreferanse } = useParamsMedType();
  const { løsBehovOgGåTilNesteSteg, isLoading, status, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('AVKLAR_MIGRERINGSDATO');

  const { visningActions, visningModus, formReadOnly } = useVilkårskortVisning(
    readOnly,
    'AVKLAR_MIGRERINGSDATO',
    initialMellomlagretVurdering
  );

  const defaultValues: DraftFormFields = initialMellomlagretVurdering
    ? JSON.parse(initialMellomlagretVurdering.data)
    : mapVurderingToDraftFormFields(grunnlag.vurdering);

  const { form, formFields } = useConfigForm<FormFields>(
    {
      migreringsdato: {
        type: 'date_input',
        label: 'Saken migreres fra og med',
        rules: {
          required: 'Du må sette en migreringsdato',
          validate: {
            gyldigDato: (v) => validerDato(v),
            erIFortiden: (v) => {
              if (!v) return;
              const dato = parse(v, 'dd.MM.yyyy', new Date());
              if (isFuture(startOfDay(dato))) {
                return 'Migreringsdatoen kan ikke være i fremtiden';
              }
            },
            erMandag: (v) => {
              if (!v) return;
              const dato = parse(v, 'dd.MM.yyyy', new Date());
              if (getDay(dato) !== 1) {
                return 'Migreringsdatoen må være en mandag';
              }
            },
          },
        },
        defaultValue: defaultValues.migreringsdato,
      },
    },
    { readOnly: formReadOnly }
  );

  const { slettMellomlagring, mellomlagretVurdering, nullstillMellomlagretVurdering } = useMellomlagring(
    Behovstype.AVKLAR_MIGRERINGSDATO,
    initialMellomlagretVurdering,
    form
  );

  const handleSubmit: SubmitEventHandler = (event) => {
    form.handleSubmit((data) => {
      løsBehovOgGåTilNesteSteg(
        {
          behandlingVersjon: behandlingsversjon,
          behov: {
            behovstype: Behovstype.AVKLAR_MIGRERINGSDATO,
            migreringsdato: formaterDatoForBackend(parse(data.migreringsdato, 'dd.MM.yyyy', new Date())),
          },
          referanse: behandlingsreferanse,
        },
        () => {
          visningActions.onBekreftClick();
          nullstillMellomlagretVurdering();
        }
      );
    })(event);
  };

  return (
    <VilkårskortMedFormOgMellomlagring
      heading={'Sett migreringstidspunkt'}
      steg={'AVKLAR_MIGRERINGSDATO'}
      onSubmit={handleSubmit}
      status={status}
      isLoading={isLoading}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      vilkårTilhørerNavKontor={false}
      vurderingerMeta={grunnlag.vurdering?.vurderingerMeta}
      mellomlagretVurdering={mellomlagretVurdering}
      onDeleteMellomlagringClick={() => {
        slettMellomlagring(() =>
          form.reset(grunnlag.vurdering ? mapVurderingToDraftFormFields(grunnlag.vurdering) : emptyDraftFormFields())
        );
      }}
      visningModus={visningModus}
      visningActions={visningActions}
      formReset={() => {
        mellomlagretVurdering
          ? JSON.parse(mellomlagretVurdering.data)
          : mapVurderingToDraftFormFields(grunnlag.vurdering);
      }}
    >
      <ReadMore size={'small'} header={'Slik settes migreringstidspunktet'}>
        <BodyShort size={'small'}>
          Migreringstidspunktet skal alltid være første mandag i inneværende meldeperiode.
        </BodyShort>
      </ReadMore>
      <FormField form={form} formField={formFields.migreringsdato} />
    </VilkårskortMedFormOgMellomlagring>
  );
};

function mapVurderingToDraftFormFields(vurdering: MigreringsdatoGrunnlag['vurdering']): DraftFormFields {
  return {
    migreringsdato: (vurdering?.migreringsdato && formaterDatoForFrontend(vurdering.migreringsdato)) || undefined,
  };
}

function emptyDraftFormFields(): DraftFormFields {
  return {
    migreringsdato: '',
  };
}
