import React from "react";
import { DataFilters } from "../lib/db";
import { Input } from "./ui/input";
import MultipleSelector, { Option } from "@/components/ui/multiple-selector";
import { Container, CONTAINERS } from "@/lib/data/transform";
import { Product } from "@/types";
import { getProduct, products } from "@/lib/products";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { set } from "date-fns";
import { Checkbox } from "./ui/checkbox";
import { SelectLabel } from "./ui/select";

type FilterComponentProps = {
  setFilter: React.Dispatch<React.SetStateAction<DataFilters>>;
  filter: DataFilters;
};

const FilterComponent: React.FC<FilterComponentProps> = ({
  setFilter,
  filter,
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
    <Card className="lg:col-span-4 col-span-full">
      <CardHeader>
        <CardTitle>Filter dispensing data</CardTitle>
      </CardHeader>
      <CardContent className="pl-2 mx-auto w-fit">
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
              no results found.
            </p>
          }
        />
        <ToggleGroup
          type="single"
          onValueChange={(e) => setSelectedContainer(e as Container)}
        >
          {CONTAINERS.map((container) => (
            <ToggleGroupItem key={container} value={container}>
              {container}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <div className="flex flex-row space-x-4 items-center">
          <Checkbox
            checked={filter.QS === undefined ? false : filter.QS}
            onCheckedChange={(_) => {
              if (filter.QS === undefined || filter.QS === false) {
                setFilter({ ...filter, QS: true });
              } else {
                setFilter({ ...filter, QS: undefined});
              }
            }}
          />
          <p>QS</p>
        </div>
        <div className="flex flex-row space-x-4 items-center">
          <Checkbox
            checked={filter.QS === undefined ? false : !filter.QS}
            onCheckedChange={(_) => {
                if (filter.QS === undefined || filter.QS === true) {
                    setFilter({ ...filter, QS: false });
                } else {
                    setFilter({ ...filter, QS: undefined});
                }
            }}
          />
          <p>Not QS</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterComponent;
