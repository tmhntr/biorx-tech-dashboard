import { read, utils } from "xlsx";

export type RawDataRow = {
    product_name: string;
    tech_name: string;
    filled_time: Date;
    filled_date: Date;
    activity: number;
    actual_activity: number;
    procedure: string;
    volume: number;
    final_volume: number;
    notes: string;
};

const extractData = async (file: File): Promise<RawDataRow[]> => {
  var ab = await file.arrayBuffer();

  const wb = read(ab, { cellDates: true, UTC: true });
  const ws = wb.Sheets[wb.SheetNames[0]]; // get the first worksheet
  const data = utils.sheet_to_json(ws, {
    UTC: true,
  }) as RawDataRow[];

  return data;
};

export default extractData;