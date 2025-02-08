import { Product } from "../types";

// ['Mertiatide Tc-99m', 'Medronate Tc-99m', 'MAA Tc-99m', 'Sestamibi Tc-99m', 'WBC Tc-99m', 'Filter Sulfur Colloid Tc-99m', 'Sulfur Colloid Tc-99m', 'Tetrofosmin Tc-99m', 'WBC Case In-111', 'Pertechnetate Tc-99m', 'Pentetate Tc-99m', 'Disofenin Tc-99m', 'Ga-67 Gallium Citrate', 'WBC In-111', 'Gluceptate Tc-99m', 'WBC Case Tc-99m']

export const products: Product[] = [
  { name: "Mertiatide Tc-99m", shortName: "mag3", color: "bg-purple-500" },
  { name: "Medronate Tc-99m", shortName: "mdp", color: "bg-blue-500" },
  { name: "MAA Tc-99m", shortName: "maa", color: "bg-grey-500" },
  { name: "Sestamibi Tc-99m", shortName: "mibi", color: "bg-red-500" },
  {
    name: "Filter Sulfur Colloid Tc-99m",
    shortName: "s-coll-f",
    color: "bg-lime-500",
  },
  {
    name: "Sulfur Colloid Tc-99m",
    shortName: "s-coll",
    color: "bg-emerald-500",
  },
  { name: "Tetrofosmin Tc-99m", shortName: "myoview", color: "bg-blue-500" },
  { name: "Pertechnetate Tc-99m", shortName: "pertec", color: "bg-white-500" },
  { name: "Pentetate Tc-99m", shortName: "dtpa", color: "bg-yellow-500" },
  { name: "Disofenin Tc-99m", shortName: "diso", color: "bg-grey-500" },
  { name: "Ga-67 Gallium Citrate", shortName: "ga-67", color: "bg-blue-500" },
  { name: "Gluceptate Tc-99m", shortName: "gluco", color: "bg-brown-500" },
  // { name: 'WBC Case In-111', shortName: "wbc-in", color: "bg-blue-500" },
  // { name: 'WBC Case Tc-99m', shortName: "wbc-case", color: "bg-blue-500" },
];
