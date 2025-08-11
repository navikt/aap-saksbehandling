import { PlotParams } from 'react-plotly.js';
import dynamic from 'next/dynamic';

interface ResponsivePlotProps {
  data: PlotParams['data'];
  layout: PlotParams['layout'];
}

const DynamicPlotly = dynamic(() => import('react-plotly.js'), { ssr: false });

export const ResponsivePlot = ({ data, layout }: ResponsivePlotProps) => {
  return (
    <DynamicPlotly
      data={data}
      layout={{
        ...layout,
        autosize: false,
        margin: { ...layout.margin, t: 10, b: 40, pad: 10 },
        colorway: ['#CCE1FF', '#99C4DD', '#FFC166', '#66CBEC', '#99DEAD', '#C0B2D2'],
      }}
      useResizeHandler={true}
      style={{ width: '100%', height: '100%' }}
    />
  );
};
