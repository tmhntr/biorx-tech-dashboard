import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { DataRow } from "../lib/data/transform";
import { DataFilters } from "@/lib/db";
import { getProduct } from "@/lib/products";

type DosesByProductChartProps = {
  data: DataRow[];
  date: Date;
  filter: DataFilters;
};

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const DosesByProductChart: React.FC<DosesByProductChartProps> = ({
  data,
  date,
  filter,
}) => {
  const filteredData = React.useMemo(() => {
    const formattedDate = date.toISOString().split("T")[0];
    return data.filter((row) => {
      const rowDate = row.filled_date;
      if (filter.filled_datetime) {
        const { start, end } = filter.filled_datetime;
        return (!start || rowDate >= start) && (!end || rowDate <= end);
      }
      return rowDate === formattedDate;
    });
  }, [data, date, filter]);

  const productGroups = React.useMemo(() => {
    const productMap: { [key: string]: number } = {};
    filteredData.forEach((row) => {
      productMap[row.product_name] = (productMap[row.product_name] || 0) + 1;
    });
    return Object.entries(productMap).map(([name, value]) => ({
      name,
      value,
    }));
  }, [filteredData]);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={productGroups}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {productGroups.map((entry, index) => {
            const product = getProduct(entry.name);
            const color = product ? product.color : "#8884d8"; // Default color if not found
            console.log(product);
            return <Cell key={`cell-${index}`} fill={color} stroke={product?.color_2} />;
          })}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};

export default DosesByProductChart; 