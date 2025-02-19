import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
} from "../components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "../components/ui/toggle-group";
import { Badge } from "../components/ui/badge";
import { Product } from "@/types";
import { Container } from "@/lib/data/transform";

type ControlsCardProps = {
  products: Product[];
  setSelectedProduct: (product: string) => void;
  setSelectedContainer: (container: Container) => void;
};

const ControlsCard: React.FC<ControlsCardProps> = ({
  products,
  setSelectedProduct,
  setSelectedContainer,
}) => {
  return (
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
            onValueChange={(e) => setSelectedContainer(e as Container)}
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
  );
};

export default ControlsCard;
