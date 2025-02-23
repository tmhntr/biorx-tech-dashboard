import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

type DispenseStatsCardProps = {
  totalDosesOnDate: number;
  averageDosesPerDay: number;
  avgDispenseTimeOnDate: number | null;
  avgDispenseTime: number;
};

const DispenseStatsCard: React.FC<DispenseStatsCardProps> = ({
  totalDosesOnDate,
  averageDosesPerDay,
  avgDispenseTimeOnDate,
  avgDispenseTime,
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Dispense Stats</CardTitle>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          className="h-4 w-4 text-muted-foreground"
        >
          <rect width="20" height="14" x="2" y="5" rx="2" />
          <path d="M2 10h20" />
        </svg>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {avgDispenseTimeOnDate ? avgDispenseTimeOnDate.toFixed(0) : 'na'}s
        </div>
        <p className="text-xs text-muted-foreground">
          {avgDispenseTimeOnDate ? (avgDispenseTimeOnDate > avgDispenseTime ? '+' : '') : ''}
          {avgDispenseTimeOnDate ? ((avgDispenseTimeOnDate - avgDispenseTime) * 100 / avgDispenseTime).toFixed(2) : 'na'}% from period average
        </p>
        <div className="text-2xl font-bold mt-4">{totalDosesOnDate}</div>
        <p className="text-xs text-muted-foreground">
          {((totalDosesOnDate * 100) / averageDosesPerDay - 100) > 0 && '+'}
          {((totalDosesOnDate * 100) / averageDosesPerDay - 100).toFixed(2)}%
          daily average
        </p>
      </CardContent>
    </Card>
  );
};

export default DispenseStatsCard; 