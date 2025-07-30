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

const utensilsNames = [
  "Oven Glove Long Arm Single Silicone Grey",
  "Contemp Cutlery Serving Spoon Set Of 2 Silver",
  "Performance Stainless Steel Serving Spoons, Set of 2",
  "@home Lara 10pc Utensil Set with Holder",
  "Laguna Cutlery 16 Piece Set Silver",
  "Milano Stainless Steel Cutlery Set 16 Piece",
  "Wolstead Insignia Knife Block Set, 5-Piece",
  "Cuisine::pro Sabre Knife Block 9Pc"
];

export const utensilsCategory: RegistryItem[] = findItemsByNames(utensilsNames);