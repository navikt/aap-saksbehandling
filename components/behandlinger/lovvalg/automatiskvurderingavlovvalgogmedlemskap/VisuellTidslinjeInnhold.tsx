'use client';

import { Timeline } from '@navikt/ds-react';
import { VisuellTidslinjeArbeidInntekt } from 'lib/types/types';
import { formaterPeriode } from 'lib/utils/date';

interface Props {
  visuellTidslinje: VisuellTidslinjeArbeidInntekt[];
}

export function VisuellTidslinjeInnhold({ visuellTidslinje }: Props) {
  const datoer = visuellTidslinje.flatMap((it) => [new Date(it.periode.fom), new Date(it.periode.tom)]);

  const startDate = new Date(Math.min(...datoer.map((d) => d.getTime())));
  const endDate = new Date(Math.max(...datoer.map((d) => d.getTime())));

  const inntektTimeline = visuellTidslinje.filter((periode) => !periode.periodeMangler);
  const hullTimeline = visuellTidslinje.filter((periode) => periode.periodeMangler);

  return (
    <Timeline startDate={startDate} endDate={endDate}>
      <Timeline.Row label={'Inntekter'}>
        {inntektTimeline.map((item, i) => {
          return (
            <Timeline.Period
              key={i}
              start={new Date(item.periode.fom)}
              end={new Date(item.periode.tom)}
              status={'success'}
              statusLabel={'Inntektstidslinje'}
            >
              <div>
                <div>
                  <b>{formaterPeriode(item.periode.fom, item.periode.tom)}</b>
                </div>
                {item.inntekter?.map((inntekt, j) => (
                  <div key={j}>
                    <div>
                      {inntekt.virksomhetNavn} (org.nr: {inntekt.virksomhetId})
                    </div>
                    <div>Inntekt: {inntekt.beloep}</div>
                  </div>
                ))}
              </div>
            </Timeline.Period>
          );
        })}
      </Timeline.Row>
      <Timeline.Row label={'Manglende inntekter'}>
        {hullTimeline.map((item, i) => {
          return (
            <Timeline.Period
              key={i}
              start={new Date(item.periode.fom)}
              end={new Date(item.periode.tom)}
              status={'danger'}
              statusLabel={'Manglende inntekter'}
            >
              <div>
                <div>
                  <b>{formaterPeriode(item.periode.fom, item.periode.tom)}</b>
                </div>
                <div>Inntekt mangler</div>
              </div>
            </Timeline.Period>
          );
        })}
      </Timeline.Row>
    </Timeline>
  );
}
