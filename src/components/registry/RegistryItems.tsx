
import { dinnerwareItems } from './items/DinnerwareItems';
import { kitchenwareItems } from './items/KitchenwareItems';
import { servewareItems } from './items/ServewareItems';
import { appliancesItems } from './items/AppliancesItems';
import { cookwareItems } from './items/CookwareItems';
import { homeDecorItems } from './items/HomeDecorItems';
import { bathroomItems } from './items/BathroomItems';
import { outdoorToolsItems } from './items/OutdoorToolsItems';

export type { RegistryItem } from './types';

// Combine all registry items
export const registryItems = [
  ...dinnerwareItems,
  ...kitchenwareItems,
  ...servewareItems,
  ...appliancesItems,
  ...cookwareItems,
  ...homeDecorItems,
  ...bathroomItems,
  ...outdoorToolsItems
].sort((a, b) => a.id - b.id);
