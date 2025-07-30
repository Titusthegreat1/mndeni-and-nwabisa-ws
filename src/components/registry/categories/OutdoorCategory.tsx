import { RegistryItem } from '../types';
import { registryItems } from '../RegistryItems';

// Find items by name matching
const findItemsByNames = (names: string[]): RegistryItem[] => {
  return names.map(name => {
    const item = registryItems.find(item => item.name === name);
    if (!item) {
      console.warn(`Item not found: ${name}`);
    }
    return item;
  }).filter(Boolean) as RegistryItem[];
};

const outdoorNames = [
  "Bamboo Braai Case, 3-Piece",
  "Willow Picnic Basket 4 Person",
  "Villa Wicker Picnic Basket with Cotton Lining",
  "Apron Gift Set",
  "Grip 39 Piece Tool Set GT2015",
  "Ryobi Blower Mulching Vacuum 3000W",
  "Ryobi Circular Saw 1250W",
  "Red Rhino 1700W Pressure Washer 120 Bar",
  "Garden Trimmer 500W",
  "Alva Split Pole Gas Patio Heater Grey 13KW",
  "Talon Petrol Brush Cutter 2 Stroke 43cmᵌ",
  "Cordless Lithium Battery Screwdriver 32pc Set"
];

export const outdoorCategory: RegistryItem[] = findItemsByNames(outdoorNames);