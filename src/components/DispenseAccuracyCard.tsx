import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

type DispenseAccuracyCardProps = {
  avgDispenseAccuracyOnDate: number;
  avgDispenseAccuracy: number;
};

const DispenseAccuracyCard: React.FC<DispenseAccuracyCardProps> = ({
  avgDispenseAccuracyOnDate,
  avgDispenseAccuracy,
}) => {
  return (
    <Card className="shadow-lg rounded-lg border border-gray-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-blue-50 p-4 rounded-t-lg">
        <CardTitle className="text-lg font-semibold text-blue-700">
          Dispensing accuracy
        </CardTitle>
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
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      </CardHeader>
      <CardContent className="p-4">
        <div className="text-2xl font-bold text-gray-800">
          {avgDispenseAccuracyOnDate ? avgDispenseAccuracyOnDate.toFixed(2) : 'na'}% avg error
        </div>
        <p className="text-xs text-gray-500">
          {avgDispenseAccuracyOnDate ? (avgDispenseAccuracyOnDate > avgDispenseAccuracy ? '+' : '') : ''}
          {avgDispenseAccuracyOnDate ? ((avgDispenseAccuracyOnDate - avgDispenseAccuracy) * 100 / avgDispenseAccuracy).toFixed(2) : 'na'}% from period average
        </p>
      </CardContent>
    </Card>
  );
};

export default DispenseAccuracyCard;
