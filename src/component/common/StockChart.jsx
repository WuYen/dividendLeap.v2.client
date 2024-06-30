import React from 'react';
import { Chart } from 'react-google-charts';

function StockChart({ rawData }) {
  if (rawData.length < 20) {
    return null;
  }

  // 處理數據並找出最高點和最低點
  const processedData = rawData.map((item) => {
    const date = new Date(item.date.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3'));
    return [date, item.close];
  });

  // 找出最高點和最低點
  const [maxPoint, minPoint] = processedData.reduce(
    ([max, min], [date, price]) => [price > max[1] ? [date, price] : max, price < min[1] ? [date, price] : min],
    [processedData[0], processedData[0]]
  );

  const options = {
    //title: "股票收盤價趨勢",
    curveType: 'function',
    legend: { position: 'none' },
    chartArea: {
      left: '5%',
      right: '5%',
      top: '2%',
      bottom: '2%',
      width: '100%',
      height: '100%',
    },
    hAxis: {
      //title: "日期",
      format: 'MM/dd', // 只顯示年和月
      //ticks: tickDates,
      //gridlines: { color: 'transparent' },
      gridlines: {
        color: '#e0e0e0', // 設置網格線顏色
        count: 3, // 確保只有3條網格線
      },
      minorGridlines: { color: 'transparent' },
      baselineColor: 'transparent',
      textPosition: 'in',
      textStyle: {
        fontSize: 12,
      },
    },
    vAxis: {
      //title: "收盤價",
      textPosition: 'none',
      gridlines: { color: 'transparent' },
      minorGridlines: { color: 'transparent' },
      baselineColor: 'transparent',
    },
    backgroundColor: {
      fill: 'white',
    },
    annotations: {
      stem: {
        color: 'transparent',
      },
      textStyle: {
        fontSize: 12,
        bold: true,
      },
    },
  };

  // 添加最高點和最低點的標註
  const dataWithAnnotations = [
    ['Date', 'Close Price', { role: 'annotation' }],
    ...processedData.map(([date, price]) =>
      date.getTime() === maxPoint[0].getTime()
        ? [date, price, `H: ${price}`]
        : date.getTime() === minPoint[0].getTime()
        ? [date, price, `L: ${price}`]
        : [date, price, null]
    ),
  ];

  return <Chart chartType='LineChart' width='100%' height='100px' data={dataWithAnnotations} options={options} />;
}

export default StockChart;
