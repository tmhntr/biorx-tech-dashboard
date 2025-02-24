import { formatDate } from "../utils";
import { RawDataRow } from "./extract";

export type Container = "vial" | "1cc" | "3cc" | "5cc" | "10cc";
export const CONTAINERS = ["vial", "1cc", "3cc", "5cc", "10cc"] as Container[];
export type DataRow = {
  RXNumber: number;
  product_name: string;
  tech_name: string;
  activity: number;
  actual_activity: number;
  procedure: string;
  volume: number;
  final_volume: number;
  notes: string;
  filled_datetime: string;
  filled_date: string;
  dispense_time: number | null;
  activity_error: number | null;
  container: Container;
  QS: boolean;
};

const getRowDate = (row: RawDataRow): string => {
  return formatDate(row.filled_date);
};

const getRowDatetime = (row: RawDataRow): string => {
  const date = new Date(row.filled_date);
  const time = new Date(row.filled_time);
  const filled_datetime =
    date.toISOString().slice(0, 10) +
    "T" +
    time.toISOString().slice(11, 19) +
    ".000";
  return filled_datetime;
};

const getContainer = (row: RawDataRow): Container => {
  const final_volume = row.final_volume;
  const procedure = row.procedure;
  if (procedure.startsWith("Vial")) return "vial";
  else if (final_volume < 0.39) return "1cc";
  else if (final_volume < 1.49) return "3cc";
  else if (final_volume < 2.5) return "5cc";
  else return "10cc";
};

const getActivityError = (row: RawDataRow): number | null => {
  const activity_error =
    ((row.actual_activity - row.activity) * 100) / row.activity;
  return activity_error >= 0 && activity_error <= 10 ? activity_error : null;
};

const getQS = (row: RawDataRow): boolean => {
    if (row.notes === undefined) {
        return false;
    }
  return row.notes.toLowerCase().includes("qs") || row.notes.toLowerCase().includes("ml");
};

const transformRow = (row: RawDataRow): DataRow => {
  return {
    RXNumber: row.RXNumber,
    product_name: row.product_name,
    tech_name: row.tech_name,
    activity: row.activity,
    actual_activity: row.actual_activity,
    procedure: row.procedure,
    volume: row.volume,
    final_volume: row.final_volume,
    notes: row.notes,
    filled_datetime: getRowDatetime(row),
    filled_date: getRowDate(row),
    dispense_time: null,
    activity_error: getActivityError(row),
    container: getContainer(row),
    QS: getQS(row),
  };
};

const cleanRawData = (data: RawDataRow[]): RawDataRow[] => {
  // Remove rows with missing data
  return data.filter(
    (row) =>
      row.product_name &&
      row.tech_name &&
      row.filled_date &&
      row.filled_time &&
      row.activity &&
      row.actual_activity &&
      row.procedure &&
      row.volume &&
      row.final_volume
  );
};

const cleanData = (data: DataRow[]): DataRow[] => {
  // Remove rows with missing data
  return data
    .map((r) => {
      const dispense_time = !r.dispense_time
        ? null
        : r.dispense_time < 0 && r.dispense_time > 60 * 30
        ? null
        : r.dispense_time;

      const activity_error = !r.activity_error
        ? null
        : r.activity_error >= 0 && r.activity_error <= 10
        ? r.activity_error
        : null;
      return {
        ...r,
        dispense_time,
        activity_error,
      };
    })
    .filter(
      (row) => row.actual_activity > 0 && row.volume > 0 && row.final_volume > 0
    );
};

const transformData = (_data: RawDataRow[]): DataRow[] => {
  const rawData = cleanRawData(_data);
  var data = rawData.map(transformRow);

  //   calculate dispense times
  data.sort((a, b) => {
    return a.filled_datetime.localeCompare(b.filled_datetime);
  });
  data.forEach((row, i) => {
    if (i > 0 && row.product_name === data[i - 1].product_name) {
      row.dispense_time =
        (new Date(row.filled_datetime).getTime() -
          new Date(data[i - 1].filled_datetime).getTime()) /
        1000;
      if (row.dispense_time < 0 || row.dispense_time > 60 * 30) {
        row.dispense_time = null;
      }
    }
  });
  data = cleanData(data);

  return data;
};

export default transformData;
