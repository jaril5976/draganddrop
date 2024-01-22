import React from "react";

import { Pie, PieChart, Cell, ResponsiveContainer } from "recharts";

const AngularChartSection = ({ widgetData }) => {
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
      <PieChart height={260} width={500}>
        <Pie
          data={data}
          startAngle={180}
          endAngle={0}
          innerRadius="50%"
          dataKey="value"
          isAnimationActive={true}
        >
          <Cell fill="#000" />
          <Cell fill="#eaeaea" />
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};

export default AngularChartSection;
