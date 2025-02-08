import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "./components/ui/toggle-group";
import { Input } from "./components/ui/input";
import { read, utils } from "xlsx";
import React from "react";
import {
  processRows,
  SheetRow,
  saveDataRowsToIndexedDB,
  queryDataRowsFromIndexedDB,
  Container,
  DataRow,
} from "@/lib/data";
import { CalendarPopover } from "./components/calendar-popover";
import { addDays, addMonths } from "date-fns";
import { Badge } from "./components/ui/badge";

type Product = {
  name: string;
  shortName: string;
  color: string;
};

// ['Mertiatide Tc-99m', 'Medronate Tc-99m', 'MAA Tc-99m', 'Sestamibi Tc-99m', 'WBC Tc-99m', 'Filter Sulfur Colloid Tc-99m', 'Sulfur Colloid Tc-99m', 'Tetrofosmin Tc-99m', 'WBC Case In-111', 'Pertechnetate Tc-99m', 'Pentetate Tc-99m', 'Disofenin Tc-99m', 'Ga-67 Gallium Citrate', 'WBC In-111', 'Gluceptate Tc-99m', 'WBC Case Tc-99m']

export const products: Product[] = [
  { name: 'Mertiatide Tc-99m', shortName: "mag3", color: "bg-purple-500" },
  { name: 'Medronate Tc-99m', shortName: "mdp", color: "bg-blue-500" },
  { name: 'MAA Tc-99m', shortName: "maa", color: "bg-grey-500" },
  { name: 'Sestamibi Tc-99m', shortName: "mibi", color: "bg-red-500" },
  { name: 'Filter Sulfur Colloid Tc-99m', shortName: "s-coll-f", color: "bg-lime-500" },
  { name: 'Sulfur Colloid Tc-99m', shortName: "s-coll", color: "bg-emerald-500" },
  { name: 'Tetrofosmin Tc-99m', shortName: "myoview", color: "bg-blue-500" },
  { name: 'Pertechnetate Tc-99m', shortName: "pertec", color: "bg-white-500" },
  { name: 'Pentetate Tc-99m', shortName: "dtpa", color: "bg-yellow-500" },
  { name: 'Disofenin Tc-99m', shortName: "diso", color: "bg-grey-500" },
  { name: 'Ga-67 Gallium Citrate', shortName: "ga-67", color: "bg-blue-500" },
  { name: 'Gluceptate Tc-99m', shortName: "gluco", color: "bg-brown-500" },
  // { name: 'WBC Case In-111', shortName: "wbc-in", color: "bg-blue-500" },
  // { name: 'WBC Case Tc-99m', shortName: "wbc-case", color: "bg-blue-500" },
];

