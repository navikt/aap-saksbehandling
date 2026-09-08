import { BodyShort, Box, Button, Detail, HStack, Tag, VStack } from '@navikt/ds-react';
import { TasklistIcon } from '@navikt/aksel-icons';
import { isMonday } from 'date-fns';
import { useFormContext } from 'react-hook-form';
import { KravFormFields } from 'components/behandlinger/krav/vurderkrav/VurderKrav';
import { DateInputWrapper } from 'components/form/dateinputwrapper/DateInputWrapper';
import { SelectWrapper } from 'components/form/selectwrapper/SelectWrapper';
import { TextAreaWrapper } from 'components/form/textareawrapper/TextAreaWrapper';
import { TextFieldWrapper } from 'components/form/textfieldwrapper/TextFieldWrapper';
import { erDatoIFremtiden, validerDato } from 'lib/validation/dateValidation';
import { parseDatoFraDatePicker } from 'lib/utils/date';

interface Props {
  erNyRad: boolean;
  onLukk: () => void;
}

export const MigrertKravBoks = ({ erNyRad, onLukk }: Props) => {
  const form = useFormContext<KravFormFields>();

  return (
    <Box borderWidth="1" borderRadius="12" borderColor={erNyRad ? 'accent-subtle' : 'neutral-subtle'}>
      <Box padding="space-8" background={erNyRad ? 'accent-moderate' : 'neutral-moderate'} borderRadius="12 12 0 0">
        <HStack align={'center'} justify={'space-between'} gap={'space-12'} padding={'space-8'}>
          <HStack align={'center'} gap={'space-12'}>
            <TasklistIcon title="a11y-title" fontSize="2rem" />
            <VStack>
              <Detail>Migrert krav</Detail>
              <BodyShort weight={'semibold'} size={'small'}>
                {erNyRad ? 'Nytt migrert krav' : `Vurder migrert krav fra arena`}
              </BodyShort>
            </VStack>
          </HStack>
        </HStack>
      </Box>

      <Box padding="space-16">
        <VStack gap="space-16">
          <HStack justify="space-between">
            <BodyShort weight={'semibold'}>Migrert krav</BodyShort>
            {!erNyRad && (
              <Button type="button" size="small" variant="tertiary" onClick={onLukk}>
                Lukk
              </Button>
            )}
          </HStack>

          <TextAreaWrapper
            control={form.control}
            name="migrertKravVurdering.begrunnelse"
            label="Vurdering"
            size="small"
            rules={{ required: 'Du må skrive inn en vurdering.' }}
          />

          <HStack>
            <TextFieldWrapper
              control={form.control}
              name="migrertKravVurdering.arenaSaksnummer"
              label="Arenasaksnummer"
              type="text"
              size="small"
              rules={{
                required: 'Du må fylle inn Arenasaksnummer.',
                pattern: {
                  value: /^\d{4}-\d+$/,
                  message: 'Arenasaksnummer må være på formatet ÅÅÅÅ-NNNN, f.eks. 2024-12345.',
                },
              }}
            />
          </HStack>

          <HStack>
            <SelectWrapper
              control={form.control}
              name="migrertKravVurdering.rettighetstype"
              label="Brukeren har følgende rettighetstype i Arena"
              size="small"
              rules={{ required: 'Du må velge rettighetstype.' }}
            >
              <option value="">Velg rettighetstype</option>
              <option value="ORDINÆR">Ordinær</option>
              <option value="UNNTAK_11_12_ÅR_4">Unntak § 11-12 År 4</option>
              <option value="UNNTAK_11_12_ÅR_5">Unntak § 11-12 År 5</option>
              <option value="SP_ERSTATNING_11_13">Sykepengeerstatning § 11-13</option>
            </SelectWrapper>
          </HStack>

          <HStack>
            <DateInputWrapper
              name="migrertKravVurdering.muligRettFra"
              control={form.control}
              label="Migrert dato"
              description="Dato Kelvin tar over ansvar for saken"
              size={'small'}
              rules={{
                validate: (value) => {
                  const feilmelding = validerDato(value as string);
                  if (feilmelding) return feilmelding;
                  if (erDatoIFremtiden(value as string)) return 'Migrert dato kan ikke være frem i tid.';
                  const dato = parseDatoFraDatePicker(value as string);
                  if (dato && !isMonday(dato)) return 'Migrert dato må være en mandag.';
                },
              }}
            />
          </HStack>

          <HStack>
            <DateInputWrapper
              name="migrertKravVurdering.virkningstidspunktArena"
              control={form.control}
              label="Virkningstidspunkt på Arena sak"
              description="Dato saken trer i kraft i Arena"
              size={'small'}
              rules={{
                validate: (value) => {
                  const feilmelding = validerDato(value as string);
                  if (feilmelding) return feilmelding;
                  if (erDatoIFremtiden(value as string))
                    return 'Virkningstidspunkt på Arena sak kan ikke være frem i tid.';
                },
              }}
            />
          </HStack>

          <HStack>
            <TextFieldWrapper
              control={form.control}
              name={'migrertKravVurdering.resterendeKvoteOrdinær'}
              label="Resterende § 11-12 kvote"
              description="Resterende telleverk i Arena på migreringstidspunkt"
              type="number"
              size="small"
              rules={{ required: 'Du må fylle inn forbrukt kvote.' }}
            />
          </HStack>
        </VStack>
      </Box>
    </Box>
  );
};
