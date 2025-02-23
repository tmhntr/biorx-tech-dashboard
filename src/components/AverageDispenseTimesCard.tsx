import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Label,
} from "recharts";
import { DataRow } from "@/lib/data/transform";
import { DataFilters } from "@/lib/db";

interface AverageDispenseTimesCardProps {
  data: DataRow[];
  date: Date;
  setDate: (date: Date) => void;
  filter: DataFilters,
}

const AverageDispenseTimesCard: React.FC<AverageDispenseTimesCardProps> = ({
  data,
  date,
  setDate,
  filter,
}) => {

  const averageDispenseTimes = useMemo(() => {
    if (filter.product && filter.product.length > 0) {
      const groupedByProduct = Object.groupBy(data, (it) => it.product_name);
      return Object.entries(groupedByProduct).flatMap(([product, rows]) => {
        const groupedByDate = rows ? Object.groupBy(rows, (it) => it.filled_date) : {};
        return Object.entries(groupedByDate).map(([date, rows]) => ({
          product,
          date,
          avg_dispense_time: rows ? rows.reduce((acc, row) => acc + (row.dispense_time || 0), 0) / rows.length : null,
        }));
      });
    } else {
      const groupedByDate = Object.groupBy(data, (it) => it.filled_date);
      return Object.entries(groupedByDate).map(([date, rows]) => ({
        date,
        avg_dispense_time: rows ? rows.reduce((acc, row) => acc + (row.dispense_time || 0), 0) / rows.length : null,
      }));
    }
  }, [data, date, filter]);

  // const [averageDispenseTimes, setAverageDispenseTimes] = React.useState<
  //   {
  // const [averageDispenseTimes, setAverageDispenseTimes] = React.useState<
  //   {
  //     date: string;
  //     avg_dispense_time: number | null;
  //   }[]
  // >([]);
  // useEffect(() => {
  //   if (data.length === 0) {
  //     return;
  //   }
  //   const filteredData = data
  //     .filter((row) => row.dispense_time)
  //     .sort((a, b) => a.filled_datetime.localeCompare(b.filled_datetime));
  //   const averageByDay = Object.groupBy(filteredData, (it) => it.filled_date);

  //   // get the number of days between the last date and the first date
  //   const startDate = new Date(filteredData[0].filled_date);
  //   const endDate = new Date(filteredData[filteredData.length - 1].filled_date);
  //   const window_days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  //   // const lastDate = Object.keys(averageByDay).sort().reverse()[0] || new Date().toISOString().slice(0, 10);
  //   const dateArray = Array.from({ length: window_days }, (_, i) => {
  //     const date = new Date(endDate);
  //     date.setDate(date.getDate() - i);
  //     return date;
  //   }).reverse();
  //   // calculate the average dispense time for each date
  //   const averages = dateArray.map((date) => {
  //     const dateString = formatDate(date);
  //     const dispenseTimes = averageByDay[dateString];
  //     if (!dispenseTimes || dispenseTimes.length === 0) {
  //       return { date: formatDate(date), avg_dispense_time: null };
  //     }
  //     const total = dispenseTimes.reduce(
  //       (acc, it) => acc + it.dispense_time!,
  //       0
  //     );
  //     const avg =
  //       dispenseTimes.length === 0 ? null : total / dispenseTimes.length;
  //     return {
  //       date: formatDate(date),
  //       avg_dispense_time: avg,
  //     };
  //   });

  //   setAverageDispenseTimes(averages);
  // }, [data, date, setDate]);

  return (
    <Card className="lg:col-span-4 col-span-full">
      <CardHeader>
        <CardTitle>Dispense times by date</CardTitle>
      </CardHeader>
      <CardContent className="pl-2 mx-auto w-fit">
        <LineChart
          margin={{
            top: 10,
            right: 0,
            left: 0,
            bottom: 20,
          }}
          height={350}
          width={500}
          data={averageDispenseTimes}
          onClick={(e) => {
            if (!e.activePayload?.[0]?.value || !e.activeLabel) {
              return;
            }
            setDate(new Date(e.activeLabel));
          }}
        >
          <Line type="monotone" dataKey="avg_dispense_time" stroke="#8884d8" />
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="date" includeHidden>
            <Label
              value="Date"
              offset={-5}
              position="insideBottom"
              style={{ textAnchor: "middle" }}
            />
          </XAxis>
          <YAxis>
            <Label
              value="Mean dispense time (s)"
              angle={-90}
              position="insideLeft"
              style={{ textAnchor: "middle" }}
            />
          </YAxis>
          <Tooltip />
        </LineChart>
      </CardContent>
    </Card>
  );
};

export default AverageDispenseTimesCard;
