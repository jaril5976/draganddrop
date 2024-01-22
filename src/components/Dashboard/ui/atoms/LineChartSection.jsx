import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const LineChartSection = ({ widgetData }) => {
  const parseWidgetData = () => {
    const parsedData = widgetData.split(/[,-]/).map(Number);
    return parsedData.map((value, index) => ({
      name: String.fromCharCode(65 + index),
      price: value,
    }));
  };

  const data = parseWidgetData();

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="price"
          stroke="#f00"
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LineChartSection;
