import React, { useState, useMemo } from 'react';
import { registryItems, RegistryItem } from './RegistryItems';
import PaginatedItems from './PaginatedItems';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface CategoryTabsProps {
  highlightItemId: number | null;
  onPurchaseConfirm: (item: RegistryItem, buyerName: string, buyerSurname: string) => void;
  isItemUnavailable: (item: RegistryItem) => boolean;
  getRemainingQuantity: (item: RegistryItem) => number;
}

// Category definitions based on user's specifications
const categoryDefinitions = {
  'All': [],
  'Appliances': [
    'Philips 3000 Series Handheld Garment Steamer with Metal Steam Plate, 1000W',
    '@home Extendable Pot Stand',
    'Delonghi Icona Metallics 4 Slice Toaster',
    'Delonghi Icona Metallics Electric Kettle',
    'Philips 3000 Series 9L Dual Basket Air Fryer',
    'Nutribullet Pro 900W High-Speed Blender',
    'Nespresso Vertuo Next Coffee Machine & Aeroccino Milk Frother',
    'Kenwood Accent Collection Centrifugal Juicer',
    'Nutribullet Blender Pro Matt Jade 900W',
    'Buddy Knocked Down Paper Towel Holder',
    'Progressive Onion Chopper',
    'Cuisine::pro Electric Knife Sharpener'
  ],
  'Bathroom': [
    'Circles Resin Tray',
    'Circles Resin Soap Dispenser',
    'Circles Resin Tumbler',
    'Circles Resin Toilet Brush',
    'Layla Blanket Stitch Bath Sheet',
    'Amanda-Jayne Fresh, Zest Reed Diffuser',
    'Layla Blanket Stitch Bath Mat'
  ],
  'Cookware': [
    'Ciroa Set of 2 Sieve',
    'Nouvelle Cast Iron 8-Piece Cookware Set - Matt Black',
    'Cast Iron Signature Square Skillet Grill',
    'Oslo Aluminium Pan with Reinforced Ceramic Non-Stick 28cm',
    'Bastille 8 Piece Set | 18/10 Stainless Steel Pot Set'
  ],
  'Tableware': [
    'Estilo 4 Piece Printed Coaster Set',
    'Natural Earth Stone Round Tablecloth (6-8seater)',
    'Lacasa Pourer w/Gold Rim White',
    'Lacasa Sugar Pot w/Gold Rim White',
    'Jute Edge Placemat Black 38cm',
    'Lacasa Teapot With Gold Trim 1100ml',
    'Lacasa Cup and Saucer With Gold Trim 4 set',
    'Gold Border Cotton Table Runner Navy',
    'Country Striped Table Runner, 3m',
    'Blaire Round Cotton Tablecloth White',
    'Wooden Grinder Set 2 Piece',
    'Milk Jug – Face Facts',
    'Canister with Lid Set of 3 – Sketchbook',
    'Cup and Saucer – It\'s a Secret',
    'Mug Set of 4 – Let\'s Face It',
    'Cup and Saucer – Face Facts',
    'Le Creuset Calm Collection Mugs (Set of 4)',
    'Stoneware Oval Spoon Rest',
    'Le Creuset Set of 4 Tasting Cups',
    'Synergy Leaves Cork Coasters 4 Pack',
    'Wood Veneer Placemat',
    'Fossil Marble Wine Coaster Beige',
    'Lacasa Mug With Gold Trim 420ml'
  ],
  'Serveware': [
    'Signature Crystal Drink Dispenser with Wooden Stand',
    'Fluente Serveware Salad Bowl Porcelain',
    'Fluted Butter Dish White 22cm Fluted',
    'Rectangular Serveware Platter White',
    'Flutter Large Oval Platter',
    'Flutter Small Oval Platter',
    'Hatty Oval Platter',
    'Josephine Oval Board',
    'Cast Iron Signature Shallow Casserole',
    'Le Creuset Iris Serving Bowl',
    'Le Creuset Sea Salt Stoneware Butter Crock 170ml',
    'Brown Round Wood Serving Board',
    'Lava Stainless Steel Salad Server Set 2 Pack',
    'Glass Serveware Cake Stand 3 Feet Glass Dome',
    'Acacia Wood Round Base Cake Stand',
    'Nolan Tongs',
    'Glass Food Containers, Set of 5',
    'Speckle Round Casserole With Tray Lid, 3L',
    'Epicurious Rectangular Baker with Lid, 32cm',
    'Cirqula Shallow Rectangular Multi Bowl Set, 3-Piece',
    'Aurora Round Porcelain Casserole With Lid 30cm',
    'Aurora Rectangle Porcelain Casserole With Lid 32cm'
  ],
  'Utensils': [
    'Oven Glove Long Arm Single Silicone Grey',
    'Contemp Cutlery Serving Spoon Set Of 2 Silver',
    'Performance Stainless Steel Serving Spoons, Set of 2',
    '@home Lara 10pc Utensil Set with Holder',
    'Laguna Cutlery 16 Piece Set Silver',
    'Milano Stainless Steel Cutlery Set 16 Piece',
    'Wolstead Insignia Knife Block Set, 5-Piece',
    'Cuisine::pro Sabre Knife Block 9Pc'
  ],
  'Outdoor': [
    'Talon Petrol Brush Cutter 2 Stroke 43cm³',
    'Cordless Lithium Battery Screwdriver 32pc Set',
    'Alva Split Pole Gas Patio Heater Grey 13KW',
    'Bamboo Braai Case, 3-Piece',
    'Willow Picnic Basket 4 Person',
    'Villa Wicker Picnic Basket with Cotton Lining',
    'Apron Gift Set',
    'Grip 39 Piece Tool Set GT2015',
    'Ryobi Blower Mulching Vacuum 3000W',
    'Ryobi Circular Saw 1250W',
    'Red Rhino 1700W Pressure Washer 120 Bar',
    'Garden Trimmer 500W'
  ],
  'Glassware': [
    'Guesthouse Crystal White Wine Glasses',
    'Leela Crystal Red Wine Glasses 4 Pack',
    'Guesthouse Champagne Crystal Glasses'
  ],
  'Bedding': [
    'Verona Seafoam 600TC Egyptian Cotton Duvet Cover Set',
    'Grace Most Lustrous Gold Seal Certified Egyptian Cotton 400 Thread Count Duvet Cover Set Silver',
    'Bungalow Striped Knitted Cotton Throw',
    'Sarra Sherpa Throw',
    'Selina Throw',
    'WHITE 600TC EGYPTIAN COTTON FITTED SHEET',
    'WHITE 600TC EGYPTIAN COTTON FLAT SHEET'
  ],
  'Home Decor': [
    'Multi Colour Maize Basket Large',
    'Barrel Vase Large',
    'Milky Finish Round Vase'
  ]
};

