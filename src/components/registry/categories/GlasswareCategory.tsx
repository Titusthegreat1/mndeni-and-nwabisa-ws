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

const glasswareNames = [
  "Guesthouse Crystal White Wine Glasses",
  "Leela Crystal Red Wine Glasses 4 Pack",
  "Guesthouse Champagne Crystal Glasses"
];

export const glasswareCategory: RegistryItem[] = findItemsByNames(glasswareNames);