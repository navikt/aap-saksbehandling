'use client';

import { TrashIcon } from '@navikt/aksel-icons';
import { Button, Link, Radio, VStack } from '@navikt/ds-react';
import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { FritakMeldepliktGrunnlag, MellomlagretVurdering } from 'lib/types/types';
import { Behovstype, JaEllerNei } from 'lib/utils/form';
import { validerDato } from 'lib/validation/dateValidation';
import { FormEvent } from 'react';
import { useFieldArray } from 'react-hook-form';
import { RadioGroupWrapper } from 'components/form/radiogroupwrapper/RadioGroupWrapper';

import styles from './Meldeplikt.module.css';
import { formaterDatoForBackend, formaterDatoForFrontend } from 'lib/utils/date';
import { parse } from 'date-fns';
import { useConfigForm } from 'components/form/FormHook';
import { DateInputWrapper } from 'components/form/dateinputwrapper/DateInputWrapper';
import { TextAreaWrapper } from 'components/form/textareawrapper/TextAreaWrapper';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';
import { useVilkårskortVisning } from 'hooks/saksbehandling/visning/VisningHook';
import { VilkårskortMedFormOgMellomlagringNyVisning } from 'components/vilkårskort/vilkårskortmedformogmellomlagringnyvisning/VilkårskortMedFormOgMellomlagringNyVisning';

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

export const Meldeplikt = ({ behandlingVersjon, grunnlag, readOnly, initialMellomlagretVurdering }: Props) => {
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

  return (
    <VilkårskortMedFormOgMellomlagringNyVisning
      heading={'§ 11-10 tredje ledd. Unntak fra meldeplikt'}
      steg="FRITAK_MELDEPLIKT"
      vilkårTilhørerNavKontor={true}
      defaultOpen={showAsOpen}
      onSubmit={handleSubmit}
      status={status}
      isLoading={isLoading}
      visBekreftKnapp={false}
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
      readOnly={readOnly}
      visningModus={visningModus}
      visningActions={visningActions}
      formReset={() => form.reset(mellomlagretVurdering ? JSON.parse(mellomlagretVurdering.data) : undefined)}
    >
      <VStack gap={'4'}>
        <Link href={'https://lovdata.no/pro/rundskriv/r11-00/KAPITTEL_12'} target="_blank">
          Du kan lese hvordan vilkåret skal vurderes i rundskrivet til § 11-10 (lovdata.no)
        </Link>

        {fritakMeldepliktVurderinger.map((vurdering, index) => (
          <div className={`${styles.vurdering} flex-column`} key={vurdering.id}>
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
              <div>
                <Button
                  onClick={() => remove(index)}
                  type={'button'}
                  variant={'tertiary'}
                  icon={<TrashIcon aria-hidden />}
                  size={'small'}
                >
                  Fjern periode
                </Button>
              </div>
            )}
          </div>
        ))}
        {!formReadOnly && (
          <Button
            onClick={() => append({ begrunnelse: '', harFritak: '', fraDato: '' })}
            type={'button'}
            variant={'secondary'}
            className={'fit-content'}
            size={'small'}
          >
            Legg til periode
          </Button>
        )}
      </VStack>
    </VilkårskortMedFormOgMellomlagringNyVisning>
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
