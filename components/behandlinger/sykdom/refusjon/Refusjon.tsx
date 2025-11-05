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
import { BodyLong, Radio } from '@navikt/ds-react';
import { RadioGroupWrapper } from 'components/form/radiogroupwrapper/RadioGroupWrapper';

import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';
import { Sak } from 'context/saksbehandling/SakContext';

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

export interface FormFields {
  harKrav: string;
  refusjoner: Refusjon[];
}

export interface Refusjon {
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
    GODGJØRELSE_ELLER_LØNN_FRA_VERV = 'GODGJØRELSE_ELLER_LØNN_FRA_VERV',
    YTELSE_FRA_UTENLANDSKE_TRYGDEMYNDIGHETER = 'YTELSE_FRA_UTENLANDSKE_TRYGDEMYNDIGHETER',
    AFP = 'AFP',
    STIPEND_FRA_LÅNEKASSEN = 'STIPEND_FRA_LÅNEKASSEN',
    LÅN_FRA_LÅNEKASSEN = 'LÅN_FRA_LÅNEKASSEN',
    INGEN_AV_DISSE = 'INGEN_AV_DISSE',
  }
  const AndreUtbetalingerYtelserLabels: Record<AndreUtbetalingerYtelser, string> = {
    [AndreUtbetalingerYtelser.ØKONOMISK_SOSIALHJELP]: 'Økonomisk sosialhjelp',
    [AndreUtbetalingerYtelser.OMSORGSSTØNAD]: 'Omsorgsstønad',
    [AndreUtbetalingerYtelser.INTRODUKSJONSSTØNAD]: 'Introduksjonsstønad',
    [AndreUtbetalingerYtelser.KVALIFISERINGSSTØNAD]: 'Kvalifiseringsstønad',
    [AndreUtbetalingerYtelser.GODGJØRELSE_ELLER_LØNN_FRA_VERV]: 'Godtgjørelse eller lønn for verv',
    [AndreUtbetalingerYtelser.YTELSE_FRA_UTENLANDSKE_TRYGDEMYNDIGHETER]: 'Ytelser fra utenlandske trygdemyndigheter',
    [AndreUtbetalingerYtelser.AFP]: 'AFP',
    [AndreUtbetalingerYtelser.STIPEND_FRA_LÅNEKASSEN]: 'Sykestipend fra Lånekassen',
    [AndreUtbetalingerYtelser.LÅN_FRA_LÅNEKASSEN]: 'Lån fra Lånekassen',
    [AndreUtbetalingerYtelser.INGEN_AV_DISSE]: 'Ingen av Disse',
  };

  const formattedList =
    grunnlag.andreUtbetalingerYtelser
      ?.filter((str): str is AndreUtbetalingerYtelser => str in AndreUtbetalingerYtelserLabels)
      .map((str) => AndreUtbetalingerYtelserLabels[str])
      .join(', ') || 'Ingen utbetalinger krysset av';

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
      <BodyLong spacing={true}>
        <BodyLong weight={'semibold'} size={'small'}>
          Relevant informasjon fra søknad:
        </BodyLong>
        <BodyLong size={'small'} textColor={'subtle'}>
          Kryss av for utbetalinger du får, eller nylig har søkt om: {formattedList}
        </BodyLong>
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
      {form.watch('harKrav') === JaEllerNei.Ja && <RefusjonsKrav sak={sak} form={form} readOnly={readOnly} />}
    </VilkårskortMedFormOgMellomlagringNyVisning>
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
