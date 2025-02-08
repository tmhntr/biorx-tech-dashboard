import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

type DispenseTimeCardProps = {
  avgDispenseTimeOnDate: number;
  avgDispenseTime: number;
};

const DispenseTimeCard: React.FC<DispenseTimeCardProps> = ({
  avgDispenseTimeOnDate,
  avgDispenseTime,
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Dispense Time</CardTitle>
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
        <div className="text-2xl font-bold">{avgDispenseTimeOnDate.toFixed(0)}s</div>
        <p className="text-xs text-muted-foreground">
          {avgDispenseTimeOnDate > avgDispenseTime ? '+' : ''}
          {((avgDispenseTimeOnDate - avgDispenseTime) * 100 / avgDispenseTime).toFixed(2)}% from period average
        </p>
      </CardContent>
    </Card>
  );
};

export default DispenseTimeCard;
