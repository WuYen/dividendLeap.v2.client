import React from 'react';
import { Chart } from 'react-google-charts';

function StockChart({ rawData }) {
  // 處理數據並找出最高點和最低點
  const processedData = rawData.map((item) => {
    const date = new Date(item.date.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3'));
    return [date, item.close];
  });

  // 排序數據以確保日期順序
  processedData.sort((a, b) => a[0] - b[0]);

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
      format: 'MM/dd', // 只顯示年和月
      gridlines: {
        color: '#e0e0e0', // 設置網格線顏色
        count: processedData.length % 4,
      },
      minorGridlines: { color: 'transparent' },
      baselineColor: 'transparent',
      textPosition: 'in',
      textStyle: {
        fontSize: 12,
      },
    },
    vAxis: {
      textPosition: 'none',
      gridlines: { color: 'transparent' },
      minorGridlines: { color: 'transparent' },
      baselineColor: 'transparent',
      viewWindow: {
        min: minPoint[1] - minPoint[1] * 0.3,
        max: maxPoint[1] + maxPoint[1] * 0.1,
      },
    },
    backgroundColor: {
      fill: 'white',
    },
    annotations: {
      stem: {
        color: 'transparent',
        length: 25, // 調整這個值來改變 annotation 與數據點的距離
      },
      textStyle: {
        fontSize: 12,
        bold: true,
      },
      alwaysOutside: true,
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
