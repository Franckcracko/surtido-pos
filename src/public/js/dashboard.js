document.addEventListener('DOMContentLoaded', async function () {
  document.querySelector('#reload-btn').addEventListener('click', function () {
    location.reload();
  });

  let modeSalesOverview = 'daily';

  const getDataSalesOverview = async (mode) => {
    const response = await fetch(`/api/orders/sales-overview?mode=${mode}`);
    if (!response.ok) {
      alert(
        'Ocurrio un error al obtener los datos de ventas. Por favor, intente nuevamente más tarde.',
      );
      return;
    }
    const data = await response.json();

    return data;
  };

  const series = await getDataSalesOverview(modeSalesOverview);
  const options = {
    colors: ['#1A56DB', '#FDBA8C'],
    series: [
      {
        name: 'Ganancias',
        data: series.map((s) => ({ x: s.label, y: s.sales })),
      },
    ],
    chart: {
      type: 'bar',
      height: '320px',
      fontFamily: 'Inter, sans-serif',
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '70%',
        borderRadiusApplication: 'end',
        borderRadius: 8,
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
      style: {
        fontFamily: 'Inter, sans-serif',
      },
    },
    states: {
      hover: {
        filter: {
          type: 'darken',
          value: 1,
        },
      },
    },
    stroke: {
      show: true,
      width: 0,
      colors: ['transparent'],
    },
    grid: {
      show: false,
      strokeDashArray: 4,
      padding: {
        left: 2,
        right: 2,
        top: -14,
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    xaxis: {
      floating: false,
      labels: {
        show: true,
        style: {
          fontFamily: 'Inter, sans-serif',
          cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400',
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      show: false,
    },
    fill: {
      opacity: 1,
    },
  };

  const $buttonDaily = document.querySelector('#daily');
  const $buttonWeekly = document.querySelector('#weekly');
  const $buttonMonthly = document.querySelector('#monthly');

  if (
    document.querySelector('#column-chart') &&
    typeof ApexCharts !== 'undefined'
  ) {
    const chart = new ApexCharts(
      document.querySelector('#column-chart'),
      options,
    );
    $buttonDaily.addEventListener('click', async () => {
      modeSalesOverview = 'daily';
      $buttonWeekly.classList.remove('bg-gray-100', 'text-gray-800');
      $buttonDaily.classList.add('bg-red-800', 'text-white');

      $buttonWeekly.classList.remove('bg-red-800', 'text-white');
      $buttonWeekly.classList.add('bg-gray-100', 'text-gray-800');

      $buttonMonthly.classList.remove('bg-red-800', 'text-white');
      $buttonMonthly.classList.add('bg-gray-100', 'text-gray-800');
      const series = await getDataSalesOverview(modeSalesOverview);
      chart.updateSeries([
        {
          data: series.map((s) => ({ x: s.label, y: s.sales })),
        },
      ]);
    });
    $buttonWeekly.addEventListener('click', async () => {
      modeSalesOverview = 'weekly';
      $buttonDaily.classList.remove('bg-red-800', 'text-white');
      $buttonDaily.classList.add('bg-gray-100', 'text-gray-800');

      $buttonWeekly.classList.add('bg-red-800', 'text-white');
      $buttonWeekly.classList.remove('bg-gray-100', 'text-gray-800');

      $buttonMonthly.classList.remove('bg-red-800', 'text-white');
      $buttonMonthly.classList.add('bg-gray-100', 'text-gray-800');
      const series = await getDataSalesOverview(modeSalesOverview);
      chart.updateSeries([
        {
          data: series.map((s) => ({ x: s.label, y: s.sales })),
        },
      ]);
    });
    $buttonMonthly.addEventListener('click', async () => {
      modeSalesOverview = 'monthly';
      $buttonDaily.classList.remove('bg-red-800', 'text-white');
      $buttonDaily.classList.add('bg-gray-100', 'text-gray-800');

      $buttonWeekly.classList.remove('bg-red-800', 'text-white');
      $buttonWeekly.classList.add('bg-gray-100', 'text-gray-800');

      $buttonMonthly.classList.add('bg-red-800', 'text-white');
      $buttonMonthly.classList.remove('bg-gray-100', 'text-gray-800');
      const series = await getDataSalesOverview(modeSalesOverview);
      chart.updateSeries([
        {
          data: series.map((s) => ({ x: s.label, y: s.sales })),
        },
      ]);
    });
    chart.render();
  }
});
