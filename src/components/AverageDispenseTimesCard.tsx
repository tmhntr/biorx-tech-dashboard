import React, { useEffect } from "react";
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
import { DataRow } from "@/lib/data";
import { window_length } from "@/App";

interface AverageDispenseTimesCardProps {
  data: DataRow[];
}

const AverageDispenseTimesCard: React.FC<AverageDispenseTimesCardProps> = ({
  data,
}) => {
  const [averageDispenseTimes, setAverageDispenseTimes] = React.useState<
    {
      date: string;
      avg_dispense_time: number | null;
    }[]
  >([]);
  useEffect(() => {
    const filteredData = data.filter((row) => row.dispense_time);
    const averageByDay = Object.groupBy(filteredData, (it) =>
      it.filled_date
    );
    // create an array of each calendar date for the last 6 months

    let window_days
    switch (window_length) {
        case "1 month":
            window_days = 30
            break;
        case "3 months":
            window_days = 90
            break;
        case "6 months":
            window_days = 182
            break;
    
        default:
            window_days = 30
            break;
    }
    const lastDate = Object.keys(averageByDay).sort().reverse()[0] || new Date().toISOString().slice(0, 10);
    const dateArray = Array.from({ length: window_days }, (_, i) => {
      const date = new Date(lastDate);
      date.setDate(date.getDate() - i);
      return date;
    }).reverse();
    // calculate the average dispense time for each date
    const averages = dateArray.map((date) => {
      const dateString = date.toISOString().slice(0, 10);
      const dispenseTimes = averageByDay[dateString];
      if (!dispenseTimes || dispenseTimes.length === 0) {
        return { date: dateString.slice(5,10), avg_dispense_time: null };
      }
      const total = dispenseTimes.reduce((acc, it) => acc + it.dispense_time!, 0);
      const avg = dispenseTimes.length === 0 ? null : total / dispenseTimes.length;
      return {
        date: dateString.slice(5,10),
        avg_dispense_time: avg,
      };
    });

    setAverageDispenseTimes(averages);
  }, [data]);

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
