import { Behovstype, JaEllerNei, JaEllerNeiOptions, mapBehovskodeTilBehovstype } from 'lib/utils/form';

import styles from 'components/totrinnsvurdering/totrinnsvurderingform/beslutterform/TotrinnsvurderingFelter.module.css';
import { Checkbox } from '@navikt/ds-react/Checkbox';
import { Link as AkselLink } from '@navikt/ds-react/Link';
import { Radio } from '@navikt/ds-react/Radio';
import { HStack, VStack } from '@navikt/ds-react/Stack';
import { Detail } from '@navikt/ds-react/Typography';
import Link from 'next/link';
import { ToTrinnsVurderingGrunn, UmamiTag } from 'lib/types/types';
import { FieldArrayWithId, UseFormReturn } from 'react-hook-form';
import { FormFieldsToTrinnsVurdering } from 'components/totrinnsvurdering/totrinnsvurderingform/TotrinnsvurderingForm';
import { ValuePair } from 'components/form/FormField';
import { TextAreaWrapper } from 'components/form/textareawrapper/TextAreaWrapper';
import { RadioGroupWrapper } from 'components/form/radiogroupwrapper/RadioGroupWrapper';
import { CheckboxWrapper } from 'components/form/checkboxwrapper/CheckboxWrapper';
import { useFeatureFlag } from 'context/UnleashContext';
import { PencilWritingIcon } from '@navikt/aksel-icons';

interface Props {
  link: string;
  readOnly: boolean;
  erKvalitetssikring: boolean;
  index: number;
  form: UseFormReturn<FormFieldsToTrinnsVurdering>;
  field: FieldArrayWithId<FormFieldsToTrinnsVurdering, 'totrinnsvurderinger'>;
  felterOnBlur?: (hendelse: UmamiTag, tidsstempel: number) => void;
  endretSidenForrigeGang: boolean | null;
}

export const TotrinnsvurderingVedtaksbrevFelter = ({
  readOnly,
  link,
  erKvalitetssikring,
  form,
  index,
  field,
  felterOnBlur = () => {},
  endretSidenForrigeGang,
}: Props) => {
  const nyeReturÅrsakerFlag = useFeatureFlag('ReturAarsakJournalforing');

  const grunnOptions: ValuePair<ToTrinnsVurderingGrunn>[] = [
    { label: 'Skrivefeil', value: 'SKRIVEFEIL' },
    { label: 'For detaljerte beskrivelser', value: 'FOR_DETALJERT' },
    { label: 'Ikke individuell og konkret nok', value: 'IKKE_INDIVIDUELL_OG_KONKRET' },
    ...(nyeReturÅrsakerFlag
      ? ([
          { label: 'Manglende kildehenvisning', value: 'MANGLENDE_KILDEHENVISNING' },
          { label: 'Manglende journalføring', value: 'MANGLENDE_JOURNALFØRING' },
        ] as const)
      : []),
    { label: 'Annen returårsak', value: 'ANNET' },
  ];

  const vurderingErIkkeGodkjent = form.watch(`totrinnsvurderinger.${index}.godkjent`) === JaEllerNei.Nei;
  const behovstypeEllerKode =
    Object.keys(Behovstype)[Object.values(Behovstype).indexOf(field.definisjon as Behovstype)] || field.definisjon;
  const eventPrefix = `${erKvalitetssikring ? 'KVALITETSSIKRER' : 'BESLUTTER'}_${behovstypeEllerKode}`;
  const kvalitetssikringDiffFeatureToggle = useFeatureFlag('KvalitetssikringDiff');
  const skalViseEndretSidenSistInfo =
    endretSidenForrigeGang != null && erKvalitetssikring && kvalitetssikringDiffFeatureToggle;

  const visEndretTekst = skalViseEndretSidenSistInfo && endretSidenForrigeGang;
  const visIkkeEndretTekst = skalViseEndretSidenSistInfo && !endretSidenForrigeGang;

  return (
    <div
      className={`${visEndretTekst ? styles.totrinnsvurderingFormMedEndring : styles.totrinnsvurderingFormUtenEndring}`}
    >
      <div className={`${styles.heading} ${visEndretTekst && styles.endretSidenSistHeading}`}>
        <VStack gap={'space-6'}>
          {visEndretTekst && (
            <HStack gap={'space-4'}>
              <PencilWritingIcon className={`${styles.endretSidenSistIkon}`} />
              <Detail data-color={'warning'} textColor={'subtle'}>
                Vurderingen er endret siden forrige retur
              </Detail>
            </HStack>
          )}
          {visIkkeEndretTekst && <Detail>Ingen endring siden forrige retur</Detail>}
          <AkselLink
            as={Link}
            prefetch={false}
            href={link}
            onClick={() => felterOnBlur(`${eventPrefix}_LINK` as UmamiTag, Date.now())}
          >
            {mapBehovskodeTilBehovstype(field.definisjon as Behovstype)}
          </AkselLink>
        </VStack>
      </div>
      <div className={styles.felter}>
        <RadioGroupWrapper
          label={'Godkjenner du begrunnelsen?'}
          control={form.control}
          name={`totrinnsvurderinger.${index}.godkjent`}
          readOnly={readOnly}
        >
          {JaEllerNeiOptions.map((option) => (
            <Radio
              value={option.value}
              key={option.value}
              onBlur={() => felterOnBlur(`${eventPrefix}_GODKJENT` as UmamiTag, Date.now())}
            >
              {option.label}
            </Radio>
          ))}
        </RadioGroupWrapper>

        {vurderingErIkkeGodkjent && (
          <>
            <TextAreaWrapper
              label={'Beskriv returårsak'}
              readOnly={readOnly}
              control={form.control}
              name={`totrinnsvurderinger.${index}.begrunnelse`}
              rules={{
                required: 'Du må skrive en grunn for retur',
                validate: {
                  ikkeKunWhitespace: (value) =>
                    value && (value as string).trim().length === 0
                      ? 'Begrunnelse kan ikke være tom eller kun inneholde mellomrom'
                      : true,
                },
              }}
              onBlur={() => felterOnBlur(`${eventPrefix}_RETUR_BEGRUNNELSE` as UmamiTag, Date.now())}
            />
            <CheckboxWrapper
              label={'Returårsak'}
              readOnly={readOnly}
              control={form.control}
              name={`totrinnsvurderinger.${index}.grunner`}
              rules={{ required: 'Du må oppgi en grunn' }}
            >
              {grunnOptions.map((option) => (
                <Checkbox
                  value={option.value}
                  key={option.value}
                  onBlur={() => felterOnBlur(`${eventPrefix}_RETUR_GRUNNER` as UmamiTag, Date.now())}
                >
                  {option.label}
                </Checkbox>
              ))}
            </CheckboxWrapper>
          </>
        )}
      </div>
    </div>
  );
};
