'use client';

import { useConfigForm } from 'components/form/FormHook';
import { parse } from 'date-fns';
import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { MellomlagretVurdering, RefusjonkravVurderingResponse, RefusjonskravGrunnlag } from 'lib/types/types';
import { formaterDatoForBackend, formaterDatoForFrontend } from 'lib/utils/date';
import { Behovstype, getJaNeiEllerUndefined, JaEllerNei, JaEllerNeiOptions } from 'lib/utils/form';
import { FormEvent } from 'react';
import { useSak } from 'hooks/SakHook';
import { Button, HStack, Radio, VStack } from '@navikt/ds-react';
import { VilkårskortMedFormOgMellomlagring } from 'components/vilkårskort/vilkårskortmedformogmellomlagring/VilkårskortMedFormOgMellomlagring';
import { BodyLong, Radio } from '@navikt/ds-react';
import { RadioGroupWrapper } from 'components/form/radiogroupwrapper/RadioGroupWrapper';

import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';
import { Sak } from 'context/saksbehandling/SakContext';

import styles from './Refusjon.module.css';
import { TidligereVurderinger } from 'components/tidligerevurderinger/TidligereVurderinger';
import { RefusjonsKrav } from 'components/behandlinger/sykdom/refusjon/RefusjonsKrav';
import { ValuePair } from 'components/form/FormField';
import { useVilkårskortVisning } from 'hooks/saksbehandling/visning/VisningHook';
import { VilkårskortMedFormOgMellomlagringNyVisning } from 'components/vilkårskort/vilkårskortmedformogmellomlagringnyvisning/VilkårskortMedFormOgMellomlagringNyVisning';

interface Props {
  behandlingVersjon: number;
  readOnly: boolean;
  grunnlag: RefusjonskravGrunnlag;
  initialMellomlagretVurdering?: MellomlagretVurdering;
}

interface FormFields {
  harKrav: string;
  refusjoner: Refusjon[];
}

interface Refusjon {
  fom?: string;
  navKontor: ValuePair;
  tom?: string;
}

type DraftFormFields = Partial<FormFields>;

