import { BodyShort, HStack, Tag } from '@navikt/ds-react';
import { isBefore, isSameDay, sub } from 'date-fns';
import { formaterDatoForFrontend, parseDatoFraDatePicker } from 'lib/utils/date';
import styles from 'components/behandlinger/lovvalg/lovvalgogmedlemskapperiodisert/lovogmedlemskap.module.css';
import { UseFormReturn } from 'react-hook-form';
import { JaEllerNei } from 'lib/utils/form';
import { LovOgMedlemskapVurderingForm } from 'components/behandlinger/lovvalg/lovvalgogmedlemskapperiodisert/types';

type TidligerePeriodeHeadingProps = {
  fom: Date;
  tom: Date | null | undefined;
  foersteNyePeriode: Date | null | undefined;
  oppfylt: boolean;
};

export const TidligerePeriodeHeading = ({ fom, tom, foersteNyePeriode, oppfylt }: TidligerePeriodeHeadingProps) => {
  const strekUtHele = foersteNyePeriode != null ? !isBefore(fom, foersteNyePeriode) : false;
  const nySluttdato =
    !strekUtHele &&
    foersteNyePeriode != null &&
    (tom == null || isBefore(foersteNyePeriode, tom) || isSameDay(foersteNyePeriode, tom));

  return (
    <HStack justify={'space-between'} paddingBlock={'1'} gap="12">
      <BodyShort size={'small'} className={strekUtHele ? styles.streketUtTekst : ''}>
        {formaterDatoForFrontend(fom)} –{' '}
        {tom && <span className={nySluttdato ? styles.streketUtTekst : ''}>{formaterDatoForFrontend(tom)}</span>}
        {nySluttdato && <span> {formaterDatoForFrontend(sub(foersteNyePeriode, { days: 1 }))}</span>}
      </BodyShort>
      <StatusTag oppfylt={oppfylt} />
    </HStack>
  );
};

type NyPeriodeHeadingProps = {
  index: number;
  form: UseFormReturn<LovOgMedlemskapVurderingForm>;
  isLast: boolean;
};

export const NyPeriodeHeading = ({ index, form, isLast }: NyPeriodeHeadingProps) => {
  const fom = parseDatoFraDatePicker(form.watch(`vurderinger.${index}.fraDato`));
  const oppfylt = form.watch(`vurderinger.${index}.medlemskap.varMedlemIFolketrygd`);
  const tom = isLast ? null : parseDatoFraDatePicker(form.watch(`vurderinger.${index + 1}.fraDato`));

  return (
    <HStack justify={'space-between'} paddingBlock={'1'} gap="12">
      <BodyShort size={'small'}>
        Ny vurdering: {fom == null ? '[Ikke valgt]' : formaterDatoForFrontend(fom)} –{' '}
        {tom != null ? (
          <span>{formaterDatoForFrontend(sub(tom, { days: 1 }))}</span>
        ) : (
          <span>{isLast ? ' ' : '[Ikke valgt]'}</span>
        )}
      </BodyShort>
      <StatusTag oppfylt={oppfylt != null ? oppfylt === JaEllerNei.Ja : null} />
    </HStack>
  );
};

type StatusTagProps = {
  oppfylt: boolean | null | undefined;
};

const StatusTag = ({ oppfylt }: StatusTagProps) => {
  if (oppfylt == null) {
    return null;
  }

  return (
    <Tag size="xsmall" variant={oppfylt ? 'success-moderate' : 'error-moderate'}>
      {oppfylt ? 'Oppfylt' : 'Ikke oppfylt'}
    </Tag>
  );
};
