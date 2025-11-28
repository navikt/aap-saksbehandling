'use client';

import { TrashFillIcon } from '@navikt/aksel-icons';
import { Button, HStack, Link, Radio, VStack } from '@navikt/ds-react';
import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { FritakMeldepliktGrunnlag, MellomlagretVurdering } from 'lib/types/types';
import { Behovstype, JaEllerNei } from 'lib/utils/form';
import { gyldigDatoEllerNull, validerDato } from 'lib/validation/dateValidation';
import { FormEvent } from 'react';
import { useFieldArray } from 'react-hook-form';
import { RadioGroupWrapper } from 'components/form/radiogroupwrapper/RadioGroupWrapper';

import { formaterDatoForBackend, formaterDatoForFrontend } from 'lib/utils/date';
import { parse } from 'date-fns';
import { useConfigForm } from 'components/form/FormHook';
import { DateInputWrapper } from 'components/form/dateinputwrapper/DateInputWrapper';
import { TextAreaWrapper } from 'components/form/textareawrapper/TextAreaWrapper';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';
import { useVilkårskortVisning } from 'hooks/saksbehandling/visning/VisningHook';
import { VilkårskortPeriodisert } from 'components/vilkårskort/vilkårskortperiodisert/VilkårskortPeriodisert';
import { finnesFeilForVurdering } from 'lib/utils/formerrors';
import { NyVurderingExpandableCard } from 'components/periodisering/nyvurderingexpandablecard/NyVurderingExpandableCard';

interface Props {
  behandlingVersjon: number;
  grunnlag?: FritakMeldepliktGrunnlag;
  readOnly: boolean;
  initialMellomlagretVurdering?: MellomlagretVurdering;
}

interface Fritaksvurderinger {
  begrunnelse: string;
  harFritak: string;
  fraDato: string;
}

interface FritakMeldepliktFormFields {
  fritaksvurderinger: Fritaksvurderinger[];
}

type DraftFormFields = Partial<FritakMeldepliktFormFields>;

