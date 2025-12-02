'use client';

import { FormEvent } from 'react';

import { TrashFillIcon } from '@navikt/aksel-icons';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';

import { useFieldArray } from 'react-hook-form';
import { gyldigDatoEllerNull, validerDato } from 'lib/validation/dateValidation';
import { ArbeidsevneGrunnlag, ArbeidsevneVurdering, MellomlagretVurdering } from 'lib/types/types';
import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import { formaterDatoForBackend, formaterDatoForFrontend } from 'lib/utils/date';
import { Behovstype } from 'lib/utils/form';
import { parse } from 'date-fns';

import { Button, HStack, Link, VStack } from '@navikt/ds-react';
import { pipe } from 'lib/utils/functional';
import { erProsent } from 'lib/utils/validering';
import { useConfigForm } from 'components/form/FormHook';
import { TextAreaWrapper } from 'components/form/textareawrapper/TextAreaWrapper';
import { TextFieldWrapper } from 'components/form/textfieldwrapper/TextFieldWrapper';
import { DateInputWrapper } from 'components/form/dateinputwrapper/DateInputWrapper';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';
import { useVilkårskortVisning } from 'hooks/saksbehandling/visning/VisningHook';
import { VilkårskortPeriodisert } from 'components/vilkårskort/vilkårskortperiodisert/VilkårskortPeriodisert';
import { NyVurderingExpandableCard } from 'components/periodisering/nyvurderingexpandablecard/NyVurderingExpandableCard';
import { finnesFeilForVurdering } from 'lib/utils/formerrors';
import { TidligereVurderinger } from 'components/tidligerevurderinger/TidligereVurderinger';
import { ValuePair } from 'components/form/FormField';
import { deepEqual } from 'components/tidligerevurderinger/TidligereVurderingerUtils';

interface Props {
  grunnlag: ArbeidsevneGrunnlag;
  behandlingVersjon: number;
  readOnly: boolean;
  initialMellomlagretVurdering?: MellomlagretVurdering;
}

interface Arbeidsevnevurderinger {
  begrunnelse: string;
  arbeidsevne: string;
  fom: string;
}

interface FastsettArbeidsevneFormFields {
  arbeidsevnevurderinger: Arbeidsevnevurderinger[];
}

type DraftFormFields = Partial<FastsettArbeidsevneFormFields>;

const ANTALL_TIMER_FULL_UKE = 37.5;

const prosentTilTimer = (prosent: string): number => (Number.parseInt(prosent, 10) / 100) * ANTALL_TIMER_FULL_UKE;
const rundNedTilNaermesteHalve = (tall: number): number => Math.floor(tall * 2) / 2;
const tilNorskDesimalFormat = (tall: number): string => tall.toLocaleString('no-NB');
const tilAvrundetTimetall = pipe<string>(prosentTilTimer, rundNedTilNaermesteHalve, tilNorskDesimalFormat);

const regnOmTilTimer = (value: string) => {
  if (!value) {
    return undefined;
  }
  return `(${tilAvrundetTimetall(value)} timer)`;
};