export const Refusjon = ({ behandlingVersjon, grunnlag, readOnly, initialMellomlagretVurdering }: Props) => {
  const { sak } = useSak();
  const behandlingsreferanse = useBehandlingsReferanse();

  const { løsBehovOgGåTilNesteSteg, isLoading, status, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('REFUSJON_KRAV');

  const { lagreMellomlagring, slettMellomlagring, nullstillMellomlagretVurdering, mellomlagretVurdering } =
    useMellomlagring(Behovstype.REFUSJON_KRAV_KODE, initialMellomlagretVurdering);

  const { visningActions, formReadOnly, visningModus } = useVilkårskortVisning(
    readOnly,
    'REFUSJON_KRAV',
    mellomlagretVurdering
  );

  const defaultValue: DraftFormFields = initialMellomlagretVurdering
    ? JSON.parse(initialMellomlagretVurdering.data)
    : mapVurderingToDraftFormFields(grunnlag, sak);

  const { form } = useConfigForm<FormFields>({
    harKrav: {
      type: 'radio',
      label: 'Har noen Nav-kontor refusjonskrav for sosialstønad?',
      defaultValue: defaultValue.harKrav,
      rules: { required: 'Du må svare på om Nav-kontoret har refusjonskrav' },
      options: JaEllerNeiOptions,
    },
    refusjoner: {
      type: 'fieldArray',
      defaultValue: defaultValue.refusjoner,
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit(
      (data) => {
        løsBehovOgGåTilNesteSteg({
          behov: {
            behovstype: Behovstype.REFUSJON_KRAV_KODE,
            refusjonkravVurderinger: data.refusjoner.map((refusjon) => ({
              harKrav: data.harKrav === JaEllerNei.Ja,
              navKontor: refusjon.navKontor.value,
              fom: refusjon.fom ? formaterDatoForBackend(parse(refusjon.fom, 'dd.MM.yyyy', new Date())) : null,
              tom: refusjon.tom ? formaterDatoForBackend(parse(refusjon.tom, 'dd.MM.yyyy', new Date())) : null,
            })),
          },
          behandlingVersjon: behandlingVersjon,
          referanse: behandlingsreferanse,
        });
      },
      () => nullstillMellomlagretVurdering()
    )(event);
  };

  enum AndreUtbetalingerYtelser {
    ØKONOMISK_SOSIALHJELP = 'ØKONOMISK_SOSIALHJELP',
    OMSORGSSTØNAD = 'OMSORGSSTØNAD',
    INTRODUKSJONSSTØNAD = 'INTRODUKSJONSSTØNAD',
    KVALIFISERINGSSTØNAD = 'KVALIFISERINGSSTØNAD',
    VERV = 'VERV',
    UTLAND = 'UTLAND',
    AFP = 'AFP',
    STIPEND = 'STIPEND',
    LÅN = 'LÅN',
    NEI = 'NEI',
  }

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  const formattedList = grunnlag.andreUtbetalingerYtelser
    ?.filter((str): str is AndreUtbetalingerYtelser =>
      Object.values(AndreUtbetalingerYtelser).includes(str as AndreUtbetalingerYtelser)
    )
    .map((str) => capitalize(str))
    .join(', ');

  const historiskeVurderinger = grunnlag.historiskeVurderinger;

  return (
    <VilkårskortMedFormOgMellomlagringNyVisning
      heading={'Sosialstønad refusjonskrav'}
      steg="REFUSJON_KRAV"
      vilkårTilhørerNavKontor={true}
      onSubmit={handleSubmit}
      status={status}
      isLoading={isLoading}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      vurdertAvAnsatt={grunnlag.gjeldendeVurderinger?.[0]?.vurdertAv}
      mellomlagretVurdering={mellomlagretVurdering}
      onLagreMellomLagringClick={() => lagreMellomlagring(form.watch())}
      onDeleteMellomlagringClick={() =>
        slettMellomlagring(() => form.reset(mapVurderingToDraftFormFields(grunnlag, sak)))
      }
      visningModus={visningModus}
      visningActions={visningActions}
      formReset={() => form.reset(mellomlagretVurdering ? JSON.parse(mellomlagretVurdering.data) : undefined)}
    >
      {!!historiskeVurderinger?.length && (
        <TidligereVurderinger data={historiskeVurderinger} buildFelter={byggFelter} />
      )}

      <BodyLong className={styles.refusjonTekstHeader}>Relevant informasjon fra søknad:</BodyLong>
      <BodyLong className={styles.refusjonKravTekst}>
        Kryss av for utbetalinger du får, eller nylig har søkt om: {formattedList}{' '}
      </BodyLong>
      <RadioGroupWrapper
        name={`harKrav`}
        control={form.control}
        label={'Er det refusjonskrav fra Nav-kontor?'}
        rules={{ required: 'Du må velge om brukeren har refusjonskrav' }}
        readOnly={formReadOnly}
        horisontal
      >
        <Radio value={JaEllerNei.Ja}>Ja</Radio>
        <Radio value={JaEllerNei.Nei}>Nei</Radio>
      </RadioGroupWrapper>

      {form.watch('harKrav') === JaEllerNei.Ja && <RefusjonsKrav form={form} readOnly={readOnly} />}
    </VilkårskortMedFormOgMellomlagring>
  );
};

function mapVurderingToDraftFormFields(grunnlag: RefusjonskravGrunnlag, sak: Sak): DraftFormFields {
  return {
    harKrav: getJaNeiEllerUndefined(grunnlag.gjeldendeVurdering?.harKrav),
    refusjoner:
      Array.isArray(grunnlag.gjeldendeVurderinger) && grunnlag.gjeldendeVurderinger.length > 0
        ? grunnlag.gjeldendeVurderinger.map((vurdering) => ({
            navKontor: {
              label: vurdering.navKontor ?? '',
              value: vurdering.navKontor ?? '',
            },
            fom: formaterDatoForFrontend(vurdering.fom ?? sak.periode.fom),
            tom: vurdering.tom != null ? formaterDatoForFrontend(vurdering.tom) : '',
          }))
        : [
            {
              navKontor: {
                label: '',
                value: '',
              },
              fom: formaterDatoForFrontend(sak.periode.fom),
              tom: '',
            },
          ],
  };
}

const byggFelter = (vurdering: RefusjonkravVurderingResponse): ValuePair[] => [
  {
    label: 'Har noen Nav-kontor refusjonskrav for sosialstønad?',
    value: vurdering.harKrav ? 'Ja' : 'Nei',
  },
  {
    label: 'Nav-kontor',
    value: vurdering.navKontor ?? '-',
  },
  {
    label: 'Refusjonen gjelder periode',
    value: `${vurdering.fom ? formaterDatoForFrontend(vurdering.fom) : 'mangler'} - ${vurdering.tom ? formaterDatoForFrontend(vurdering.tom) : 'mangler'}`,
  },
];
