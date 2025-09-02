'use client';

import { useConfigForm } from 'components/form/FormHook';
import { isBefore, parse, startOfDay } from 'date-fns';
import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { MellomlagretVurdering, RefusjonskravGrunnlag } from 'lib/types/types';
import { formaterDatoForBackend, formaterDatoForFrontend, stringToDate } from 'lib/utils/date';
import { Behovstype, getJaNeiEllerUndefined, JaEllerNei, JaEllerNeiOptions } from 'lib/utils/form';
import { validerNullableDato } from 'lib/validation/dateValidation';
import { FormEvent } from 'react';
import { useSak } from 'hooks/SakHook';
import { VilkRskortMedFormOgMellomlagring } from 'components/vilkårskort/vilkårskortmedformogmellomlagring/VilkårskortMedFormOgMellomlagring';
import { Button, HStack, Radio, VStack } from '@navikt/ds-react';
import { TrashIcon } from '@navikt/aksel-icons';
import { useFieldArray } from 'react-hook-form';
import { RadioGroupWrapper } from 'components/form/radiogroupwrapper/RadioGroupWrapper';
import { DateInputWrapper } from 'components/form/dateinputwrapper/DateInputWrapper';
import { isError } from 'lib/utils/api';
import { mapToValuePair, ValuePair } from 'components/form/FormField';
import { AsyncComboSearch } from 'components/form/asynccombosearch/AsyncComboSearch';
import { clientHentAlleNavenheter } from 'lib/clientApi';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';
import { Sak } from 'context/saksbehandling/SakContext';

import styles from './Refusjon.module.css';

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

  const defaultValue: DraftFormFields = initialMellomlagretVurdering
    ? JSON.parse(initialMellomlagretVurdering.data)
    : mapVurderingToDraftFormFields(grunnlag, sak);

  const defaultOptions: ValuePair[] = (grunnlag.gjeldendeVurderinger ?? [])
    .filter((vurdering) => vurdering.navKontor != null)
    .map((vurdering) => mapToValuePair(vurdering.navKontor!));

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

  const kontorSøk = async (input: string) => {
    if (input.length <= 2) {
      return [];
    }

    const response = await clientHentAlleNavenheter(behandlingsreferanse, { navn: input });
    if (isError(response)) {
      return [];
    }

    const res = response.data.map((kontor) => ({
      label: `${kontor.navn} - ${kontor.enhetsnummer}`,
      value: `${kontor.navn} - ${kontor.enhetsnummer}`,
    }));

    return res;
  };

  const { fields, remove, append } = useFieldArray({ control: form.control, name: 'refusjoner' });

  return (
    <VilkRskortMedFormOgMellomlagring
      heading={'Sosialstønad refusjonskrav'}
      steg="REFUSJON_KRAV"
      vilkårTilhørerNavKontor={true}
      onSubmit={handleSubmit}
      status={status}
      isLoading={isLoading}
      visBekreftKnapp={!readOnly}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      vurdertAvAnsatt={grunnlag.gjeldendeVurderinger?.[0]?.vurdertAv}
      readOnly={readOnly}
      mellomlagretVurdering={mellomlagretVurdering}
      onLagreMellomLagringClick={() => lagreMellomlagring(form.watch())}
      onDeleteMellomlagringClick={() =>
        slettMellomlagring(() => form.reset(mapVurderingToDraftFormFields(grunnlag, sak)))
      }
    >
      <RadioGroupWrapper
        name={`harKrav`}
        control={form.control}
        label={'Er det refusjonskrav fra Nav-kontor?'}
        rules={{ required: 'Du må velge om brukeren har refusjonskrav' }}
        readOnly={readOnly}
        horisontal
      >
        <Radio value={JaEllerNei.Ja}>Ja</Radio>
        <Radio value={JaEllerNei.Nei}>Nei</Radio>
      </RadioGroupWrapper>

      {form.watch('harKrav') === JaEllerNei.Ja &&
        fields.map((field, index) => {
          const erFørsterefusjon = index === 0;
          return (
            <VStack key={field.id} gap={'6'} className={styles.vurdering}>
              <AsyncComboSearch
                label={'Søk opp Nav-kontor'}
                form={form}
                name={`refusjoner.${index}.navKontor`}
                fetcher={kontorSøk}
                rules={{
                  validate: {
                    valgtKontor: (value) => {
                      if (!value) return 'Du må velge et Nav-kontor';
                      if (typeof value === 'object' && 'value' in value) {
                        return value.value?.trim() ? true : 'Du må velge et Nav-kontor';
                      }
                    },
                  },
                }}
                size={'small'}
                defaultOptions={defaultOptions}
                readOnly={readOnly}
              />
              <HStack gap={'4'} align={'end'}>
                <DateInputWrapper
                  name={`refusjoner.${index}.fom`}
                  control={form.control}
                  label={'Refusjonen gjelder fra'}
                  rules={{
                    validate: {
                      gyldigDato: (value) => validerNullableDato(value as string),
                      kanIkkeVaereFoerSoeknadstidspunkt: (value) => {
                        const starttidspunkt = startOfDay(new Date(sak.periode.fom));
                        const vurderingGjelderFra = stringToDate(value as string, 'dd.MM.yyyy');
                        if (vurderingGjelderFra && isBefore(startOfDay(vurderingGjelderFra), starttidspunkt)) {
                          return 'Vurderingen kan ikke gjelde fra før starttidspunktet';
                        }
                        return true;
                      },
                    },
                  }}
                  readOnly={readOnly}
                />
                <DateInputWrapper
                  name={`refusjoner.${index}.tom`}
                  control={form.control}
                  label={'Refusjonen gjelder til'}
                  rules={{
                    validate: {
                      gyldigDato: (value) => validerNullableDato(value as string),
                      kanIkkeVaereFoerFraDato: (value) => {
                        const fomValue = form.getValues(`refusjoner.${index}.fom`);
                        if (!fomValue) {
                          return true;
                        }
                        const fomDate = startOfDay(parse(fomValue, 'dd.MM.yyyy', new Date()));
                        const vurderingGjelderTil = stringToDate(value as string, 'dd.MM.yyyy');
                        if (vurderingGjelderTil && isBefore(startOfDay(vurderingGjelderTil), fomDate)) {
                          return 'Tildato kan ikke være før fradato';
                        }
                        return true;
                      },
                    },
                  }}
                  readOnly={readOnly}
                />
                {!erFørsterefusjon && !readOnly && (
                  <Button
                    type={'button'}
                    icon={<TrashIcon aria-hidden />}
                    className={'fit-content'}
                    variant={'tertiary'}
                    size={'small'}
                    onClick={() => remove(index)}
                  >
                    Fjern Nav-kontor
                  </Button>
                )}
              </HStack>
            </VStack>
          );
        })}
      {form.watch('harKrav') === JaEllerNei.Ja && !readOnly && (
        <Button
          type={'button'}
          className={'fit-content'}
          variant={'secondary'}
          size={'small'}
          onClick={() => append({ navKontor: { label: '', value: '' }, fom: '', tom: '' })}
        >
          Legg til nytt Nav-kontor
        </Button>
      )}
    </VilkRskortMedFormOgMellomlagring>
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
            tom: formaterDatoForFrontend(vurdering.tom ?? sak.periode.tom),
          }))
        : [
            {
              navKontor: {
                label: '',
                value: '',
              },
              fom: formaterDatoForFrontend(sak.periode.fom),
              tom: formaterDatoForFrontend(sak.periode.tom),
            },
          ],
  };
}
