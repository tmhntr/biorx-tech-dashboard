import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Input } from "./components/ui/input";
import React from "react";
import { CalendarDatePicker } from "./components/calendar-date-picker";
import DosesCard from "./components/DosesCard";
import DispenseAccuracyCard from "./components/DispenseAccuracyCard";
import DispenseTimeCard from "./components/DispenseTimeCard";
import DispenseTimesHistogram from "./components/DispenseTimesHistogram";
import AverageDispenseTimesCard from "./components/AverageDispenseTimesCard";
import transformData, { DataRow } from "./lib/data/transform";
import {
  DataFilters,
  initDB,
  queryDataRowsFromIndexedDB,
  saveDataRowsToIndexedDB,
} from "./lib/db";
import extractData from "./lib/data/extract";
import { formatDate } from "./lib/utils";
import { Card } from "./components/ui/card";
import FilterComponent from "./components/FilterComponent";

type Window = "1 month" | "3 months" | "6 months";
export const window_length: Window = "3 months";

export default function DashboardPage() {
  const [isDBReady, setIsDBReady] = React.useState<boolean>(false);
  const [filter, setFilter] = React.useState<DataFilters>({});
  const [date, _] = React.useState(new Date());

  const handleInitDB = async () => {
    if (isDBReady) return;
    const status = await initDB();
    setIsDBReady(status);
  };
  handleInitDB();
  const [data, setData] = React.useState<DataRow[]>([]);

  const refreshData = async () => {
    setData(await queryDataRowsFromIndexedDB(filter));
  };
  React.useEffect(() => {
    // console log all unique product_name
    if (!isDBReady) return;
    refreshData();
  }, [filter, isDBReady]);

  const totalDosesOnDate = data.filter(
    (row) => row.filled_date === formatDate(date)
  ).length;
  const averageDosesPerDay =
    data.length / new Set(data.map((row) => row.filled_date)).size;

  const avgDispenseTimeOnDate =
    data
      .filter((row) => row.filled_date === formatDate(date))
      .reduce((acc, row) => {
        if (row.dispense_time) {
          return acc + row.dispense_time;
        } else {
          return acc;
        }
      }, 0) / totalDosesOnDate;
  const avgDispenseTime =
    data.reduce((acc, row) => {
      if (row.dispense_time) {
        return acc + row.dispense_time;
      } else {
        return acc;
      }
    }, 0) / data.length;

  const avgDispenseAccuracyOnDate =
    data
      .filter((row) => row.filled_date === formatDate(date))
      .reduce((acc, row) => {
        return acc + (row.activity_error || 0);
      }, 0) / totalDosesOnDate;
  const avgDispenseAccuracy =
    data.reduce((acc, row) => {
      return acc + (row.activity_error || 0);
    }, 0) / data.length;

  return (
    <>
      <div className="md:hidden">
        <img
          src="/examples/dashboard-light.png"
          width={1280}
          height={866}
          alt="Dashboard"
          className="block dark:hidden"
        />
        <img
          src="/examples/dashboard-dark.png"
          width={1280}
          height={866}
          alt="Dashboard"
          className="hidden dark:block"
        />
      </div>
      <div className="hidden flex-col md:flex">
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            {/* <TeamSwitcher /> */}
            {/* <MainNav className="mx-6" /> */}
            <div className="ml-auto flex items-center space-x-4">
              {/* <Search /> */}
              {/* <UserNav /> */}
            </div>
          </div>
        </div>
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <div className="flex items-center space-x-2">
              <CalendarDatePicker
                date={{
                  from: filter.filled_datetime?.start
                    ? new Date(filter.filled_datetime.start)
                    : undefined,
                  to: filter.filled_datetime?.end
                    ? new Date(filter.filled_datetime.end)
                    : undefined,
                }}
                onDateSelect={({ from, to }) => {
                  setFilter((f) => ({
                    ...f,
                    filled_datetime: {
                      start: formatDate(from),
                      end: formatDate(to),
                    },
                  }));
                }}
                variant="outline"
                numberOfMonths={2}
                className="min-w-[250px]"
              />
              
              <Input
                id="file"
                type="file"
                onChange={async (e) => {
                  console.log(e.target.files);
                  if (e.target.files) {
                    const file = e.target.files[0];
                    const data = transformData(await extractData(file));
                    saveDataRowsToIndexedDB(data);
                    refreshData();
                  }
                }}
              />
            </div>
          </div>
          <Tabs defaultValue="dispensing" className="space-y-4">
            <TabsList>
              <TabsTrigger value="dispensing">Dispensing</TabsTrigger>
              <TabsTrigger value="compounding" disabled>
                Compounding
              </TabsTrigger>
              <TabsTrigger value="qc" disabled>
                Quality Control
              </TabsTrigger>
            </TabsList>
            <TabsContent value="dispensing" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                <FilterComponent setFilter={setFilter} filter={filter} />
                </Card>
                <DosesCard
                  totalDosesOnDate={totalDosesOnDate}
                  averageDosesPerDay={averageDosesPerDay}
                />
                <DispenseTimeCard
                  avgDispenseTimeOnDate={avgDispenseTimeOnDate}
                  avgDispenseTime={avgDispenseTime}
                />
                <DispenseAccuracyCard
                  avgDispenseAccuracyOnDate={avgDispenseAccuracyOnDate}
                  avgDispenseAccuracy={avgDispenseAccuracy}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <AverageDispenseTimesCard data={data} />
                <DispenseTimesHistogram data={data} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
