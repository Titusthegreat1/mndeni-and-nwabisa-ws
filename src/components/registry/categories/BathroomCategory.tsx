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

const bathroomNames = [
  "Circles Resin Tray",
  "Circles Resin Soap Dispenser",
  "Circles Resin Tumbler",
  "Circles Resin Toilet Brush",
  "Layla Blanket Stitch Bath Sheet",
  "Amanda-Jayne Fresh, Zest Reed Diffuser",
  "Layla Blanket Stitch Bath Mat"
];

export const bathroomCategory: RegistryItem[] = findItemsByNames(bathroomNames);