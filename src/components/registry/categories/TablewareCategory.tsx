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

const tablewareNames = [
  "Estilo 4 Piece Printed Coaster Set",
  "Natural Earth Stone Round Tablecloth (6-8seater)",
  "Lacasa Pourer w/Gold Rim White",
  "Lacasa Sugar Pot w/Gold Rim White",
  "Jute Edge Placemat Black 38cm",
  "Lacasa Teapot With Gold Trim 1100ml",
  "Lacasa Cup and Saucer With Gold Trim 4 set",
  "Gold Border Cotton Table Runner Navy",
  "Country Striped Table Runner, 3m",
  "Blaire Round Cotton Tablecloth White",
  "Wooden Grinder Set 2 Piece",
  "Milk Jug – Face Facts",
  "Canister with Lid Set of 3 – Sketchbook",
  "Cup and Saucer – It's a Secret",
  "Mug Set of 4 – Let's Face It",
  "Cup and Saucer – Face Facts",
  "Le Creuset Calm Collection Mugs (Set of 4)",
  "Stoneware Oval Spoon Rest",
  "Le Creuset Set of 4 Tasting Cups",
  "Synergy Leaves Cork Coasters 4 Pack",
  "Wood Veneer Placemat",
  "Fossil Marble Wine Coaster Beige",
  "Lacasa Mug With Gold Trim 420ml"
];

export const tablewareCategory: RegistryItem[] = findItemsByNames(tablewareNames);