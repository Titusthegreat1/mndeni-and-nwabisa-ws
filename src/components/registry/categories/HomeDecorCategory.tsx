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

const homeDecorNames = [
  "Multi Colour Maize Basket Large",
  "Barrel Vase Large",
  "Milky Finish Round Vase"
];

export const homeDecorCategory: RegistryItem[] = findItemsByNames(homeDecorNames);