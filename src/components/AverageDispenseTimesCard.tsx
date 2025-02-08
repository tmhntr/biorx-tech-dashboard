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
    const averageByDay = Object.groupBy(data, (it) =>
      new Date(it.filled_datetime).toISOString().slice(5, 10)
    );
    const averages = Object.keys(averageByDay).map((key) => {
      const dayData = averageByDay[key];
      const sum = dayData?.reduce(
        (acc, it) => acc + (it.dispense_time || 0),
        0
      );
      return {
        date: key,
        avg_dispense_time: sum && dayData ? sum / dayData.length : null,
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
