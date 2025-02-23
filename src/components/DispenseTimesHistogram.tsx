import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Label } from "recharts";
import { DataRow } from "@/lib/data/transform";
import { formatDate } from "@/lib/utils";

interface DispenseTimesHistogramProps {
  data: DataRow[];
  date: Date | undefined;
}

const DispenseTimesHistogram: React.FC<DispenseTimesHistogramProps> = ({ data, date }) => {

  const histogramData = useMemo(() => {
    if (data.length === 0) {
      return [];
    }
    const min = 0;
    const max = 500;
    const binSize = (max - min) / 20;
    const filteredData = date ? data.filter((it) => it.filled_date === formatDate(date)) : data;
    const bins = filteredData.reduce((acc, it) => {
      if (!it.dispense_time) return acc;
      const binIndex = Math.floor((it.dispense_time) / binSize);
      acc[binIndex] += 1;
      return acc;
    }, Array(20).fill(0));

    const formattedData = bins.map((count, index) => ({
      timeRange: `${(index * binSize).toFixed(0)} - ${((index + 1) * binSize).toFixed(0)}`,
      count,
    }));

    return formattedData;
  }, [data, date]);
  

  return (
    <Card className="lg:col-span-3 col-span-full">
      <CardHeader>
        <CardTitle>Doses by dispense time</CardTitle>
      </CardHeader>
      <CardContent className="pl-2 mx-auto w-fit">
        <BarChart margin={{
            top: 10,
            right: 0,
            left: 0,
            bottom: 20,
        }} width={400} height={350} data={histogramData}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="timeRange" >
            <Label offset={-5} value="Dispense time (s)" position="insideBottom" style={{textAnchor: 'middle'}} />
          </XAxis>
          <YAxis >
            <Label offset={10} value="Dose count" angle={-90} position="insideLeft" style={{textAnchor: 'middle'}} />
          </YAxis>
          <Tooltip />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
      </CardContent>
    </Card>
  );
};

export default DispenseTimesHistogram;
