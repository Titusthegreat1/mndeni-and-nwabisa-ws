
import React, { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ItemCard from './ItemCard';
import { RegistryItem } from './types';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface PaginatedItemsProps {
  items: RegistryItem[];
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  highlightItemId: number | null;
  onPurchaseConfirm: (item: RegistryItem, buyerName: string, buyerSurname: string) => void;
  isItemUnavailable: (item: RegistryItem) => boolean;
  getRemainingQuantity: (item: RegistryItem) => number;
  onPreviousPage: () => void;
  onNextPage: () => void;
}

const PaginatedItems: React.FC<PaginatedItemsProps> = ({
  items,
  currentPage,
  totalPages,
  itemsPerPage,
  highlightItemId,
  onPurchaseConfirm,
  isItemUnavailable,
  getRemainingQuantity,
  onPreviousPage,
  onNextPage
}) => {
  const [activeTab, setActiveTab] = useState("all");
  const [tabPages, setTabPages] = useState<Record<string, number>>({
    all: 1,
    appliances: 1,
    bathroom: 1,
    cookware: 1,
    tableware: 1,
    serveware: 1,
    utensils: 1,
    outdoor: 1,
    glassware: 1,
    bedding: 1,
    homeDecor: 1
  });

  // Define item categories based on exact names provided
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

  const bathroomNames = [
    "Circles Resin Tray",
    "Circles Resin Soap Dispenser",
    "Circles Resin Tumbler",
    "Circles Resin Toilet Brush",
    "Layla Blanket Stitch Bath Sheet",
    "Amanda-Jayne Fresh, Zest Reed Diffuser",
    "Layla Blanket Stitch Bath Mat"
  ];

  const cookwareNames = [
    "Ciroa Set of 2 Sieve",
    "Nouvelle Cast Iron 8-Piece Cookware Set - Matt Black",
    "Cast Iron Signature Square Skillet Grill",
    "Oslo Aluminium Pan with Reinforced Ceramic Non-Stick 28cm",
    "Bastille 8 Piece Set | 18/10 Stainless Steel Pot Set"
  ];

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

  const utensilNames = [
    "Oven Glove Long Arm Single Silicone Grey",
    "Contemp Cutlery Serving Spoon Set Of 2 Silver",
    "Performance Stainless Steel Serving Spoons, Set of 2",
    "@home Lara 10pc Utensil Set with Holder",
    "Laguna Cutlery 16 Piece Set Silver",
    "Milano Stainless Steel Cutlery Set 16 Piece",
    "Wolstead Insignia Knife Block Set, 5-Piece",
    "Cuisine::pro Sabre Knife Block 9Pc"
  ];

  const outdoorNames = [
    "Bamboo Braai Case, 3-Piece",
    "Willow Picnic Basket 4 Person",
    "Villa Wicker Picnic Basket with Cotton Lining",
    "Apron Gift Set",
    "Grip 39 Piece Tool Set GT2015",
    "Ryobi Blower Mulching Vacuum 3000W",
    "Ryobi Circular Saw 1250W",
    "Red Rhino 1700W Pressure Washer 120 Bar",
    "Garden Trimmer 500W"
  ];

  const glasswareNames = [
    "Guesthouse Crystal White Wine Glasses",
    "Leela Crystal Red Wine Glasses 4 Pack",
    "Guesthouse Champagne Crystal Glasses"
  ];

  const beddingNames = [
    "Verona Seafoam 600TC Egyptian Cotton Duvet Cover Set",
    "Grace Most Lustrous Gold Seal Certified Egyptian Cotton 400 Thread Count Duvet Cover Set Silver",
    "Bungalow Striped Knitted Cotton Throw",
    "Sarra Sherpa Throw",
    "Selina Throw",
    "WHITE 600TC EGYPTIAN COTTON FITTED SHEET",
    "WHITE 600TC EGYPTIAN COTTON FLAT SHEET"
  ];

  const homeDecorNames = [
    "Multi Colour Maize Basket Large",
    "Barrel Vase Large",
    "Milky Finish Round Vase"
  ];

  // Categorize items based on exact name matching
  const categorizedItems = useMemo(() => {
    const uniqueItems = items.filter((item, index, self) => 
      index === self.findIndex(i => i.id === item.id)
    );

    return {
      all: uniqueItems.sort((a, b) => a.name.localeCompare(b.name)),
      appliances: uniqueItems.filter(item => applianceNames.includes(item.name)).sort((a, b) => a.name.localeCompare(b.name)),
      bathroom: uniqueItems.filter(item => bathroomNames.includes(item.name)).sort((a, b) => a.name.localeCompare(b.name)),
      cookware: uniqueItems.filter(item => cookwareNames.includes(item.name)).sort((a, b) => a.name.localeCompare(b.name)),
      tableware: uniqueItems.filter(item => tablewareNames.includes(item.name)).sort((a, b) => a.name.localeCompare(b.name)),
      serveware: uniqueItems.filter(item => servewareNames.includes(item.name)).sort((a, b) => a.name.localeCompare(b.name)),
      utensils: uniqueItems.filter(item => utensilNames.includes(item.name)).sort((a, b) => a.name.localeCompare(b.name)),
      outdoor: uniqueItems.filter(item => outdoorNames.includes(item.name)).sort((a, b) => a.name.localeCompare(b.name)),
      glassware: uniqueItems.filter(item => glasswareNames.includes(item.name)).sort((a, b) => a.name.localeCompare(b.name)),
      bedding: uniqueItems.filter(item => beddingNames.includes(item.name)).sort((a, b) => a.name.localeCompare(b.name)),
      homeDecor: uniqueItems.filter(item => homeDecorNames.includes(item.name)).sort((a, b) => a.name.localeCompare(b.name))
    };
  }, [items]);

  // Get current tab's items and pagination
  const getCurrentTabItems = (tabKey: string) => {
    const tabItems = categorizedItems[tabKey as keyof typeof categorizedItems] || [];
    const currentTabPage = tabPages[tabKey];
    const startIndex = (currentTabPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return tabItems.slice(startIndex, endIndex);
  };

  const getCurrentTabPages = (tabKey: string) => {
    const tabItems = categorizedItems[tabKey as keyof typeof categorizedItems] || [];
    return Math.ceil(tabItems.length / itemsPerPage);
  };

  const handleTabPageChange = (tabKey: string, direction: 'prev' | 'next') => {
    const maxPages = getCurrentTabPages(tabKey);
    const currentTabPage = tabPages[tabKey];
    
    const newPage = direction === 'prev' 
      ? Math.max(currentTabPage - 1, 1)
      : Math.min(currentTabPage + 1, maxPages);
    
    setTabPages(prev => ({ ...prev, [tabKey]: newPage }));
    
    // Scroll to top of registry items
    const registryElement = document.getElementById('all-registry-items');
    if (registryElement) {
      registryElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const currentTabItems = getCurrentTabItems(activeTab);
  const currentTabTotalPages = getCurrentTabPages(activeTab);

  return (
    <div className="animate-fade-in">
      <h2 id="all-registry-items" className="font-playfair text-3xl font-bold text-brown mb-6 text-center">
        All Registry Items
      </h2>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="flex flex-wrap justify-center gap-2 mb-8 bg-transparent p-0 h-auto">
          <TabsTrigger value="all" className="bg-terracotta hover:bg-terracotta/90 text-white data-[state=active]:bg-terracotta/90 text-xs px-4 py-2 rounded-lg">All</TabsTrigger>
          <TabsTrigger value="appliances" className="bg-terracotta hover:bg-terracotta/90 text-white data-[state=active]:bg-terracotta/90 text-xs px-4 py-2 rounded-lg">Appliances</TabsTrigger>
          <TabsTrigger value="bathroom" className="bg-terracotta hover:bg-terracotta/90 text-white data-[state=active]:bg-terracotta/90 text-xs px-4 py-2 rounded-lg">Bathroom</TabsTrigger>
          <TabsTrigger value="cookware" className="bg-terracotta hover:bg-terracotta/90 text-white data-[state=active]:bg-terracotta/90 text-xs px-4 py-2 rounded-lg">Cookware</TabsTrigger>
          <TabsTrigger value="tableware" className="bg-terracotta hover:bg-terracotta/90 text-white data-[state=active]:bg-terracotta/90 text-xs px-4 py-2 rounded-lg">Tableware</TabsTrigger>
          <TabsTrigger value="serveware" className="bg-terracotta hover:bg-terracotta/90 text-white data-[state=active]:bg-terracotta/90 text-xs px-4 py-2 rounded-lg">Serveware</TabsTrigger>
          <TabsTrigger value="utensils" className="bg-terracotta hover:bg-terracotta/90 text-white data-[state=active]:bg-terracotta/90 text-xs px-4 py-2 rounded-lg">Utensils</TabsTrigger>
          <TabsTrigger value="outdoor" className="bg-terracotta hover:bg-terracotta/90 text-white data-[state=active]:bg-terracotta/90 text-xs px-4 py-2 rounded-lg">Outdoor</TabsTrigger>
          <TabsTrigger value="glassware" className="bg-terracotta hover:bg-terracotta/90 text-white data-[state=active]:bg-terracotta/90 text-xs px-4 py-2 rounded-lg">Glassware</TabsTrigger>
          <TabsTrigger value="bedding" className="bg-terracotta hover:bg-terracotta/90 text-white data-[state=active]:bg-terracotta/90 text-xs px-4 py-2 rounded-lg">Bedding</TabsTrigger>
          <TabsTrigger value="homeDecor" className="bg-terracotta hover:bg-terracotta/90 text-white data-[state=active]:bg-terracotta/90 text-xs px-4 py-2 rounded-lg">Home Decor</TabsTrigger>
        </TabsList>

        {["all", "appliances", "bathroom", "cookware", "tableware", "serveware", "utensils", "outdoor", "glassware", "bedding", "homeDecor"].map((tabKey) => (
          <TabsContent key={tabKey} value={tabKey}>
            {/* Current Tab Items */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {getCurrentTabItems(tabKey).map((item) => (
                <div 
                  key={item.id}
                  className={highlightItemId === item.id ? 'ring-4 ring-terracotta rounded-lg' : ''}
                >
                  <ItemCard 
                    item={item} 
                    onPurchaseConfirm={onPurchaseConfirm}
                    isItemUnavailable={isItemUnavailable}
                    getRemainingQuantity={getRemainingQuantity}
                  />
                </div>
              ))}
            </div>

            {/* Tab-specific Pagination Controls */}
            {getCurrentTabPages(tabKey) > 1 && (
              <div className="flex justify-center items-center gap-4 mb-8">
                <button
                  onClick={() => handleTabPageChange(tabKey, 'prev')}
                  disabled={tabPages[tabKey] === 1}
                  className="flex items-center gap-2 px-4 py-2 bg-brown hover:bg-brown/90 text-cream rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                
                <span className="text-brown font-semibold">
                  Page {tabPages[tabKey]} of {getCurrentTabPages(tabKey)}
                </span>
                
                <button
                  onClick={() => handleTabPageChange(tabKey, 'next')}
                  disabled={tabPages[tabKey] === getCurrentTabPages(tabKey)}
                  className="flex items-center gap-2 px-4 py-2 bg-brown hover:bg-brown/90 text-cream rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default PaginatedItems;
