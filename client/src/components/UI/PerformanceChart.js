import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const PerformanceChart = ({ data, timeframe }) => {
  const formatTooltip = (value, name) => {
    if (name === 'yield') {
      return [`${value} g`, 'Yield'];
    }
    if (name === 'quality') {
      return [`${value}/10`, 'Quality'];
    }
    return [value, name];
  };

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip formatter={formatTooltip} />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="yield"
            stroke="#22c55e"
            activeDot={{ r: 8 }}
            name="Yield (g)"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="quality"
            stroke="#3b82f6"
            name="Quality Score"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PerformanceChart;
