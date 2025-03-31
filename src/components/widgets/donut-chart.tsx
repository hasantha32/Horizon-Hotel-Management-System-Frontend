import Chart from '@/components/ui/chart';

const DonutChart = ({ series, icon, labels, prefix, colors }: any) => {
  const options = {
    options: {
      colors: colors,
      dataLabels: {
        enabled: false,
      },
      labels: labels,
      legend: {
        show: false,
      },
      stroke: {
        show: false,
      },
      states: {
        hover: {
          filter: {
            type: 'darken',
            value: 0.8,
          },
        },
      },
      plotOptions: {
        pie: {
          donut: {},
          expandOnClick: false,
        },
      },
    },
    series: series,
  };

  const numberWithCommas = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  return (
    <div className="h-full w-full rounded bg-light shadow-sm">
      <div className="flex items-start justify-between p-8">
        <div className="flex w-full items-center justify-start">
          <span className="me-4 flex h-14 w-14">{icon[0]}</span>

          <div className="flex flex-col">
            <span
              className="text-lg font-semibold text-heading"
              style={{ color: colors[0] }}
            >
              {prefix}
              {numberWithCommas(series[0])}
            </span>
            <span className="mt-1 text-xs text-body">{labels[0]}</span>
          </div>
        </div>
      </div>

      <div className="w-full">
        <Chart
          options={options.options}
          series={options.series}
          width="100%"
          type="donut"
        />
      </div>

      <div className="flex items-start justify-between p-8">
        <div className="flex w-full flex-row-reverse items-center justify-start ">
          <span className="ms-4 flex h-14 w-14">{icon[1]}</span>

          <div className="flex flex-col items-end">
            <span
              className="text-lg font-semibold text-heading"
              style={{ color: colors[1] }}
            >
              {prefix}
              {numberWithCommas(series[1])}
            </span>
            <span className="mt-1 text-xs text-body">{labels[1]}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonutChart;
