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

const servewareNames = [
  "Signature Crystal Drink Dispenser with Wooden Stand",
  "Fluente Serveware Salad Bowl Porcelain",
  "Fluted Butter Dish White 22cm Fluted",
  "Rectangular Serveware Platter White",
  "Flutter Large Oval Platter",
  "Flutter Small Oval Platter",
  "Hatty Oval Platter",
  "Josephine Oval Board",
  "Cast Iron Signature Shallow Casserole",
  "Le Creuset Iris Serving Bowl",
  "Le Creuset Sea Salt Stoneware Butter Crock 170ml",
  "Brown Round Wood Serving Board",
  "Lava Stainless Steel Salad Server Set 2 Pack",
  "Glass Serveware Cake Stand 3 Feet Glass Dome",
  "Acacia Wood Round Base Cake Stand",
  "Nolan Tongs",
  "Glass Food Containers, Set of 5",
  "Speckle Round Casserole With Tray Lid, 3L",
  "Epicurious Rectangular Baker with Lid, 32cm",
  "Cirqula Shallow Rectangular Multi Bowl Set, 3-Piece",
  "Aurora Round Porcelain Casserole With Lid 30cm",
  "Aurora Rectangle Porcelain Casserole With Lid 32cm"
];

export const servewareCategory: RegistryItem[] = findItemsByNames(servewareNames);