export default function DashboardPage() {
  const [data, setData] = React.useState<DataRow[]>([]);
  const [date, setDate] = React.useState<Date | undefined>(
    new Date(Date.now())
  );
  const [selectedProduct, setSelectedProduct] = React.useState<
    string | undefined
  >(undefined);
  const [selectedContainer, setSelectedContainer] = React.useState<
    Container | undefined
  >(undefined);
  React.useEffect(() => {
    // console log all unique product_name
    (async () => {
      setData(
        await queryDataRowsFromIndexedDB({
          product: selectedProduct,
          container: selectedContainer,
          filled_datetime: date && {
            end: date?.toISOString(),
            start: addMonths(date, -1).toISOString(),
          },
        })
      );
      // console.log(data);
    })();

  }, [setDate, selectedProduct, selectedContainer]);
  const totalDosesOnDate = data.filter((row) => new Date(row.filled_datetime).toDateString() === date?.toDateString()).length;
  const averageDosesPerDay = data.length / new Set(data.map(row => new Date(row.filled_datetime).toDateString())).size;

  const avgDispenseTimeOnDate = data.filter((row) => new Date(row.filled_datetime).toDateString() === date?.toDateString()).reduce((acc, row) => {
    if (row.dispense_time) {
      return acc + row.dispense_time;
    } else {
      return acc;
    }
  }, 0) / totalDosesOnDate;
  const avgDispenseTime = data.reduce((acc, row) => {
    if (row.dispense_time) {
      return acc + row.dispense_time;
    } else {
      return acc;
    }
  }, 0) / data.length;

  const avgDispenseAccuracyOnDate = data.filter((row) => new Date(row.filled_datetime).toDateString() === date?.toDateString()).reduce((acc, row) => {
    return acc + row.activity_error;
  }, 0) / totalDosesOnDate;
  const avgDispenseAccuracy = data.reduce((acc, row) => {
    return acc + row.activity_error;
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
              <CalendarPopover value={date} onChange={setDate} />
              <Input
                id="file"
                type="file"
                onChange={async (e) => {
                  console.log(e.target.files);
                  if (e.target.files) {
                    const file = e.target.files[0];
                    var ab = await file.arrayBuffer();

                    const wb = read(ab, { cellDates: true, UTC: true });
                    const ws = wb.Sheets[wb.SheetNames[0]]; // get the first worksheet
                    const data = utils.sheet_to_json(ws, {UTC: true}) as SheetRow[];
                    const processedData = processRows(data);
                    console.log(processedData);
                    await saveDataRowsToIndexedDB(processedData);
                    setData(await queryDataRowsFromIndexedDB({}));
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
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    {/* <CardTitle className="text-md font-medium">
                      Controls
                    </CardTitle> */}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="text-md font-medium">Product</h3>
                      <Select onValueChange={setSelectedProduct}>
                        <SelectTrigger className="">
                          <SelectValue placeholder="Select a product" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {/* <SelectLabel>Fruits</SelectLabel> */}
                            {products.map((product) => (
                              <SelectItem key={product.name} value={product.name}>
                                <Badge
                                  className={`rounded-full h-2 w-2 mr-2 ${product.color}`}
                                />
                                {product.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <h3 className="text-md font-medium">Container type</h3>
                      <ToggleGroup
                        type="single"
                        onValueChange={(e) => setSelectedContainer(e)}
                      >
                        {(
                          ["vial", "1cc", "3cc", "5cc", "10cc"] as Container[]
                        ).map((container) => (
                          <ToggleGroupItem key={container} value={container}>
                            {container}
                          </ToggleGroupItem>
                        ))}
                      </ToggleGroup>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Doses</CardTitle>
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
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {
                        totalDosesOnDate
                      }</div>
                    <p className="text-xs text-muted-foreground">
                    {((totalDosesOnDate * 100) / averageDosesPerDay - 100) > 0 && '+'}{((totalDosesOnDate * 100) / averageDosesPerDay - 100).toFixed(2)}% daily average
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Dispense Time
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
                      <rect width="20" height="14" x="2" y="5" rx="2" />
                      <path d="M2 10h20" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{avgDispenseTimeOnDate.toFixed(0)}s</div>
                    <p className="text-xs text-muted-foreground">
                      {
                        avgDispenseTimeOnDate > avgDispenseTime ? '+' : ''
                      }{((avgDispenseTimeOnDate - avgDispenseTime) * 100 /avgDispenseTime).toFixed(2)}% from period average
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
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
                  <CardContent>
                    <div className="text-2xl font-bold">{avgDispenseAccuracyOnDate.toFixed(2)}% avg error</div>
                    <p className="text-xs text-muted-foreground">
                      {
                        avgDispenseAccuracyOnDate > avgDispenseAccuracy ? '+' : ''
                      }{((avgDispenseAccuracyOnDate - avgDispenseAccuracy) * 100 / avgDispenseAccuracy).toFixed(2)}% from period average
                    </p>
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    {/* <Overview /> */}
                  </CardContent>
                </Card>
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Recent Sales</CardTitle>
                    <CardDescription>
                      You made 265 sales this month.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>{/* <RecentSales /> */}</CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
