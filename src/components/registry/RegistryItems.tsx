import { appliancesCategory } from './categories/AppliancesCategory';
import { bathroomCategory } from './categories/BathroomCategory';
import { cookwareCategory } from './categories/CookwareCategory';
import { tablewareCategory } from './categories/Tableware';
import { servewareCategory } from './categories/ServewareCategory';
import { utensilsCategory } from './categories/UtensilsCategory';
import { outdoorCategory } from './categories/OutdoorCategory';
import { glasswareCategory } from './categories/GlasswareCategory';
import { beddingCategory } from './categories/BeddingCategory';
import { homeDecorCategory } from './categories/HomeDecorCategory';

export type { RegistryItem } from './types';

// All items combined for "All" tab
export const allRegistryItems = [
  ...appliancesCategory,
  ...bathroomCategory,
  ...cookwareCategory,
  ...tablewareCategory,
  ...servewareCategory,
  ...utensilsCategory,
  ...outdoorCategory,
  ...glasswareCategory,
  ...beddingCategory,
  ...homeDecorCategory
].sort((a, b) => a.id - b.id);

// Export categories for tabs
export const registryCategories = {
  all: allRegistryItems,
  appliances: appliancesCategory,
  bathroom: bathroomCategory,
  cookware: cookwareCategory,
  tableware: tablewareCategory,
  serveware: servewareCategory,
  utensils: utensilsCategory,
  outdoor: outdoorCategory,
  glassware: glasswareCategory,
  bedding: beddingCategory,
  homedecor: homeDecorCategory
};

// Keep backward compatibility
export const registryItems = allRegistryItems;