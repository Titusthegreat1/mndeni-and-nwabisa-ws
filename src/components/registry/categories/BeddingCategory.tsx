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

const beddingNames = [
  "Verona Seafoam 600TC Egyptian Cotton Duvet Cover Set",
  "Grace Most Lustrous Gold Seal Certified Egyptian Cotton 400 Thread Count Duvet Cover Set Silver",
  "Bungalow Striped Knitted Cotton Throw",
  "Sarra Sherpa Throw",
  "Selina Throw",
  "WHITE 600TC EGYPTIAN COTTON FITTED SHEET",
  "WHITE 600TC EGYPTIAN COTTON FLAT SHEET"
];

export const beddingCategory: RegistryItem[] = findItemsByNames(beddingNames);