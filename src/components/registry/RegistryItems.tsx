
import { dinnerwareItems } from './items/DinnerwareItems';
import { kitchenwareItems } from './items/KitchenwareItems';
import { servewareItems } from './items/ServewareItems';
import { appliancesItems } from './items/AppliancesItems';
import { cookwareItems } from './items/CookwareItems';
import { homeDecorItems } from './items/HomeDecorItems';
import { bathroomItems } from './items/BathroomItems';
import { outdoorToolsItems } from './items/OutdoorToolsItems';

export type { RegistryItem } from './types';

// Combine all registry items and reorder: move pages 3-4 to front, pages 1-2 to end
const allItems = [
  ...dinnerwareItems,
  ...kitchenwareItems,
  ...servewareItems,
  ...appliancesItems,
  ...cookwareItems,
  ...homeDecorItems,
  ...bathroomItems,
  ...outdoorToolsItems
].sort((a, b) => a.id - b.id);

// Rearrange: Pages 3-4 (items 13-24) become pages 1-2, Pages 1-2 (items 1-12) go to end
export const registryItems = [
  ...allItems.slice(12, 24), // Original pages 3-4 (items 13-24) become new pages 1-2
  ...allItems.slice(24),     // Everything after page 4 stays in order
  ...allItems.slice(0, 12)   // Original pages 1-2 (items 1-12) go to the end
];
