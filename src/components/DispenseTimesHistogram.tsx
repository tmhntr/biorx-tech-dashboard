import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Label } from "recharts";
import { DataRow } from "@/lib/data";

interface DispenseTimesHistogramProps {
  data: DataRow[];
}

const DispenseTimesHistogram: React.FC<DispenseTimesHistogramProps> = ({ data }) => {
  const [histogramData, setHistogramData] = useState<{ timeRange: string; count: number }[]>([]);

  useEffect(() => {
    const bins = Array(20).fill(0);
    const min = 0;
    const max = 500;
    // const max = data.reduce((acc, it) => Math.max(acc, it.dispense_time || 0), 0);
    const binSize = (max - min) / bins.length;

    data.forEach((row) => {
        if (!row.dispense_time) return;
        if (row.dispense_time < min || row.dispense_time > max) return;
      const binIndex = Math.floor((row.dispense_time) / binSize);
      bins[binIndex] += 1;
    });

    const formattedData = bins.map((count, index) => ({
      timeRange: `${(index * binSize).toFixed(0)} - ${((index + 1) * binSize).toFixed(0)}`,
      count,
    }));

    setHistogramData(formattedData);
  }, [data]);

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
