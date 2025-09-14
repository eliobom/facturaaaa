import React from 'react';
import { Platform, View } from 'react-native';

// Only render charts on web; on native return null (caller should handle placeholders)
let WebBar: any = null;
let WebLine: any = null;
let WebDoughnut: any = null;

if (Platform.OS === 'web') {
  // Lazy require to avoid bundling on native
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const ChartJS = require('chart.js/auto');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const ReactChart = require('react-chartjs-2');
  WebBar = ReactChart.Bar;
  WebLine = ReactChart.Line;
  WebDoughnut = ReactChart.Doughnut;
}

export function BarChart() {
  if (Platform.OS !== 'web') return <View />;
  const data = {
    labels: ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG'],
    datasets: [
      { label: 'A', data: [12,18,10,22,17,24,16,20], backgroundColor: '#2563EB' },
      { label: 'B', data: [8,14,12,18,13,20,11,17], backgroundColor: '#F59E0B' },
    ],
  };
  const options = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { x: { ticks: { font: { size: 10 } } }, y: { ticks: { font: { size: 10 } } } },
  } as const;
  return <WebBar data={data} options={options} />;
}

export function AreaChart() {
  if (Platform.OS !== 'web') return <View />;
  const data = {
    labels: ['1','2','3','4','5','6'],
    datasets: [
      { label: 'Serie', data: [2,3,5,4,7,6], borderColor: '#F59E0B', backgroundColor: '#FDE68A', fill: true, tension: 0.4 },
    ],
  };
  const options = { responsive: true, plugins: { legend: { display: false } } } as const;
  return <WebLine data={data} options={options} />;
}

export function DonutChart() {
  if (Platform.OS !== 'web') return <View />;
  const data = {
    labels: ['A','B','C','D'],
    datasets: [
      { data: [45,25,20,10], backgroundColor: ['#2563EB','#F59E0B','#10B981','#E5E7EB'] },
    ],
  };
  const options = { responsive: true, plugins: { legend: { display: false } }, cutout: '65%' } as const;
  return <WebDoughnut data={data} options={options} />;
}
