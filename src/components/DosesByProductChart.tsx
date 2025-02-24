import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { DataRow } from "../lib/data/transform";
import { DataFilters } from "@/lib/db";
import { getProduct } from "@/lib/products";
import { formatDate } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

type DosesByProductChartProps = {
  data: DataRow[];
  date: Date | undefined;
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
  name,
}: any) => {
  if (percent <= 0.05) return null; // Only show label if percent is greater than 5%

  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  // Get the product short name
  const product = getProduct(name);
  const displayName = product ? product.shortName : name;

  return (
    <text
      x={x}
      y={y}
      fill="black" // Set label color to black
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${displayName}: ${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const DosesByProductChart: React.FC<DosesByProductChartProps> = ({
  data,
  date,
  filter,
}) => {
  const filteredData = React.useMemo(() => {
    if (!date) return data;
    return data.filter((row) => {
      const rowDate = row.filled_date;
      if (filter.filled_datetime) {
        const { start, end } = filter.filled_datetime;
        return (!start || rowDate >= start) && (!end || rowDate <= end);
      }
      return rowDate === formatDate(date);
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
    <Card className="shadow-lg rounded-lg border border-gray-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-blue-50 p-4 rounded-t-lg">
        <CardTitle className="text-lg font-semibold text-blue-700">
          Doses by Product
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 flex justify-center items-center">
        <ResponsiveContainer width="100%" height={200}>
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
                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={color}
                    stroke={product?.color_2}
                  />
                );
              })}
            </Pie>
            <Tooltip formatter={(value: number, name: string) => [`${value} doses`, name]} />
            {productGroups.length < 5 && <Legend />}
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default DosesByProductChart;
