import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

type DispenseTimeCardProps = {
  avgDispenseTimeOnDate: number | null;
  avgDispenseTime: number;
};

const DispenseTimeCard: React.FC<DispenseTimeCardProps> = ({
  avgDispenseTimeOnDate,
  avgDispenseTime,
}) => {
  return (
    <Card className="bg-gray-100 shadow-md rounded-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold text-gray-800">Dispense Time</CardTitle>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          className="h-5 w-5 text-gray-600"
        >
          <rect width="20" height="14" x="2" y="5" rx="2" />
          <path d="M2 10h20" />
        </svg>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex items-center space-x-2">
          <div className="text-3xl font-bold text-blue-600">
            {avgDispenseTimeOnDate ? avgDispenseTimeOnDate.toFixed(0) : 'na'}s
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-6 w-6 text-blue-600"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          {avgDispenseTimeOnDate ? (avgDispenseTimeOnDate > avgDispenseTime ? '+' : '') : ''}
          {avgDispenseTimeOnDate ? ((avgDispenseTimeOnDate - avgDispenseTime) * 100 / avgDispenseTime).toFixed(2) : 'na'}% from period average
        </p>
      </CardContent>
    </Card>
  );
};

export default DispenseTimeCard;
