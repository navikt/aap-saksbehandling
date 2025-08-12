'use client';

import { BistandsbehovVurdering, BistandsGrunnlag, TypeBehandling } from 'lib/types/types';
import {
  Behovstype,
  getJaNeiEllerIkkeBesvart,
  getJaNeiEllerUndefined,
  JaEllerNei,
  JaEllerNeiOptions,
} from 'lib/utils/form';
import { FormEvent } from 'react';
import { Alert, BodyShort, Button, Heading, HGrid, Link, VStack } from '@navikt/ds-react';
import { useConfigForm } from 'components/form/FormHook';
import { FormField } from 'components/form/FormField';
import { formaterDatoForFrontend, sorterEtterNyesteDato } from 'lib/utils/date';
import { VilkårsKortMedForm } from 'components/vilkårskort/vilkårskortmedform/VilkårsKortMedForm';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import { TidligereVurderingerV3 } from 'components/tidligerevurderinger/TidligereVurderingerV3';
import { format, parse, subDays } from 'date-fns';
import { deepEqual } from 'components/tidligerevurderinger/TidligereVurderingerUtils';
import { erDatoFoerDato } from 'lib/validation/dateValidation';
import { Veiledning } from 'components/veiledning/Veiledning';

interface Props {
  behandlingVersjon: number;
  readOnly: boolean;
  typeBehandling: TypeBehandling;
  grunnlag?: BistandsGrunnlag;
  mellomlagring?: BistandsGrunnlag['vurdering'];
}

interface FormFields {
  begrunnelse: string;
  erBehovForAktivBehandling: string;
  erBehovForArbeidsrettetTiltak: string;
  erBehovForAnnenOppfølging?: string;
  overgangBegrunnelse?: string;
  vurderAAPIOvergangTilUføre?: string;
  vurderAAPIOvergangTilArbeid?: string;
}

