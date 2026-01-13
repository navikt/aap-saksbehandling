'use client';

import { Behovstype, getJaNeiEllerUndefined, JaEllerNei, JaEllerNeiOptions } from 'lib/utils/form';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import styles from './Inntektsbortfall.module.css';
import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import { FormEvent } from 'react';
import { VilkårskortMedFormOgMellomlagringNyVisning } from 'components/vilkårskort/vilkårskortmedformogmellomlagringnyvisning/VilkårskortMedFormOgMellomlagringNyVisning';
import { useVilkårskortVisning, VisningModus } from 'hooks/saksbehandling/visning/VisningHook';
import { Alert, Table } from '@navikt/ds-react';
import { InntektsbortfallResponse, MellomlagretVurdering } from 'lib/types/types';
import { TableStyled } from 'components/tablestyled/TableStyled';
import { CheckmarkCircleIcon, XMarkOctagonIcon } from '@navikt/aksel-icons';
import { useFeatureFlag } from 'context/UnleashContext';
import { formaterTilG } from 'lib/utils/string';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';
import { useConfigForm } from 'components/form/FormHook';
import { FormField } from 'components/form/FormField';

interface Props {
  behandlingVersjon: number;
  readOnly: boolean;
  grunnlag: InntektsbortfallResponse;
  initialMellomlagretVurdering?: MellomlagretVurdering;
}

function AvslåttOppfylltIkon({ verdi }: { verdi: boolean }) {
  return verdi ? (
    <XMarkOctagonIcon className={styles.avslåttIcon} />
  ) : (
    <CheckmarkCircleIcon className={styles.oppfyltIcon} />
  );
}

interface InntektsbortfallVurderingFormFields {
  begrunnelse: string;
  rettTilUttak: string;
}

type DraftFormFields = Partial<InntektsbortfallVurderingFormFields>;

function mapVurderingToDraftFormFields(grunnlag?: InntektsbortfallResponse['vurdering']): DraftFormFields {
  return {
    begrunnelse: grunnlag?.begrunnelse,
    rettTilUttak: getJaNeiEllerUndefined(grunnlag?.rettTilUttak),
  };
}

