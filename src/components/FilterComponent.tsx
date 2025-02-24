import React from "react";
import { DataFilters } from "../lib/db";
import MultipleSelector, { Option } from "@/components/ui/multiple-selector";
import { Container, CONTAINERS } from "@/lib/data/transform";
import { getProduct, products } from "@/lib/products";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";

type FilterComponentProps = {
  setFilter: React.Dispatch<React.SetStateAction<DataFilters>>;
  filter: DataFilters;
  date: Date | undefined;
  setDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
};

const FilterComponent: React.FC<FilterComponentProps> = ({
  setFilter,
  filter,
  date,
  setDate,
}) => {
  const setProducts = (productOptions: Option[]) => {
    const products = productOptions.map((v) => v.value);
    setFilter({ ...filter, product: products.length ? products : undefined });
  };
  const getOptions = (products: string[]) => {
    return products.map((c) => ({
      label: getProduct(c)?.shortName || "fail",
      value: c,
    }));
  };

  const setSelectedContainer = (container: Container) => {
    if (!container) {
      setFilter({ ...filter, container: undefined });
      return;
    }

    setFilter({
      ...filter,
      container: [container],
    });
  };

  return (
    <Card className="shadow-lg rounded-lg border border-gray-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-blue-50 p-4 rounded-t-lg">
        <CardTitle className="text-lg font-semibold text-blue-700">
          Filter Dispensing Data
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Select Products
          </label>
          <MultipleSelector
            value={getOptions(filter.product || [])}
            onChange={setProducts}
            defaultOptions={products.map((p) => ({
              value: p.name,
              label: p.shortName,
            }))}
            placeholder="No filters selected..."
            emptyIndicator={
              <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                No results found.
              </p>
            }
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Select Container
          </label>
          <ToggleGroup
            type="single"
            onValueChange={(e) => setSelectedContainer(e as Container)}
            className="flex space-x-2"
          >
            {CONTAINERS.map((container) => (
              <ToggleGroupItem key={container} value={container}>
                {container}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
        <div className="flex flex-row space-x-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={filter.QS === undefined ? false : filter.QS}
              onCheckedChange={(_) => {
                if (filter.QS === undefined || filter.QS === false) {
                  setFilter({ ...filter, QS: true });
                } else {
                  setFilter({ ...filter, QS: undefined });
                }
              }}
            />
            <p>QS</p>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={filter.QS === undefined ? false : !filter.QS}
              onCheckedChange={(_) => {
                if (filter.QS === undefined || filter.QS === true) {
                  setFilter({ ...filter, QS: false });
                } else {
                  setFilter({ ...filter, QS: undefined });
                }
              }}
            />
            <p>Not QS</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700">
            {date ? `Selected date: ${date.toDateString()}` : "No date selected"}
          </span>
          <Button variant="outline" onClick={() => setDate(undefined)}>
            Clear Date
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterComponent;
