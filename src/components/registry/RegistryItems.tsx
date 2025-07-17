
import { giftItems } from './items/GiftItems';
import { dinnerwareItems } from './items/DinnerwareItems';
import { kitchenwareItems } from './items/KitchenwareItems';
import { servewareItems } from './items/ServewareItems';
import { appliancesItems } from './items/AppliancesItems';
import { cookwareItems } from './items/CookwareItems';
import { homeDecorItems } from './items/HomeDecorItems';
import { bathroomItems } from './items/BathroomItems';
import { outdoorToolsItems, newOutdoorToolsItems } from './items/OutdoorToolsItems';

export type { RegistryItem } from './types';

// Combine all registry items with gift items at the beginning
const allOtherItems = [
  ...dinnerwareItems,
  ...kitchenwareItems,
  ...servewareItems,
  ...appliancesItems,
  ...cookwareItems,
  ...homeDecorItems,
  ...bathroomItems,
  ...outdoorToolsItems
].sort((a, b) => a.id - b.id);

// Put gift items at the beginning, then rearrange other items: move pages 3-4 to front, pages 1-2 to end
export const registryItems = [
  ...giftItems,              // New gift items come first
  ...allOtherItems.slice(12, 24), // Original pages 3-4 (items 13-24) become new pages 1-2
  ...allOtherItems.slice(24),     // Everything after page 4 stays in order
  ...allOtherItems.slice(0, 12),   // Original pages 1-2 (items 1-12) go to the end
  ...newOutdoorToolsItems          // New outdoor tools items appear on page 17
];