export const Inntektsbortfall = ({
  behandlingVersjon,
  readOnly,
  grunnlag: { grunnlag, vurdering },
  initialMellomlagretVurdering,
}: Props) => {
  const behandlingsReferanse = useBehandlingsReferanse();
  const { status, løsBehovOgGåTilNesteSteg, isLoading, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('VURDER_INNTEKTSBORTFALL');

  const { lagreMellomlagring, slettMellomlagring, mellomlagretVurdering, nullstillMellomlagretVurdering } =
    useMellomlagring(Behovstype.YRKESSKADE_KODE, initialMellomlagretVurdering);

  const { visningActions, visningModus, formReadOnly } = useVilkårskortVisning(
    readOnly,
    'VURDER_INNTEKTSBORTFALL',
    mellomlagretVurdering
  );

  const defaultValues: DraftFormFields = initialMellomlagretVurdering
    ? JSON.parse(initialMellomlagretVurdering.data)
    : mapVurderingToDraftFormFields(vurdering);

  const { form, formFields } = useConfigForm<InntektsbortfallVurderingFormFields>(
    {
      begrunnelse: {
        type: 'textarea',
        label: 'Vilkårsvurdering',
        defaultValue: defaultValues.begrunnelse,
        rules: { required: 'Du må begrunne.' },
      },
      rettTilUttak: {
        type: 'radio',
        label: 'Har brukeren rett til uttak av hel alderspensjon etter kapittel 19 og 20?',
        options: JaEllerNeiOptions,
        defaultValue: getJaNeiEllerUndefined(vurdering?.rettTilUttak),
        rules: { required: 'Du må svare ja eller nei.' },
      },
    },
    { readOnly: formReadOnly, shouldUnregister: true }
  );

  const enabled = useFeatureFlag('KravOmInntektsbortfall');

  const under62År = grunnlag.under62ÅrVedSøknadstidspunkt;
  const inntektSisteÅr = grunnlag.inntektSisteÅrOver1G;
  const inntektSisteTreÅr = grunnlag.inntektSiste3ÅrOver3G;

  return (
    <VilkårskortMedFormOgMellomlagringNyVisning
      heading="§ 11-4 andre ledd. Krav om inntektsbortfall etter fylte 62 år"
      steg={'VURDER_INNTEKTSBORTFALL'}
      vilkårTilhørerNavKontor={false}
      status={status}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      isLoading={isLoading}
      vurdertAutomatisk={grunnlag.kanBehandlesAutomatisk}
      vurdertAvAnsatt={vurdering?.vurdertAv}
      onSubmit={(event: FormEvent<HTMLFormElement>) => {
        form.handleSubmit(
          (data) => {
            løsBehovOgGåTilNesteSteg({
              behandlingVersjon: behandlingVersjon,
              behov: {
                behovstype: Behovstype.VURDER_INNTEKTSBORTFALL,
                vurdering: {
                  begrunnelse: data.begrunnelse,
                  rettTilUttak: data.rettTilUttak === JaEllerNei.Ja,
                },
              },
              referanse: behandlingsReferanse,
            });
          },
          () => nullstillMellomlagretVurdering()
        )(event);
      }}
      mellomlagretVurdering={mellomlagretVurdering}
      visningModus={enabled ? visningModus : VisningModus.LÅST_UTEN_ENDRE}
      visningActions={visningActions}
      formReset={() => {
        form.reset(vurdering ? mapVurderingToDraftFormFields(vurdering) : {});
      }}
      onDeleteMellomlagringClick={() => {
        slettMellomlagring(() => {
          form.reset(vurdering ? mapVurderingToDraftFormFields(vurdering) : {});
        });
      }}
      onLagreMellomLagringClick={() => lagreMellomlagring(form.watch())}
    >
      {!enabled && (
        <Alert variant="info">
          Brukeren er over 62 år og må vurderes for § 11-4 andre ledd. Det er ikke støttet i Kelvin enda. Saken må
          settes på vent i påvente av at funksjonaliteten er ferdig utviklet.
        </Alert>
      )}
      {enabled && (
        <>
          <TableStyled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell scope="col">Beskrivelse</Table.HeaderCell>
                <Table.HeaderCell scope="col">Verdi</Table.HeaderCell>
                <Table.HeaderCell scope="col">Vurdering</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row>
                <Table.DataCell textSize={'small'}>Under 62 år ved søknadstidspunkt</Table.DataCell>
                <Table.DataCell textSize={'small'}>{under62År.alder} år</Table.DataCell>
                <Table.DataCell textSize={'small'}>
                  <div className={styles.utfall}>
                    <AvslåttOppfylltIkon verdi={!under62År.resultat} />
                    {under62År.resultat ? 'Under 62 år' : 'Over 62 år'}
                  </div>
                </Table.DataCell>
              </Table.Row>
              <Table.Row>
                <Table.DataCell textSize={'small'}>Inntekt siste 3 år over 3 G</Table.DataCell>
                <Table.DataCell textSize={'small'}>
                  {formaterTilG(inntektSisteTreÅr.gverdi, { antallDesimaler: 2 })}
                </Table.DataCell>
                <Table.DataCell textSize={'small'}>
                  <div className={styles.utfall}>
                    <AvslåttOppfylltIkon verdi={!inntektSisteTreÅr.resultat} />
                    {inntektSisteTreÅr.resultat ? 'Inntekt er over 3 G' : 'Inntekt er under 3 G'}
                  </div>
                </Table.DataCell>
              </Table.Row>
              <Table.Row>
                <Table.DataCell textSize={'small'}>Inntekt siste år over 1 G</Table.DataCell>
                <Table.DataCell textSize={'small'}>
                  {formaterTilG(inntektSisteÅr.gverdi, { antallDesimaler: 2 })}
                </Table.DataCell>
                <Table.DataCell textSize={'small'}>
                  <div className={styles.utfall}>
                    <AvslåttOppfylltIkon verdi={!inntektSisteÅr.resultat} />
                    {inntektSisteÅr.resultat ? 'Inntekt er over 1 G' : 'Inntekt er under 1 G'}
                  </div>
                </Table.DataCell>
              </Table.Row>
            </Table.Body>
          </TableStyled>
          <Alert variant="info">
            Brukeren har ikke hatt inntekt over 1 G siste år / 3 G siste 3 år. Det må vurderes om brukeren har rett til
            å ta ut full alderspensjon.
          </Alert>
          <FormField form={form} formField={formFields.begrunnelse} />
          <FormField form={form} formField={formFields.rettTilUttak} />
        </>
      )}
    </VilkårskortMedFormOgMellomlagringNyVisning>
  );
};
