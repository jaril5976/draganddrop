import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const CylinderChart = ({ widgetData }) => {
  const parseWidgetData = () => {
    const parsedData = widgetData.split(/[,-]/).map(Number);
    return parsedData.map((value, index) => ({
      name: String.fromCharCode(65 + index),
      value: value,
    }));
  };

  const data = parseWidgetData();

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" fill="#8884d8" shape={<CylinderBar />} />
      </BarChart>
    </ResponsiveContainer>
  );
};

const CylinderBar = (props) => {
  const { x, y, width, height, fill } = props;

  return (
    <g>
      <ellipse
        cx={x + width / 2}
        cy={y + height}
        rx={width / 2}
        ry={10}
        fill={fill}
      />
      <rect x={x} y={y} width={width} height={height} fill={fill} />
    </g>
  );
};

export default CylinderChart;
