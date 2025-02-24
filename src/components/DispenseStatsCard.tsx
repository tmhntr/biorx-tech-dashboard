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
  isDateFiltered: boolean;
};

const DispenseStatsCard: React.FC<DispenseStatsCardProps> = ({
  totalDosesOnDate,
  averageDosesPerDay,
  avgDispenseTimeOnDate,
  avgDispenseTime,
  isDateFiltered,
}) => {
  return (
    <Card className="shadow-lg rounded-lg border border-gray-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-blue-50 p-4 rounded-t-lg">
        <CardTitle className="text-lg font-semibold text-blue-700">
          Dispense Stats
        </CardTitle>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          className="h-5 w-5 text-blue-700"
        >
          <rect width="20" height="14" x="2" y="5" rx="2" />
          <path d="M2 10h20" />
        </svg>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold text-gray-800">
              {avgDispenseTimeOnDate ? avgDispenseTimeOnDate.toFixed(0) : "na"}s
            </div>
            <p className="text-sm text-gray-500">Mean Dispense Time</p>
          </div>
          {isDateFiltered && (
            <p className="text-sm text-gray-500">
              {avgDispenseTimeOnDate
                ? avgDispenseTimeOnDate > avgDispenseTime
                  ? "+"
                  : ""
                : ""}
              {avgDispenseTimeOnDate
                ? (
                    ((avgDispenseTimeOnDate - avgDispenseTime) * 100) /
                    avgDispenseTime
                  ).toFixed(2)
                : "na"}
              % from period average
            </p>
          )}
        </div>
        <div className="flex items-center justify-between mt-4">
          <div>
            <div className="text-3xl font-bold text-gray-800">
              {totalDosesOnDate}
            </div>
            <p className="text-sm text-gray-500"># Doses</p>
          </div>
          {isDateFiltered && (
            <p className="text-sm text-gray-500">
              {(totalDosesOnDate * 100) / averageDosesPerDay - 100 > 0 && "+"}
              {((totalDosesOnDate * 100) / averageDosesPerDay - 100).toFixed(2)}
              % daily average
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DispenseStatsCard;
