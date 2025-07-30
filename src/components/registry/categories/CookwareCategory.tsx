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

const cookwareNames = [
  "Ciroa Set of 2 Sieve",
  "Nouvelle Cast Iron 8-Piece Cookware Set - Matt Black",
  "Cast Iron Signature Square Skillet Grill",
  "Oslo Aluminium Pan with Reinforced Ceramic Non-Stick 28cm",
  "Bastille 8 Piece Set | 18/10 Stainless Steel Pot Set"
];

export const cookwareCategory: RegistryItem[] = findItemsByNames(cookwareNames);