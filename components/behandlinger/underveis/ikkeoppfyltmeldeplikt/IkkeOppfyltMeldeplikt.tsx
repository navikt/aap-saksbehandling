'use client';

import { Periode, MeldepliktOverstyringLøsningDto, OverstyringMeldepliktGrunnlag } from 'lib/types/types';
import { FormEvent } from 'react';
import { BodyLong, Link, VStack } from '@navikt/ds-react';
import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { IkkeMeldtPerioderTable } from 'components/behandlinger/underveis/ikkeoppfyltmeldeplikt/IkkeMeldtPerioderTable';
import { VurderingMeldepliktOverstyringSkjema } from 'components/behandlinger/underveis/ikkeoppfyltmeldeplikt/VurderingMeldepliktOverstyringSkjema';
import { useConfigForm } from 'components/form/FormHook';
import { useFieldArray } from 'react-hook-form';
import {
  MeldepliktOverstyringFormFields,
  MeldepliktOverstyringVurdering,
} from 'components/behandlinger/underveis/ikkeoppfyltmeldeplikt/types';
import { Behovstype } from 'lib/utils/form';
import { VilkårskortMedFormOgMellomlagringNyVisning } from 'components/vilkårskort/vilkårskortmedformogmellomlagringnyvisning/VilkårskortMedFormOgMellomlagringNyVisning';
import { useVilkårskortVisning } from 'hooks/saksbehandling/visning/VisningHook';

type Props = {
  grunnlag?: OverstyringMeldepliktGrunnlag;
  behandlingVersjon: number;
  readOnly: boolean;
};