const CategoryTabs: React.FC<CategoryTabsProps> = ({
  highlightItemId,
  onPurchaseConfirm,
  isItemUnavailable,
  getRemainingQuantity
}) => {
  const [activeTab, setActiveTab] = useState('All');
  const [currentPages, setCurrentPages] = useState<Record<string, number>>({});
  const itemsPerPage = 10;

  // Function to match items by name (flexible matching)
  const findItemByName = (targetName: string) => {
    return registryItems.find(item => {
      const itemName = item.name.toLowerCase().trim();
      const targetNameLower = targetName.toLowerCase().trim();
      
      // Try exact match first
      if (itemName === targetNameLower) return true;
      
      // Try partial matches for complex names
      if (itemName.includes(targetNameLower) || targetNameLower.includes(itemName)) return true;
      
      // Handle special characters and formatting differences
      const normalizeString = (str: string) => str.replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim();
      return normalizeString(itemName) === normalizeString(targetNameLower);
    });
  };

  // Get items for each category
  const categorizedItems = useMemo(() => {
    const categories: Record<string, RegistryItem[]> = {};
    
    // Exclude featured items (118, 119, 120, 121, 122) from all categories
    const featuredItemIds = [118, 119, 120, 121, 122];
    const availableItems = registryItems.filter(item => !featuredItemIds.includes(item.id));
    
    Object.entries(categoryDefinitions).forEach(([categoryName, itemNames]) => {
      if (categoryName === 'All') {
        // Remove duplicates based on ID
        const uniqueItems = availableItems.filter((item, index, self) => 
          index === self.findIndex(i => i.id === item.id)
        );
        categories[categoryName] = uniqueItems;
      } else {
        const categoryItems: RegistryItem[] = [];
        itemNames.forEach(itemName => {
          const foundItem = findItemByName(itemName);
          if (foundItem && !featuredItemIds.includes(foundItem.id)) {
            categoryItems.push(foundItem);
          }
        });
        categories[categoryName] = categoryItems;
      }
    });
    
    return categories;
  }, []);

  const getCurrentPage = (category: string) => currentPages[category] || 1;

  const handlePageChange = (category: string, page: number) => {
    setCurrentPages(prev => ({ ...prev, [category]: page }));
    
    // Scroll to all items section
    setTimeout(() => {
      const allItemsSection = document.getElementById('all-registry-items');
      if (allItemsSection) {
        allItemsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handlePreviousPage = (category: string) => {
    const currentPage = getCurrentPage(category);
    const newPage = Math.max(currentPage - 1, 1);
    handlePageChange(category, newPage);
  };

  const handleNextPage = (category: string) => {
    const currentPage = getCurrentPage(category);
    const totalPages = Math.ceil(categorizedItems[category]?.length / itemsPerPage) || 1;
    const newPage = Math.min(currentPage + 1, totalPages);
    handlePageChange(category, newPage);
  };

  return (
    <div id="all-registry-items" className="mt-12">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-center mb-8">
          <TabsList className="grid grid-cols-6 lg:grid-cols-11 w-full max-w-5xl h-auto bg-background/50 border border-brown/20 rounded-lg p-1">
            {Object.keys(categoryDefinitions).map((category) => (
              <TabsTrigger
                key={category}
                value={category}
                className="text-xs px-2 py-2 data-[state=active]:bg-terracotta data-[state=active]:text-white hover:bg-brown/10 transition-colors rounded-md whitespace-nowrap"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {Object.keys(categoryDefinitions).map((category) => (
          <TabsContent key={category} value={category} className="mt-0">
            <PaginatedItems
              items={categorizedItems[category] || []}
              currentPage={getCurrentPage(category)}
              totalPages={Math.ceil((categorizedItems[category]?.length || 0) / itemsPerPage)}
              itemsPerPage={itemsPerPage}
              highlightItemId={highlightItemId}
              onPurchaseConfirm={onPurchaseConfirm}
              isItemUnavailable={isItemUnavailable}
              getRemainingQuantity={getRemainingQuantity}
              onPreviousPage={() => handlePreviousPage(category)}
              onNextPage={() => handleNextPage(category)}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default CategoryTabs;