'use client';

import { FormField, useConfigForm } from '@navikt/aap-felles-react';
import { Button, Heading, Timeline } from '@navikt/ds-react';
import { addMonths, subDays } from 'date-fns';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { useState } from 'react';

interface FormFields {
  name: string;
  fom: Date;
}

interface Vurdering extends FormFields {
  tom: Date;
}

export default function Page() {
  const gjennomførteVurderinger: Vurdering[] = [
    { name: 'hello', fom: new Date('2024-11-20'), tom: new Date('2024-12-24') },
    { name: 'pello', fom: new Date('2024-12-25'), tom: new Date('2025-02-19') },
    { name: 'pello', fom: new Date('2025-02-20'), tom: new Date('2025-04-15') },
  ];

  const [vurderinger, setVurderinger] = useState<Vurdering[]>([]);

  const { form, formFields } = useConfigForm<FormFields>({
    name: {
      label: 'Navn',
      type: 'text',
    },
    fom: {
      label: 'Fra og med',
      type: 'date',
      fromDate: vurderinger.length > 0 ? vurderinger[vurderinger.length - 1].fom : undefined,
    },
  });

  function sammenslåPerioder() {
    const gamlePerioder = [...gjennomførteVurderinger].sort((a, b) => a.fom.getTime() - b.fom.getTime());
    const nyePerioder = [...vurderinger].sort((a, b) => a.fom.getTime() - b.fom.getTime());

    let sammenslåttePerioder: Vurdering[] = [];

    let oldIndex = 0;

    for (const newPeriod of nyePerioder) {
      while (oldIndex < gamlePerioder.length && gamlePerioder[oldIndex].tom < newPeriod.fom) {
        sammenslåttePerioder.push(gamlePerioder[oldIndex]);
        oldIndex++;
      }

      while (oldIndex < gamlePerioder.length && gamlePerioder[oldIndex].fom <= newPeriod.tom) {
        const oldPeriod = gamlePerioder[oldIndex];

        if (oldPeriod.fom < newPeriod.fom && oldPeriod.tom >= newPeriod.fom) {
          sammenslåttePerioder.push({
            ...oldPeriod,
            tom: new Date(subDays(newPeriod.fom.getTime(), 1)),
          });
        }
        oldIndex++;
      }

      sammenslåttePerioder.push(newPeriod);
    }

    return sammenslåttePerioder;
  }

  const sammenslåttePerioder = sammenslåPerioder();

  return (
    <form
      className={'flex-column'}
      style={{ padding: '2rem' }}
      onSubmit={form.handleSubmit((data) => {
        setVurderinger((prevState) => [
          ...prevState.map((vurdering, index) => {
            if (vurderinger.length === index + 1) {
              return {
                ...vurdering,
                tom: subDays(data.fom, 1),
              };
            } else {
              return vurdering;
            }
          }),
          { ...data, tom: addMonths(new Date(), 2) },
        ]);
      })}
    >
      <FormField form={form} formField={formFields.name} />
      <FormField form={form} formField={formFields.fom} />

      {vurderinger.length > 0 && (
        <div className={'flex-column'}>
          <div className={'flex-column'}>
            <Heading size={'small'}>Ny periode</Heading>
            <Timeline>
              <Timeline.Row label="Perioder">
                {gjennomførteVurderinger.map((p, i) => (
                  <Timeline.Period key={i} start={p.fom} end={p.tom} status={'success'} about={'hello pello '}>
                    <span>{formaterDatoForFrontend(p.fom)}</span> <span>{formaterDatoForFrontend(p.tom)}</span>
                  </Timeline.Period>
                ))}
              </Timeline.Row>
              <Timeline.Row label="Nye perioder">
                {vurderinger.map((p, i) => (
                  <Timeline.Period key={i} start={p.fom} end={p.tom} status={'success'} about={'hello pello '}>
                    <span>{formaterDatoForFrontend(p.fom)}</span> <span>{formaterDatoForFrontend(p.tom)}</span>
                  </Timeline.Period>
                ))}
              </Timeline.Row>
            </Timeline>
          </div>

          <div className={'flex-column'}>
            <Heading size={'small'}>Gammel og nye perioder sammenslått</Heading>
            <Timeline>
              <Timeline.Row label="Vurderinger">
                {sammenslåttePerioder?.map((p, i) => (
                  <Timeline.Period key={i} start={p.fom} end={p.tom} status={'success'} about={'hello pello '}>
                    <span>{formaterDatoForFrontend(p.fom)}</span> <span>{formaterDatoForFrontend(p.tom)}</span>
                  </Timeline.Period>
                ))}
              </Timeline.Row>
            </Timeline>
          </div>
        </div>
      )}
      <Button className={'fit-content-button'}>Bekreft</Button>
    </form>
  );
}