export const IkkeOppfyltMeldeplikt = ({ grunnlag, behandlingVersjon, readOnly }: Props) => {
  const behandlingsreferanse = useBehandlingsReferanse();

  const { løsBehovOgGåTilNesteSteg, isLoading, status, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('IKKE_OPPFYLT_MELDEPLIKT');

  const { visningModus, visningActions, formReadOnly } = useVilkårskortVisning(
    readOnly,
    'IKKE_OPPFYLT_MELDEPLIKT',
    undefined
  );

  /**
   * Ikke meldte perioder som skal vises er alle perioder som er registrert som ikke meldt
   * men som ikke har registrert en vurdering på seg (da vil vi heller vise den med vurderings-data)
   * i tillegg må vi legge til gjeldende vurderinger fra denne behandlingen (som ikke er på samme peridoe som en
   * tidligere vurdering), siden disse periodene ikke lenger er markert som ikke meldt.
   */
  const redigerbarePerioderSomIkkeHarTidligereVurderinger: Periode[] =
    grunnlag?.overstyringsvurderinger
      .filter((v) => grunnlag?.gjeldendeVedtatteOversyringsvurderinger.every((t) => t.fraDato !== v.fraDato))
      .map((vurdering) => ({
        fom: vurdering.fraDato,
        tom: vurdering.tilDato,
      })) ?? [];

  const tidligereVurderinger = grunnlag?.gjeldendeVedtatteOversyringsvurderinger ?? [];

  const ikkeMeldtPerioderSomSkalVises = redigerbarePerioderSomIkkeHarTidligereVurderinger
    .concat(
      grunnlag?.perioderIkkeMeldt.filter((p) =>
        redigerbarePerioderSomIkkeHarTidligereVurderinger.every((v) => v.fom !== p.fom)
      ) ?? []
    )
    .filter((periode) => tidligereVurderinger.every((v) => v.fraDato !== periode.fom));

  const allePerioder = tidligereVurderinger
    .map((p) => ({ fom: p.fraDato, tom: p.tilDato }))
    .concat(ikkeMeldtPerioderSomSkalVises)
    .sort((a, b) => a.fom.localeCompare(b.fom));

  /**
   * Gitt en periode, om den finner perioden overstyrt i gjeldende behandling bruker vi default-values fra den, hvis ikke
   * prøver vi å bruke fra tidligere vurderinger. Ellers fallbacker vi til default-verdier.
   */
  const getDefaultFormValuesForFraPeriode = (periode: Periode): MeldepliktOverstyringVurdering => {
    const gjeldendeVurdering = grunnlag?.overstyringsvurderinger.find((v) => v.fraDato === periode.fom);
    const tidligereVurtdering = grunnlag?.gjeldendeVedtatteOversyringsvurderinger.find(
      (v) => v.fraDato === periode.fom
    );

    return {
      fraDato: periode.fom,
      tilDato: periode.tom,
      begrunnelse: gjeldendeVurdering?.begrunnelse ?? tidligereVurtdering?.begrunnelse ?? '',
      meldepliktOverstyringStatus:
        gjeldendeVurdering?.meldepliktOverstyringStatus ??
        tidligereVurtdering?.meldepliktOverstyringStatus ??
        'IKKE_MELDT_SEG',
    };
  };

  const { form } = useConfigForm<MeldepliktOverstyringFormFields>({
    vurderinger: {
      type: 'fieldArray',
      defaultValue:
        grunnlag?.overstyringsvurderinger?.map((v) => ({
          fraDato: v.fraDato,
          tilDato: v.tilDato,
          begrunnelse: v.begrunnelse ?? '',
          meldepliktOverstyringStatus: v.meldepliktOverstyringStatus,
        })) ?? [],
    },
  });

  const { fields: vurderinger, append, remove } = useFieldArray({ control: form.control, name: 'vurderinger' });
  const valgtePerioder = vurderinger.map((v) => v.fraDato).sort((a, b) => a.localeCompare(b));

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit((data) => {
      const meldepliktOverstyringDto: MeldepliktOverstyringLøsningDto = {
        perioder: data.vurderinger
          .sort((a, b) => a.fraDato.localeCompare(b.fraDato))
          .map((dataForPeriode) => ({
            fom: dataForPeriode.fraDato,
            tom: dataForPeriode.tilDato,
            begrunnelse: dataForPeriode.begrunnelse,
            meldepliktOverstyringStatus: dataForPeriode.meldepliktOverstyringStatus,
          })),
      };

      løsBehovOgGåTilNesteSteg({
        behandlingVersjon: behandlingVersjon,
        referanse: behandlingsreferanse,
        behov: {
          behovstype: Behovstype.OVERSTYR_IKKE_OPPFYLT_MELDEPLIKT_KODE,
          meldepliktOverstyringVurdering: meldepliktOverstyringDto,
        },
      });
    })(event);
  };

  const getPeriodeForFraDato = (fraDato: string): Periode => allePerioder.find((p) => p.fom === fraDato)!;

  const handleChange = (checked: boolean, fraDato: string) => {
    if (checked) {
      const periode = getPeriodeForFraDato(fraDato);
      append(getDefaultFormValuesForFraPeriode(periode));
      return;
    } else {
      const eksisterendeIndex = vurderinger.findIndex((v) => v.fraDato === fraDato);
      remove(eksisterendeIndex);
    }
  };

  const harIkkeMeldteEllerOverstyrtePerioder =
    grunnlag != null &&
    (grunnlag.perioderIkkeMeldt.length > 0 ||
      grunnlag.overstyringsvurderinger.length > 0 ||
      grunnlag.gjeldendeVedtatteOversyringsvurderinger.length > 0);

  return harIkkeMeldteEllerOverstyrtePerioder ? (
    <VilkårskortMedFormOgMellomlagringNyVisning
      heading={'§ 11-10 andre ledd. Perioder uten overholdt meldeplikt'}
      steg={'IKKE_OPPFYLT_MELDEPLIKT'}
      vilkårTilhørerNavKontor={false}
      onSubmit={handleSubmit}
      status={status}
      isLoading={isLoading}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      onDeleteMellomlagringClick={undefined}
      onLagreMellomLagringClick={undefined}
      mellomlagretVurdering={undefined}
      visningModus={visningModus}
      visningActions={visningActions}
      formReset={() => form.reset()}
    >
      <VStack gap={'4'}>
        <BodyLong size={'small'}>
          <Link href={'https://lovdata.no/pro/rundskriv/r11-00/KAPITTEL_12'} target="_blank">
            Du kan lese hvordan vilkåret skal vurderes i rundskrivet til § 11-10 (lovdata.no)
          </Link>
        </BodyLong>
        <VStack gap={'10'}>
          <IkkeMeldtPerioderTable
            ikkeMeldtPerioder={ikkeMeldtPerioderSomSkalVises}
            tidligereVurdertePerioder={tidligereVurderinger}
            valgtePerioder={valgtePerioder}
            readOnly={formReadOnly}
            onClickPeriode={handleChange}
          />
          {valgtePerioder.map((periode) => (
            <VurderingMeldepliktOverstyringSkjema
              key={periode}
              periode={getPeriodeForFraDato(periode)}
              control={form.control}
              index={vurderinger.findIndex((field) => field.fraDato === periode)}
              field={vurderinger.find((field) => field.fraDato === periode)!}
              readOnly={formReadOnly}
            />
          ))}
        </VStack>
      </VStack>
    </VilkårskortMedFormOgMellomlagringNyVisning>
  ) : (
    <></>
  );
};