export const FastsettArbeidsevnePeriodisertFrontend = ({
  grunnlag,
  behandlingVersjon,
  readOnly,
  initialMellomlagretVurdering,
}: Props) => {
  const behandlingsreferanse = useBehandlingsReferanse();
  const { løsBehovOgGåTilNesteSteg, isLoading, status, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('FASTSETT_ARBEIDSEVNE');

  const { mellomlagretVurdering, lagreMellomlagring, slettMellomlagring, nullstillMellomlagretVurdering } =
    useMellomlagring(Behovstype.FASTSETT_ARBEIDSEVNE_KODE, initialMellomlagretVurdering);

  const { visningActions, formReadOnly, visningModus } = useVilkårskortVisning(
    readOnly,
    'FASTSETT_ARBEIDSEVNE',
    mellomlagretVurdering
  );

  const vedtatteVurderinger = grunnlag.gjeldendeVedtatteVurderinger ?? []

  const defaultValues: DraftFormFields = initialMellomlagretVurdering
    ? JSON.parse(initialMellomlagretVurdering.data)
    : mapVurderingerToDraftFormFields(grunnlag.vurderinger);

  const { form } = useConfigForm<FastsettArbeidsevneFormFields>({
    arbeidsevnevurderinger: {
      type: 'fieldArray',
      defaultValue: defaultValues.arbeidsevnevurderinger,
    },
  });

  const {
    fields: arbeidsevneVurderinger,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: 'arbeidsevnevurderinger',
  });

  function byggFelter(vurdering: ArbeidsevneVurdering): ValuePair[] {
    return [
      {
        label: 'Vilkårsvurdering',
        value: vurdering.begrunnelse,
      },
      {
        label: 'Oppgi arbeidsevnen som ikke er utnyttet i prosent',
        value: vurdering.arbeidsevne.toString(),
      },
    ];
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit((data) => {
      løsBehovOgGåTilNesteSteg(
        {
          behandlingVersjon: behandlingVersjon,
          referanse: behandlingsreferanse,
          behov: {
            behovstype: Behovstype.FASTSETT_ARBEIDSEVNE_KODE,
            arbeidsevneVurderinger: data.arbeidsevnevurderinger.map((vurdering) => ({
              arbeidsevne: Number.parseInt(vurdering.arbeidsevne, 10),
              begrunnelse: vurdering.begrunnelse,
              fraDato: formaterDatoForBackend(parse(vurdering.fom, 'dd.MM.yyyy', new Date())),
            })),
          },
        },
        () => nullstillMellomlagretVurdering()
      );
    })(event);
  };

  const showAsOpen =
    (!!grunnlag?.vurderinger && grunnlag.vurderinger.length >= 1) || initialMellomlagretVurdering !== undefined;
  const errors =
    form.formState.errors?.arbeidsevnevurderinger && Array.isArray(form.formState.errors?.arbeidsevnevurderinger)
      ? form.formState.errors?.arbeidsevnevurderinger
      : [];
  const errorList = errors.reduce((acc, errVurdering) => {
    const errors = Object.values(errVurdering || {})
      // @ts-ignore
      .map((errField) => ({ ref: `#${errField?.ref?.name}`, message: errField?.message }))
      .filter((el) => el.message);
    return [...acc, ...errors];
  }, []);

  return (
    <VilkårskortPeriodisert
      heading={'§ 11-23 andre ledd. Arbeidsevne som ikke er utnyttet (valgfritt)'}
      steg={'FASTSETT_ARBEIDSEVNE'}
      vilkårTilhørerNavKontor={true}
      defaultOpen={showAsOpen}
      onSubmit={handleSubmit}
      status={status}
      isLoading={isLoading}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      vurdertAvAnsatt={grunnlag?.vurderinger?.[0]?.vurdertAv}
      mellomlagretVurdering={mellomlagretVurdering}
      onLagreMellomLagringClick={() => lagreMellomlagring(form.watch())}
      onDeleteMellomlagringClick={() => {
        slettMellomlagring(() => {
          form.reset(
            grunnlag.vurderinger ? mapVurderingerToDraftFormFields(grunnlag.vurderinger) : emptyDraftFormFields()
          );
        });
      }}
      visningModus={visningModus}
      visningActions={visningActions}
      formReset={() => form.reset(mellomlagretVurdering ? JSON.parse(mellomlagretVurdering.data) : undefined)}
      onLeggTilVurdering={() => append({ begrunnelse: '', arbeidsevne: '', fom: '' })}
      errorList={errorList}
    >
      {!formReadOnly && (
        <VStack paddingBlock={'4'}>
          <Link href={'https://lovdata.no/pro/rundskriv/r11-00/KAPITTEL_26-3'} target="_blank">
            Du kan lese hvordan vilkåret skal vurderes i rundskrivet til § 11-23 (lovdata.no)
          </Link>
        </VStack>
      )}
      {vedtatteVurderinger.length != 0 && (
        <TidligereVurderinger
          data={grunnlag.gjeldendeVedtatteVurderinger ?? []}
          buildFelter={byggFelter}
          getErGjeldende={(v) => deepEqual(v, vedtatteVurderinger[vedtatteVurderinger.length - 1])}
          getFomDato={(v) => v.fraDato}
        />
      )}
      {arbeidsevneVurderinger.map((vurdering, index) => (
        <NyVurderingExpandableCard
          key={vurdering.id}
          fraDato={gyldigDatoEllerNull(form.watch(`arbeidsevnevurderinger.${index}.fom`))}
          oppfylt={undefined}
          nestePeriodeFraDato={gyldigDatoEllerNull(form.watch(`arbeidsevnevurderinger.${index + 1}.fom`))}
          isLast={index === arbeidsevneVurderinger.length - 1}
          vurdertAv={undefined}
          finnesFeil={finnesFeilForVurdering(index, errorList)}
        >
          <HStack justify={'space-between'}>
            <DateInputWrapper
              control={form.control}
              name={`arbeidsevnevurderinger.${index}.fom`}
              label={'Vurderingen gjelder fra'}
              rules={{
                required: 'Du må angi datoen arbeidsevnen gjelder fra',
                validate: (value) => validerDato(value as string),
              }}
              readOnly={formReadOnly}
            />
            {!formReadOnly && (
              <Button
                aria-label="Fjern vurdering"
                variant="tertiary"
                size="small"
                icon={<TrashFillIcon />}
                loading={isLoading}
                onClick={() => remove(index)}
                type="button"
              />
            )}
          </HStack>
          <TextAreaWrapper
            label={'Vilkårsvurdering'}
            description={
              'Vurder om brukeren har en arbeidsevne som ikke er utnyttet. Hvis det ikke legges inn en vurdering, har brukeren rett på full ytelse.'
            }
            control={form.control}
            name={`arbeidsevnevurderinger.${index}.begrunnelse`}
            rules={{ required: 'Du må begrunne vurderingen din' }}
            className={'begrunnelse'}
            readOnly={formReadOnly}
          />
          <HStack gap={'3'}>
            <TextFieldWrapper
              control={form.control}
              name={`arbeidsevnevurderinger.${index}.arbeidsevne`}
              type={'text'}
              label={'Oppgi arbeidsevnen som ikke er utnyttet i prosent'}
              rules={{
                required: 'Du må angi hvor stor arbeidsevne brukeren har',
                validate: (value) => {
                  const valueAsNumber = Number(value);
                  if (isNaN(valueAsNumber)) {
                    return 'Prosent må være et tall';
                  } else if (!erProsent(valueAsNumber)) {
                    return 'Prosent kan bare være mellom 0 og 100';
                  }
                },
              }}
              readOnly={formReadOnly}
              className="prosent_input"
            />
            <VStack paddingBlock={'1'} justify={'end'}>
              {regnOmTilTimer(form.watch(`arbeidsevnevurderinger.${index}.arbeidsevne`))}
            </VStack>
          </HStack>
        </NyVurderingExpandableCard>
      ))}
    </VilkårskortPeriodisert>
  );
};

function mapVurderingerToDraftFormFields(vurderinger?: ArbeidsevneGrunnlag['vurderinger']): DraftFormFields {
  return {
    arbeidsevnevurderinger:
      vurderinger?.map((vurdering) => ({
        begrunnelse: vurdering.begrunnelse,
        arbeidsevne: vurdering.arbeidsevne.toString(),
        fom: formaterDatoForFrontend(vurdering.fraDato),
      })) || [],
  };
}

function emptyDraftFormFields(): DraftFormFields {
  return { arbeidsevnevurderinger: [] };
}