export const MeldepliktPeriodisertFrontend = ({
  behandlingVersjon,
  grunnlag,
  readOnly,
  initialMellomlagretVurdering,
}: Props) => {
  const defaultValues: DraftFormFields = initialMellomlagretVurdering
    ? JSON.parse(initialMellomlagretVurdering.data)
    : mapVurderingToDraftFormFields(grunnlag?.vurderinger);

  const { form } = useConfigForm<FritakMeldepliktFormFields>({
    fritaksvurderinger: {
      type: 'fieldArray',
      defaultValue: defaultValues.fritaksvurderinger,
    },
  });

  const {
    fields: fritakMeldepliktVurderinger,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: 'fritaksvurderinger',
  });

  const behandlingsreferanse = useBehandlingsReferanse();

  const { løsBehovOgGåTilNesteSteg, isLoading, status, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('FRITAK_MELDEPLIKT');

  const { mellomlagretVurdering, nullstillMellomlagretVurdering, lagreMellomlagring, slettMellomlagring } =
    useMellomlagring(Behovstype.FRITAK_MELDEPLIKT_KODE, initialMellomlagretVurdering);

  const { visningActions, formReadOnly, visningModus } = useVilkårskortVisning(
    readOnly,
    'FRITAK_MELDEPLIKT',
    mellomlagretVurdering
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit((data) => {
      løsBehovOgGåTilNesteSteg(
        {
          behandlingVersjon: behandlingVersjon,
          referanse: behandlingsreferanse,
          behov: {
            behovstype: Behovstype.FRITAK_MELDEPLIKT_KODE,
            fritaksvurderinger: data.fritaksvurderinger.map((periode) => ({
              begrunnelse: periode.begrunnelse,
              harFritak: periode.harFritak === JaEllerNei.Ja,
              fraDato: formaterDatoForBackend(parse(periode.fraDato, 'dd.MM.yyyy', new Date())),
            })),
          },
        },
        () => nullstillMellomlagretVurdering()
      );
    })(event);
  };

  const sisteFritakVurdertAv = grunnlag?.vurderinger?.[grunnlag.vurderinger.length - 1]?.vurdertAv;

  const showAsOpen =
    (!!grunnlag?.vurderinger && grunnlag.vurderinger.length > 0) || initialMellomlagretVurdering !== undefined;

  const errors =
    form.formState.errors?.fritaksvurderinger && Array.isArray(form.formState.errors?.fritaksvurderinger)
      ? form.formState.errors?.fritaksvurderinger
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
      heading={'§ 11-10 tredje ledd. Unntak fra meldeplikt (valgfritt)'}
      steg="FRITAK_MELDEPLIKT"
      vilkårTilhørerNavKontor={true}
      defaultOpen={showAsOpen}
      onSubmit={handleSubmit}
      status={status}
      isLoading={isLoading}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      vurdertAvAnsatt={sisteFritakVurdertAv}
      mellomlagretVurdering={mellomlagretVurdering}
      onLagreMellomLagringClick={() => lagreMellomlagring(form.watch())}
      onDeleteMellomlagringClick={() => {
        slettMellomlagring(() =>
          form.reset(
            grunnlag?.vurderinger ? mapVurderingToDraftFormFields(grunnlag.vurderinger) : emptyDraftFormFields()
          )
        );
      }}
      visningModus={visningModus}
      visningActions={visningActions}
      formReset={() => form.reset(mellomlagretVurdering ? JSON.parse(mellomlagretVurdering.data) : undefined)}
      onLeggTilVurdering={() => append({ begrunnelse: '', harFritak: '', fraDato: '' })}
      errorList={errorList}
    >
      {!formReadOnly && (
        <VStack paddingBlock={'4'}>
          <Link href={'https://lovdata.no/pro/rundskriv/r11-00/KAPITTEL_12'} target="_blank">
            Du kan lese hvordan vilkåret skal vurderes i rundskrivet til § 11-10 (lovdata.no)
          </Link>
        </VStack>
      )}

      {fritakMeldepliktVurderinger.map((vurdering, index) => (
        <NyVurderingExpandableCard
          key={vurdering.id}
          fraDato={gyldigDatoEllerNull(form.watch(`fritaksvurderinger.${index}.fraDato`))}
          oppfylt={
            form.watch(`fritaksvurderinger.${index}.harFritak`)
              ? form.watch(`fritaksvurderinger.${index}.harFritak`) === JaEllerNei.Ja
              : undefined
          }
          nestePeriodeFraDato={gyldigDatoEllerNull(form.watch(`fritaksvurderinger.${index + 1}.fraDato`))}
          isLast={index === fritakMeldepliktVurderinger.length - 1}
          vurdertAv={undefined}
          finnesFeil={finnesFeilForVurdering(index, errorList)}
        >
          <HStack justify={'space-between'}>
            <DateInputWrapper
              label={'Vurderingen gjelder fra'}
              control={form.control}
              name={`fritaksvurderinger.${index}.fraDato`}
              rules={{
                required: 'Du må angi en dato vurderingen gjelder fra',
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
            control={form.control}
            name={`fritaksvurderinger.${index}.begrunnelse`}
            rules={{ required: 'Du må begrunne vurderingen din' }}
            className={'begrunnelse'}
            readOnly={formReadOnly}
          />
          <RadioGroupWrapper
            label={'Skal brukeren få fritak fra meldeplikt?'}
            control={form.control}
            name={`fritaksvurderinger.${index}.harFritak`}
            rules={{ required: 'Du må svare på om brukeren skal få fritak fra meldeplikt' }}
            readOnly={formReadOnly}
            horisontal
          >
            <Radio value={JaEllerNei.Ja}>Ja</Radio>
            <Radio value={JaEllerNei.Nei}>Nei</Radio>
          </RadioGroupWrapper>
        </NyVurderingExpandableCard>
      ))}
    </VilkårskortPeriodisert>
  );
};

function mapVurderingToDraftFormFields(vurderinger?: FritakMeldepliktGrunnlag['vurderinger']): DraftFormFields {
  return {
    fritaksvurderinger:
      vurderinger?.map((vurdering) => ({
        begrunnelse: vurdering.begrunnelse,
        fraDato: formaterDatoForFrontend(vurdering.fraDato),
        harFritak: vurdering.harFritak ? JaEllerNei.Ja : JaEllerNei.Nei,
      })) || [],
  };
}

function emptyDraftFormFields(): DraftFormFields {
  return { fritaksvurderinger: [] };
}
