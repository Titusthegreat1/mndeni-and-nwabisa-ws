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

const applianceNames = [
  "Philips 3000 Series Handheld Garment Steamer with Metal Steam Plate, 1000W",
  "@home Extendable Pot Stand",
  "Delonghi Icona Metallics 4 Slice Toaster",
  "Delonghi Icona Metallics Electric Kettle",
  "Philips 3000 Series 9L Dual Basket Air Fryer",
  "Nutribullet Pro 900W High-Speed Blender",
  "Nespresso Vertuo Next Coffee Machine & Aeroccino Milk Frother",
  "Kenwood Accent Collection Centrifugal Juicer",
  "Nutribullet Blender Pro Matt Jade 900W",
  "Buddy Knocked Down Paper Towel Holder",
  "Progressive Onion Chopper",
  "Cuisine::pro Electric Knife Sharpener"
];

export const appliancesCategory: RegistryItem[] = findItemsByNames(applianceNames);