export const Bistandsbehov = ({ behandlingVersjon, grunnlag, readOnly, typeBehandling, mellomlagring }: Props) => {
  const behandlingsReferanse = useBehandlingsReferanse();
  const { løsBehovOgGåTilNesteSteg, isLoading, status, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('VURDER_BISTANDSBEHOV');

  const vilkårsvurderingLabel = 'Vilkårsvurdering';
  const erBehovForAktivBehandlingLabel = 'a: Har brukeren behov for aktiv behandling?';
  const erBehovForArbeidsrettetTiltakLabel = 'b: Har brukeren behov for arbeidsrettet tiltak?';
  const erBehovForAnnenOppfølgingLabel =
    'c: Kan brukeren anses for å ha en viss mulighet for å komme i arbeid, ved å få annen oppfølging fra Nav?';
  const vurderAAPIOvergangTilUføreLabel = 'Har brukeren rett til AAP under behandling av krav om uføretrygd?';
  const vurderAAPIOvergangTilArbeidLabel = 'Har brukeren rett til AAP i perioden som arbeidssøker?';

  const { oppdaterMellomlagring, slettMellomlagring, opprettMellomlagring, mellomlagringFinnes } = useMellomlagring(
    Behovstype.AVKLAR_BISTANDSBEHOV_KODE,
    mellomlagring !== undefined
  );

  const defaultValue = mellomlagring ? mellomlagring : grunnlag?.vurdering;

  const { formFields, form } = useConfigForm<FormFields>(
    {
      begrunnelse: {
        type: 'textarea',
        label: vilkårsvurderingLabel,
        defaultValue: defaultValue?.begrunnelse,
        rules: { required: 'Du må gi en begrunnelse om brukeren har behov for oppfølging' },
      },
      erBehovForAktivBehandling: {
        type: 'radio',
        label: erBehovForAktivBehandlingLabel,
        defaultValue: getJaNeiEllerUndefined(defaultValue?.erBehovForAktivBehandling),
        rules: { required: 'Du må svare på om brukeren har behov for aktiv behandling' },
        options: JaEllerNeiOptions,
      },
      erBehovForArbeidsrettetTiltak: {
        type: 'radio',
        label: erBehovForArbeidsrettetTiltakLabel,
        options: JaEllerNeiOptions,
        defaultValue: getJaNeiEllerUndefined(grunnlag?.vurdering?.erBehovForArbeidsrettetTiltak),
        rules: { required: 'Du må svare på om brukeren har behov for arbeidsrettet tiltak' },
      },
      erBehovForAnnenOppfølging: {
        type: 'radio',
        label: erBehovForAnnenOppfølgingLabel,
        options: JaEllerNeiOptions,
        defaultValue: getJaNeiEllerUndefined(grunnlag?.vurdering?.erBehovForAnnenOppfølging),
        rules: { required: 'Du må svare på om brukeren anses for å ha en viss mulighet til å komme i arbeid' },
      },
      overgangBegrunnelse: {
        type: 'textarea',
        label: vilkårsvurderingLabel,
        defaultValue: defaultValue?.overgangBegrunnelse || undefined,
        rules: { required: 'Du må gjøre en vilkårsvurdering' },
      },
      vurderAAPIOvergangTilUføre: {
        type: 'radio',
        label: vurderAAPIOvergangTilUføreLabel,
        options: JaEllerNeiOptions,
        defaultValue: getJaNeiEllerUndefined(defaultValue?.skalVurdereAapIOvergangTilUføre),
        rules: {
          required: 'Du må svare på om brukeren har rett på AAP i overgang til uføre',
          validate: (value) =>
            value === JaEllerNei.Ja ? 'AAP under behandling av søknad om uføretrygd er ikke støttet enda' : undefined,
        },
      },
      vurderAAPIOvergangTilArbeid: {
        type: 'radio',
        label: vurderAAPIOvergangTilArbeidLabel,
        options: JaEllerNeiOptions,
        defaultValue: getJaNeiEllerUndefined(defaultValue?.skalVurdereAapIOvergangTilArbeid),
        rules: {
          required: 'Du må svare på om brukeren har rett på AAP i overgang til arbeid',
          validate: (value) => (value === JaEllerNei.Ja ? 'AAP i overgang til arbeid er ikke støttet enda' : undefined),
        },
      },
    },
    { readOnly: readOnly, shouldUnregister: true }
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit((data) => {
      løsBehovOgGåTilNesteSteg({
        behandlingVersjon: behandlingVersjon,
        behov: {
          behovstype: Behovstype.AVKLAR_BISTANDSBEHOV_KODE,
          bistandsVurdering: {
            begrunnelse: data.begrunnelse,
            erBehovForAktivBehandling: data.erBehovForAktivBehandling === JaEllerNei.Ja,
            erBehovForArbeidsrettetTiltak: data.erBehovForArbeidsrettetTiltak === JaEllerNei.Ja,
            erBehovForAnnenOppfølging: data.erBehovForAnnenOppfølging
              ? data.erBehovForAnnenOppfølging === JaEllerNei.Ja
              : undefined,
            ...(bistandsbehovErIkkeOppfylt && {
              skalVurdereAapIOvergangTilUføre: data.vurderAAPIOvergangTilUføre === JaEllerNei.Ja,
              skalVurdereAapIOvergangTilArbeid: data.vurderAAPIOvergangTilArbeid === JaEllerNei.Ja,
              overgangBegrunnelse: data.overgangBegrunnelse,
            }),
          },
        },
        referanse: behandlingsReferanse,
      });
    })(event);
  };

  const erBehovForAktivBehandling = form.watch('erBehovForAktivBehandling') === JaEllerNei.Nei;
  const erBehovForArbeidsrettetTiltak = form.watch('erBehovForArbeidsrettetTiltak') === JaEllerNei.Nei;
  const erBehovForAnnenOppfølging = form.watch('erBehovForAnnenOppfølging') === JaEllerNei.Nei;

  const bistandsbehovErIkkeOppfylt =
    erBehovForAktivBehandling && erBehovForArbeidsrettetTiltak && erBehovForAnnenOppfølging;

  const gjeldendeSykdomsvurdering = grunnlag?.gjeldendeSykdsomsvurderinger.at(-1);
  const vurderingenGjelderFra = gjeldendeSykdomsvurdering?.vurderingenGjelderFra;
  const historiskeVurderinger = grunnlag?.historiskeVurderinger;

  return (
    <VilkårsKortMedForm
      heading={'§ 11-6 Behov for bistand til å skaffe seg eller beholde arbeid'}
      steg={'VURDER_BISTANDSBEHOV'}
      onSubmit={handleSubmit}
      visBekreftKnapp={!readOnly}
      isLoading={isLoading}
      status={status}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      vilkårTilhørerNavKontor={true}
      vurdertAvAnsatt={grunnlag?.vurdering?.vurdertAv}
    >
      {mellomlagringFinnes && <Alert variant={'warning'}>Det finnes en mellomlagring.</Alert>}
      <HGrid gap={'4'}>
        <Button type={'button'} onClick={() => opprettMellomlagring({ thmas: 'hehe' })}>
          Opprett
        </Button>
        <Button type={'button'} onClick={() => oppdaterMellomlagring({ thomas: 'hehe' })}>
          Oppdater
        </Button>
        <Button type={'button'} onClick={() => slettMellomlagring()}>
          Slett
        </Button>
      </HGrid>
      {historiskeVurderinger && historiskeVurderinger.length > 0 && (
        <TidligereVurderingerV3 tidligereVurderinger={mapTidligereVurderinger()} />
      )}
      <Veiledning
        defaultOpen={false}
        tekst={
          <div>
            Vilkårene i § 11-6 første ledd bokstav a til c er tre alternative vilkår. Det vil si at det er nok at
            brukeren oppfyller ett av dem for å fylle vilkåret i § 11-6.Først skal du vurdere om vilkårene i bokstav a
            (aktiv behandling) og bokstav b (arbeidsrettet tiltak) er oppfylte. Hvis du svarer ja på ett eller begge
            vilkårene, er § 11-6 oppfylt. Hvis du svarer nei på a og b, må du vurdere om bokstav c er oppfylt. Hvis du
            svarer nei på alle tre vilkårene, er § 11-6 ikke oppfylt.{' '}
            <Link href="https://lovdata.no/pro/lov/1997-02-28-19/%C2%A711-6">
              Du kan lese om hvordan vilkåret skal vurderes i rundskrivet til § 11-6
            </Link>
            <span> </span>
            <Link href="https://lovdata.no"> (lovdata.no)</Link>
          </div>
        }
      />
      {typeBehandling === 'Revurdering' && (
        <BodyShort>
          Vurderingen gjelder fra {vurderingenGjelderFra && formaterDatoForFrontend(vurderingenGjelderFra)}
        </BodyShort>
      )}
      <FormField form={form} formField={formFields.begrunnelse} className="begrunnelse" />
      <FormField form={form} formField={formFields.erBehovForAktivBehandling} horizontalRadio />
      <FormField form={form} formField={formFields.erBehovForArbeidsrettetTiltak} horizontalRadio />
      {form.watch('erBehovForAktivBehandling') !== JaEllerNei.Ja &&
        form.watch('erBehovForArbeidsrettetTiltak') !== JaEllerNei.Ja && (
          <FormField form={form} formField={formFields.erBehovForAnnenOppfølging} horizontalRadio />
        )}
      {(typeBehandling === 'Førstegangsbehandling' || (typeBehandling === 'Revurdering' && grunnlag?.harOppfylt11_5)) &&
        bistandsbehovErIkkeOppfylt && (
          <VStack gap={'4'} as={'section'}>
            <Heading level={'3'} size="small">
              § 11-18 Arbeidsavklaringspenger under behandling av krav om uføretrygd
            </Heading>
            <FormField form={form} formField={formFields.overgangBegrunnelse} className="begrunnelse" />
            <FormField form={form} formField={formFields.vurderAAPIOvergangTilUføre} horizontalRadio />
            {form.watch('vurderAAPIOvergangTilUføre') === JaEllerNei.Ja && (
              <Alert variant="warning">
                Sett saken på vent og meld i fra til Team AAP at du har fått en § 11-18-sak.
              </Alert>
            )}
          </VStack>
        )}
      {typeBehandling === 'Revurdering' && !grunnlag?.harOppfylt11_5 && bistandsbehovErIkkeOppfylt && (
        <VStack gap={'4'} as={'section'}>
          <Heading level={'3'} size="small">
            § 11-17 Arbeidsavklaringspenger i perioden som arbeidssøker
          </Heading>
          <FormField form={form} formField={formFields.overgangBegrunnelse} className="begrunnelse" />
          <FormField form={form} formField={formFields.vurderAAPIOvergangTilArbeid} horizontalRadio />
          {form.watch('vurderAAPIOvergangTilArbeid') === JaEllerNei.Ja && (
            <Alert variant="warning">
              Sett saken på vent og meld i fra til Team AAP at du har fått en § 11-17-sak.
            </Alert>
          )}
        </VStack>
      )}
    </VilkårsKortMedForm>
  );

  function mapTidligereVurderinger() {
    const antallVurderinger = historiskeVurderinger?.length;
    const gjeldendeVurderinger = grunnlag!!.gjeldendeVedtatteVurderinger;

    const finnSluttdato = (index: number) => {
      if ((antallVurderinger && antallVurderinger <= 1) || index === 0) {
        return null;
      }
      const forrigeGjelderFra =
        historiskeVurderinger!!.at(index - 1)?.vurderingenGjelderFra ||
        historiskeVurderinger!!.at(index - 1)?.vurdertAv.dato;
      if (!forrigeGjelderFra) {
        return null;
      }
      const vurderingGjelderFra =
        historiskeVurderinger!!.at(index)?.vurderingenGjelderFra || historiskeVurderinger!!.at(index)?.vurdertAv.dato!!;

      if (forrigeGjelderFra === vurderingGjelderFra) {
        return format(subDays(parse(vurderingGjelderFra, 'yyyy-MM-dd', new Date()), 0), 'yyyy-MM-dd');
      }

      const tom = erDatoFoerDato(
        formaterDatoForFrontend(vurderingGjelderFra),
        formaterDatoForFrontend(forrigeGjelderFra)
      )
        ? forrigeGjelderFra
        : vurderingGjelderFra;

      return format(subDays(parse(tom, 'yyyy-MM-dd', new Date()), 1), 'yyyy-MM-dd');
    };

    const erVurderingenGjeldende = (historiskVurdering: BistandsbehovVurdering) => {
      const vurderingenFinnesSomGjeldende = gjeldendeVurderinger.some((gjeldendeVurdering) =>
        deepEqual(historiskVurdering, gjeldendeVurdering, ['dokumenterBruktIVurderingen'])
      );
      return vurderingenFinnesSomGjeldende;
    };

    return historiskeVurderinger!!
      .sort((a, b) => {
        const afom = a.vurderingenGjelderFra ?? a.vurdertAv.dato;
        const bfom = b.vurderingenGjelderFra ?? b.vurdertAv.dato;

        if (afom === bfom) {
          const aGjeldende = erVurderingenGjeldende(a);
          const bGjeldende = erVurderingenGjeldende(b);

          if (aGjeldende && !bGjeldende) return -1;
          if (!aGjeldende && bGjeldende) return 1;
        }

        return sorterEtterNyesteDato(afom, bfom);
      })
      .map((vurdering, index) => ({
        ...vurdering,
        vurdertAvIdent: vurdering.vurdertAv.ident,
        vurdertDato: vurdering.vurdertAv.dato,
        erGjeldendeVurdering: erVurderingenGjeldende(vurdering),
        periode: {
          fom: vurdering.vurderingenGjelderFra ? vurdering.vurderingenGjelderFra : vurdering.vurdertAv.dato,
          tom: finnSluttdato(index),
        },
        felter: [
          {
            label: vilkårsvurderingLabel,
            value: vurdering.begrunnelse,
          },
          {
            label: erBehovForAktivBehandlingLabel,
            value: getJaNeiEllerIkkeBesvart(vurdering.erBehovForAktivBehandling),
          },
          {
            label: erBehovForArbeidsrettetTiltakLabel,
            value: getJaNeiEllerIkkeBesvart(vurdering.erBehovForArbeidsrettetTiltak),
          },
          {
            label: erBehovForAnnenOppfølgingLabel,
            value: getJaNeiEllerIkkeBesvart(vurdering.erBehovForAnnenOppfølging),
          },
          {
            label: vurderAAPIOvergangTilUføreLabel,
            value: getJaNeiEllerIkkeBesvart(vurdering.skalVurdereAapIOvergangTilUføre),
          },
          {
            label: vurderAAPIOvergangTilArbeidLabel,
            value: getJaNeiEllerIkkeBesvart(vurdering.skalVurdereAapIOvergangTilArbeid),
          },
        ],
      }));
  }
};
