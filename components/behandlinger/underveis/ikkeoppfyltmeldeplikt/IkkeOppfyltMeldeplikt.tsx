'use client';

import { RimeligGrunnMeldepliktGrunnlag } from 'lib/types/types';
import { formaterDatoForBackend, formaterDatoForFrontend, formaterPeriode } from 'lib/utils/date';
import { FormEvent, useState } from 'react';
import { Button, HStack, Link, Table, VStack } from '@navikt/ds-react';
import { TableStyled } from 'components/tablestyled/TableStyled';
import styles from 'components/behandlinger/tilkjentytelse/tilkjent/Tilkjent2.module.css';
import { useConfigForm } from 'components/form/FormHook';
import { SelectWrapper } from 'components/form/selectwrapper/SelectWrapper';
import { TextAreaWrapper } from 'components/form/textareawrapper/TextAreaWrapper';
import { useBehandlingsReferanse } from 'hooks/BehandlingHook';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { Behovstype } from 'lib/utils/form';
import { parse } from 'date-fns';
import { VilkårsKortMedForm } from 'components/vilkårskort/vilkårskortmedform/VilkårsKortMedForm';

type Props = {
  grunnlag?: RimeligGrunnMeldepliktGrunnlag;
  behandlingVersjon: number;
  readOnly: boolean;
};

type RimeligGrunnVurderinger = {
  fraDato: string;
  begrunnelse: string;
  harRimeligGrunn: string;
};

type FormFields = {
  rimeligGrunnVurderinger: RimeligGrunnVurderinger[];
};

export const IkkeOppfyltMeldeplikt = ({ grunnlag, behandlingVersjon, readOnly }: Props) => {
  const [overstyring, setOverstyring] = useState<boolean>(false);

  const defaultValues: RimeligGrunnVurderinger[] =
    grunnlag?.perioderIkkeMeldt.map((periode) => {
      const vurdering = grunnlag.vurderinger.find((v) => v.fraDato === periode.fom);
      return {
        fraDato: formaterDatoForFrontend(periode.fom),
        begrunnelse: vurdering?.begrunnelse ?? '',
        harRimeligGrunn: vurdering?.harRimeligGrunn ? 'RIMELIG_GRUNN' : 'IKKE_OPPFYLT',
      };
    }) || [];

  const { form } = useConfigForm<FormFields>({
    rimeligGrunnVurderinger: {
      type: 'fieldArray',
      defaultValue: defaultValues,
    },
  });

  const behandlingsreferanse = useBehandlingsReferanse();

  const { løsBehovOgGåTilNesteSteg, isLoading, status, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('IKKE_OPPFYLT_MELDEPLIKT');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit((data) => {
      løsBehovOgGåTilNesteSteg({
        behandlingVersjon: behandlingVersjon,
        referanse: behandlingsreferanse,
        behov: {
          behovstype: Behovstype.OVERSTYR_IKKE_OPPFYLT_MELDEPLIKT_KODE,
          rimeligGrunnVurderinger: data.rimeligGrunnVurderinger.map((periode) => ({
            begrunnelse: periode.begrunnelse,
            harRimeligGrunn: periode.harRimeligGrunn === 'RIMELIG_GRUNN',
            fraDato: formaterDatoForBackend(parse(periode.fraDato, 'dd.MM.yyyy', new Date())),
          })),
        },
      });
    })(event);
  };

  return grunnlag && grunnlag.perioderIkkeMeldt.length > 0 ? (
    <VilkårsKortMedForm
      heading={'Perioder uten oppfylt meldeplikt (§ 11-10 andre ledd)'}
      steg={'IKKE_OPPFYLT_MELDEPLIKT'}
      vilkårTilhørerNavKontor={true}
      onSubmit={handleSubmit}
      status={status}
      isLoading={isLoading}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      visBekreftKnapp={false}
    >
      <VStack gap={'4'}>
        <Link href={'https://lovdata.no/pro/rundskriv/r11-00/KAPITTEL_12'} target="_blank">
          Du kan lese hvordan vilkåret skal vurderes i rundskrivet til § 11-10 (lovdata.no)
        </Link>

        <div>
          Tabellen viser meldeperioder brukeren ikke har levert meldekort i tide og derfor ikke oppfyller meldeplikten.
          Du kan overstyre dette hvis brukeren hadde rimelig grunn for å unnlate å melde seg.
        </div>
        <TableStyled size="medium">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Meldeperiode</Table.HeaderCell>
              <Table.HeaderCell>Meldeplikt</Table.HeaderCell>
              {overstyring && <Table.HeaderCell>Begrunnelse</Table.HeaderCell>}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {grunnlag?.perioderIkkeMeldt.map((periode, periodeIndex) => {
              const skilleLinjeClassName =
                grunnlag?.perioderIkkeMeldt.length === periodeIndex + 1 || grunnlag?.perioderIkkeMeldt.length === 1
                  ? ''
                  : styles.tablerowwithoutborder;

              const bakgrunnClassName = periodeIndex % 2 ? styles.tablerowwithzebra : '';

              return (
                <Table.Row key={periode.fom} className={`${skilleLinjeClassName} ${bakgrunnClassName}`}>
                  <Table.DataCell textSize={'small'}>{formaterPeriode(periode.fom, periode.tom)}</Table.DataCell>
                  <Table.DataCell textSize={'small'}>
                    <SelectWrapper
                      control={form.control}
                      readOnly={readOnly || !overstyring}
                      name={`rimeligGrunnVurderinger.${periodeIndex}.harRimeligGrunn`}
                      rules={{
                        required: 'Du må svare på om brukeren har rimelig grunn for ikke overholdt meldeplikt',
                      }}
                    >
                      <option value={'RIMELIG_GRUNN'}>Rimelig grunn</option>
                      <option value={'IKKE_OPPFYLT'}>Ikke oppfylt</option>
                    </SelectWrapper>
                  </Table.DataCell>
                  {overstyring && (
                    <Table.DataCell>
                      <TextAreaWrapper
                        name={`rimeligGrunnVurderinger.${periodeIndex}.begrunnelse`}
                        control={form.control}
                        rules={{ required: 'Du må gi en begrunnelse' }}
                      />
                    </Table.DataCell>
                  )}
                </Table.Row>
              );
            })}
          </Table.Body>
        </TableStyled>

        {!readOnly && (
          <HStack justify={'space-between'} align={'end'}>
            {overstyring ? (
              <div className={'flex-row'}>
                <Button variant={'secondary'} onClick={() => setOverstyring(false)}>
                  Angre overstyring
                </Button>
                <Button>Bekreft</Button>
              </div>
            ) : (
              <Button variant={'secondary'} onClick={() => setOverstyring(true)}>
                Overstyr
              </Button>
            )}
          </HStack>
        )}
      </VStack>
    </VilkårsKortMedForm>
  ) : (
    <></>
  );
};
