import { Product } from "../types";

// ['Mertiatide Tc-99m', 'Medronate Tc-99m', 'MAA Tc-99m', 'Sestamibi Tc-99m', 'WBC Tc-99m', 'Filter Sulfur Colloid Tc-99m', 'Sulfur Colloid Tc-99m', 'Tetrofosmin Tc-99m', 'WBC Case In-111', 'Pertechnetate Tc-99m', 'Pentetate Tc-99m', 'Disofenin Tc-99m', 'Ga-67 Gallium Citrate', 'WBC In-111', 'Gluceptate Tc-99m', 'WBC Case Tc-99m']

export const products: Product[] = [
  { name: "Mertiatide Tc-99m", shortName: "mag3", color: "#a855f7" },
  { name: "Medronate Tc-99m", shortName: "mdp", color: "#3b82f6" },
  { name: "MAA Tc-99m", shortName: "maa", color: "#737373" },
  { name: "Sestamibi Tc-99m", shortName: "mibi", color: "#ef4444", color_2: "#808080" },
  {
    name: "Filter Sulfur Colloid Tc-99m",
    shortName: "s-coll-f",
    color: "#84cc16", // emerald
    color_2: "#f59e0b", // yellow
  },
  {
    name: "Sulfur Colloid Tc-99m",
    shortName: "s-coll",
    color: "#10b981", // emerald
  },
  { name: "Tetrofosmin Tc-99m", shortName: "myoview", color: "#3b82f6", color_2: "#000000" },
  { name: "Pertechnetate Tc-99m", shortName: "pertec", color: "#f3f4f6" },
  { name: "Pentetate Tc-99m", shortName: "dtpa", color: "#f59e0b" },
  { name: "Disofenin Tc-99m", shortName: "diso", color: "#737373", color_2: "#000000" },
  { name: "Ga-67 Gallium Citrate", shortName: "ga-67", color: "#3b82f6" },
  { name: "Gluceptate Tc-99m", shortName: "gluco", color: "#a16207" },
  // { name: 'WBC Case In-111', shortName: "wbc-in", color: "#3b82f6" },
  // { name: 'WBC Case Tc-99m', shortName: "wbc-case", color: "#3b82f6" },
];

export const getProduct = (name: string) => {
  return products.find((p) => p.name === name);
};
