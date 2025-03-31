import Chart from '@/components/ui/chart';

const RadialBarChart = ({
  widgetTitle,
  series,
  colors,
  label,
  helperText,
}: any) => {
  const options = {
    options: {
      colors: colors,
      plotOptions: {
        radialBar: {
          hollow: {
            margin: 0,
            size: '20%',
            background: 'transparent',
          },

          track: {
            show: true,
            background: '#F2F3FC',
            strokeWidth: '100%',
            opacity: 1,
            margin: 15,
            dropShadow: {
              enabled: false,
              top: 0,
              left: 0,
              blur: 3,
              opacity: 0.5,
            },
          },

          dataLabels: {
            show: false,
          },
        },
      },
      states: {
        hover: {
          filter: {
            type: 'darken',
            value: 0.8,
          },
        },
      },
      stroke: {
        lineCap: 'round',
      },
      labels: label,
    },
    series: series,
  };

  return (
    <div className="h-full w-full rounded bg-light shadow-sm">
      <div className="flex items-start justify-between p-8">
        <h3 className="text-base font-semibold text-heading">{widgetTitle}</h3>
      </div>

      <div className="w-full">
        <Chart
          options={options.options}
          series={options.series}
          type="radialBar"
          width="100%"
        />

        <div className="flex w-full px-3 pt-4 pb-8">
          {label?.map((_: any, index: number) => (
            <div className="flex items-start justify-start px-2" key={index}>
              <span
                className="me-3 flex h-4 w-4 flex-shrink-0 rounded-full"
                style={{ backgroundColor: colors[index] }}
              />
              <div className="flex flex-col">
                <span className="mb-1 text-xs text-body">
                  {helperText[index]}
                </span>
                <span className="text-xl font-semibold text-heading">
                  {label[index]}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RadialBarChart;
