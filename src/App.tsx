import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Input } from "./components/ui/input";
import React from "react";
import { CalendarDatePicker } from "./components/calendar-date-picker";
import DispenseAccuracyCard from "./components/DispenseAccuracyCard";
import DispenseTimesHistogram from "./components/DispenseTimesHistogram";
import AverageDispenseTimesCard from "./components/AverageDispenseTimesCard";
import transformData, { DataRow } from "./lib/data/transform";
import { Upload } from "lucide-react";
import {
  DataFilters,
  initDB,
  queryDataRowsFromIndexedDB,
  saveDataRowsToIndexedDB,
} from "./lib/db";
import extractData from "./lib/data/extract";
import { formatDate } from "./lib/utils";
import FilterComponent from "./components/FilterComponent";
import DispenseStatsCard from "./components/DispenseStatsCard";
import DosesByProductChart from "./components/DosesByProductChart";

type Window = "1 month" | "3 months" | "6 months";
export const window_length: Window = "3 months";

export default function DashboardPage() {
  const [isDBReady, setIsDBReady] = React.useState<boolean>(false);
  const [filter, setFilter] = React.useState<DataFilters>({});
  const [date, setDate] = React.useState<Date | undefined>(undefined);

  const handleInitDB = async () => {
    if (isDBReady) return;
    const status = await initDB();
    setIsDBReady(status);
  };
  handleInitDB();
  const [data, setData] = React.useState<DataRow[]>([]);

  React.useEffect(() => {
    // if current date is not in the data, set the date to the last filled date
    if (data.length === 0) return;
    if (date && !data.some((row) => row.filled_date === formatDate(date))) {
      setDate(undefined);
    }
  }, [data]);

  const refreshData = async () => {
    setData(
      (await queryDataRowsFromIndexedDB(filter)).sort(
        (a, b) =>
          new Date(a.filled_date).getTime() - new Date(b.filled_date).getTime()
      )
    );
  };
  React.useEffect(() => {
    // console log all unique product_name
    if (!isDBReady) return;
    refreshData();
  }, [filter, isDBReady]);

  const dateFilteredData = React.useMemo(() => {
    if (!date) return data;
    return data.filter((row) => row.filled_date === formatDate(date));
  }, [data, date]);

  const stats = React.useMemo(() => {
    console.log(data)
    return {
      totalDosesOnDate: dateFilteredData.length,
      avgDispenseTimeOnDate:
        dateFilteredData.reduce((acc, row) => acc + (row.dispense_time || 0), 0) /
        dateFilteredData.length,
      averageDosesPerDay:
        data.length / new Set(data.map((row) => row.filled_date)).size,
      avgDispenseAccuracyOnDate:
        dateFilteredData.reduce((acc, row) => acc + (row.activity_error || 0), 0) /
        dateFilteredData.length,
      avgDispenseAccuracy:
        data.reduce((acc, row) => acc + (row.activity_error || 0), 0) /
        data.length,
      avgDispenseTime:
        data.reduce((acc, row) => acc + (row.dispense_time || 0), 0) /
        data.length,
    };
  }, [dateFilteredData]);

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
              <div className="relative cursor-pointer border border-dashed border-muted-foreground rounded-md p-2 hover:bg-accent transition-colors duration-200 group ">
                <label htmlFor="file" className="cursor-pointer">
                  <Upload className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                  <Input
                    id="file"
                    type="file"
                    className="hidden"
                    placeholder="Upload a xls file"
                    accept=".xls"
                    aria-valuetext="Upload a xls file"
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
                </label>
              </div>
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
                  if (from === undefined || to === undefined) {
                    setFilter((f) => ({
                      ...f,
                      filled_datetime: undefined,
                    }));
                    return;
                  }
                  console.log(from, to);
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
                <FilterComponent setFilter={setFilter} filter={filter} date={date} setDate={setDate} />
                <DispenseStatsCard
                  totalDosesOnDate={stats.totalDosesOnDate}
                  averageDosesPerDay={stats.averageDosesPerDay}
                  avgDispenseTimeOnDate={stats.avgDispenseTimeOnDate}
                  avgDispenseTime={stats.avgDispenseTime}
                  isDateFiltered={!!date}
                />
                <DosesByProductChart data={data} date={date} filter={filter} />
                <DispenseAccuracyCard
                  avgDispenseAccuracyOnDate={stats.avgDispenseAccuracyOnDate}
                  avgDispenseAccuracy={stats.avgDispenseAccuracy}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <AverageDispenseTimesCard
                  data={data}
                  date={date}
                  setDate={setDate}
                  filter={filter}
                />
                <DispenseTimesHistogram data={data} date={date} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
