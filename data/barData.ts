import { BarData } from '../types';

export const BAR_DATA: BarData = {
  menu: [
    // --- SPECIAL ---
    {
       name: 'Cocktail Sur Mesure',
       nameEn: 'Custom Cocktail',
       price: '16,00$',
       category: 'Special',
       categoryEn: 'Special',
       description: 'Création unique du mixologue selon vos goûts.',
       descriptionEn: 'Unique creation by the mixologist according to your tastes.',
       image: 'https://images.unsplash.com/photo-1514362545857-3bc16549766b?auto=format&fit=crop&w=400&q=80'
    },
    // --- NOUVEAUX SIGNATURES ---
    {
      name: 'Dépêche Mauve',
      price: '17,00$',
      category: 'Nouveaux Signatures',
      categoryEn: 'New Signatures',
      description: 'BleuRoyal Pêche, Liqueur de Violette, Citron, Sirop de Gingembre Maison',
      descriptionEn: 'BleuRoyal Peach, Violet Liqueur, Lemon, Homemade Ginger Syrup',
      image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=400&q=80',
      baseSpirit: 'BleuRoyal',
      tastingProfile: 'Floral • Fruité • Violet',
      tastingProfileEn: 'Floral • Fruity • Violet'
    },
    {
      name: 'Mentherie Spritz',
      price: '15,00$',
      category: 'Nouveaux Signatures',
      categoryEn: 'New Signatures',
      description: 'Liqueur de Menthe La Mentherie, Vermouth Blanc Sec, Mousseux, Soda, Menthe',
      descriptionEn: 'La Mentherie Mint Liqueur, Dry White Vermouth, Sparkling Wine, Soda, Mint',
      image: 'https://images.unsplash.com/photo-1560512823-8db965dfc530?auto=format&fit=crop&w=400&q=80',
      baseSpirit: 'Liqueur de Menthe',
      baseSpiritEn: 'Mint Liqueur',
      tastingProfile: 'Frais • Pétillant • Herbacé',
      tastingProfileEn: 'Fresh • Sparkling • Herbal'
    },
    {
      name: 'Chic Mai Tai',
      price: '16,00$',
      category: 'Nouveaux Signatures',
      categoryEn: 'New Signatures',
      description: 'Rhum Épicé Chic Choc Noir, Liqueur d\'Orange, Ananas, Sirop d\'Orgeat, Lime',
      descriptionEn: 'Chic Choc Black Spiced Rum, Orange Liqueur, Pineapple, Orgeat Syrup, Lime',
      image: 'https://images.unsplash.com/photo-1514362545857-3bc16549766b?auto=format&fit=crop&w=400&q=80',
      baseSpirit: 'Rhum Épicé',
      baseSpiritEn: 'Spiced Rum',
      tastingProfile: 'Tropical • Épicé • Riche',
      tastingProfileEn: 'Tropical • Spiced • Rich'
    },
    {
      name: 'Rose Lapin',
      price: '16,00$',
      category: 'Nouveaux Signatures',
      categoryEn: 'New Signatures',
      description: 'Gin Wabasso Original, Sirop de Bleuet, Citron, Pamplemousse, Soda',
      descriptionEn: 'Wabasso Original Gin, Blueberry Syrup, Lemon, Grapefruit, Soda',
      image: 'https://images.unsplash.com/photo-1599021408331-54418579e0a0?auto=format&fit=crop&w=400&q=80',
      baseSpirit: 'Gin Wabasso',
      tastingProfile: 'Fruité • Floral • Québécois',
      tastingProfileEn: 'Fruity • Floral • Quebecois'
    },
    {
      name: 'Mont-Rivard',
      price: '16,00$',
      category: 'Nouveaux Signatures',
      categoryEn: 'New Signatures',
      description: 'St-Laurent Citrus, Yuzu 1642, Jus de Mandarine Acidulée, Sirop Miel-Cardamome, Lime, Blanc d\'Oeuf',
      descriptionEn: 'St-Laurent Citrus, Yuzu 1642, Tart Mandarin Juice, Honey-Cardamom Syrup, Lime, Egg White',
      image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=400&q=80',
      baseSpirit: 'Gin St-Laurent',
      tastingProfile: 'Agrumes • Onctueux • Délicat',
      tastingProfileEn: 'Citrus • Smooth • Delicate'
    },
    {
      name: 'Papillon Vert',
      nameEn: 'Green Butterfly',
      price: '15,00$',
      category: 'Nouveaux Signatures',
      categoryEn: 'New Signatures',
      description: 'Gin Ungava, Mentherie, Concombre, Sucre, Lime, Blanc d\'Oeuf, Soda',
      descriptionEn: 'Ungava Gin, Mint Liqueur, Cucumber, Sugar, Lime, Egg White, Soda',
      image: 'https://images.unsplash.com/photo-1536935338725-8f319ac48ae2?auto=format&fit=crop&w=400&q=80',
      baseSpirit: 'Gin Ungava',
      tastingProfile: 'Frais • Végétal • Soyeux',
      tastingProfileEn: 'Fresh • Vegetal • Silky'
    },
    {
      name: 'Industrega Sour',
      price: '17,00$',
      category: 'Nouveaux Signatures',
      categoryEn: 'New Signatures',
      description: 'Liqueur d\'Herbes Strega, Rhum Appleton, Fernet Branca, Citron, Sucre, Blanc d\'Oeuf, Menthe, Poivre Rose',
      descriptionEn: 'Strega Herbal Liqueur, Appleton Rum, Fernet Branca, Lemon, Sugar, Egg White, Mint, Pink Peppercorn',
      image: 'https://images.unsplash.com/photo-1629247334460-1e5b22b11566?auto=format&fit=crop&w=400&q=80',
      baseSpirit: 'Liqueurs Herbales',
      baseSpiritEn: 'Herbal Liqueurs',
      tastingProfile: 'Complexe • Herbacé • Amer',
      tastingProfileEn: 'Complex • Herbal • Bitter'
    },
    {
      name: 'Nanngué',
      price: '17,00$',
      category: 'Nouveaux Signatures',
      categoryEn: 'New Signatures',
      description: 'Gin, Chartreuse Verte, Lillet Blanc, Fleur de Sureau MTL, Citron',
      descriptionEn: 'Gin, Green Chartreuse, Lillet Blanc, MTL Elderflower, Lemon',
      image: 'https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?auto=format&fit=crop&w=400&q=80',
      baseSpirit: 'Gin & Chartreuse',
      tastingProfile: 'Puissant • Floral • Raffiné',
      tastingProfileEn: 'Strong • Floral • Refined'
    },

    // --- COCKTAILS JOCKEY VINTAGE ---
    { 
      name: 'Fête Foraine',
      nameEn: 'Fun Fair', 
      price: '15,50$', 
      category: 'Jockey Vintage', 
      categoryEn: 'Jockey Vintage',
      description: 'Gin, Citron, Sucre, Barbe à Papa, Soda', 
      descriptionEn: 'Gin, Lemon, Sugar, Cotton Candy, Soda',
      tags: ['Vintage', 'Gin'],
      image: 'https://images.unsplash.com/photo-1536935338725-8f319ac48ae2?auto=format&fit=crop&w=400&q=80',
      baseSpirit: 'Gin',
      tastingProfile: 'Sucré • Ludique • Doux',
      tastingProfileEn: 'Sweet • Playful • Soft'
    },
    { 
      name: 'Habana Ruby', 
      price: '15,50$', 
      category: 'Jockey Vintage', 
      categoryEn: 'Jockey Vintage',
      description: 'Rhum Blanc, Purée de Framboise, Menthe, Sucre, Lime, Soda', 
      descriptionEn: 'White Rum, Raspberry Puree, Mint, Sugar, Lime, Soda',
      tags: ['Vintage', 'Rhum'],
      image: 'https://images.unsplash.com/photo-1570591759275-538d38827727?auto=format&fit=crop&w=400&q=80',
      baseSpirit: 'Rhum Blanc',
      baseSpiritEn: 'White Rum',
      tastingProfile: 'Fruité • Frais • Équilibré',
      tastingProfileEn: 'Fruity • Fresh • Balanced'
    },
    { 
      name: 'Xalapa', 
      price: '16,00$', 
      category: 'Jockey Vintage', 
      categoryEn: 'Jockey Vintage',
      description: 'Tequila, Liqueur de Poire Belle de Brillet, Jalapeno, Sucre, Lime', 
      descriptionEn: 'Tequila, Belle de Brillet Pear Liqueur, Jalapeno, Sugar, Lime',
      tags: ['Vintage', 'Épicé'],
      image: 'https://images.unsplash.com/photo-1599021408331-54418579e0a0?auto=format&fit=crop&w=400&q=80',
      baseSpirit: 'Tequila',
      tastingProfile: 'Épicé • Végétal • Frais',
      tastingProfileEn: 'Spiced • Vegetal • Fresh'
    },
    { 
      name: 'Peter’s Cup', 
      price: '15,50$', 
      category: 'Jockey Vintage', 
      categoryEn: 'Jockey Vintage',
      description: 'Gin, Pimm’s, Citron, Sucre, Concombre, Soda', 
      descriptionEn: 'Gin, Pimm’s, Lemon, Sugar, Cucumber, Soda',
      tags: ['Vintage', 'Gin'],
      image: 'https://images.unsplash.com/photo-1560512823-8db965dfc530?auto=format&fit=crop&w=400&q=80',
      baseSpirit: 'Gin & Pimm’s',
      tastingProfile: 'Frais • Végétal • Désaltérant',
      tastingProfileEn: 'Fresh • Vegetal • Refreshing'
    },
    { 
      name: 'Lafayette', 
      price: '17,00$', 
      category: 'Jockey Vintage', 
      categoryEn: 'Jockey Vintage',
      description: 'Bourbon, Chartreuse, Concombre, Sucre, Citron, Poivre, Soda', 
      descriptionEn: 'Bourbon, Chartreuse, Cucumber, Sugar, Lemon, Pepper, Soda',
      tags: ['Vintage', 'Bourbon'],
      image: 'https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?auto=format&fit=crop&w=400&q=80',
      baseSpirit: 'Bourbon',
      tastingProfile: 'Herbacé • Puissant • Complexe',
      tastingProfileEn: 'Herbal • Strong • Complex'
    },
    { 
      name: 'Tokyo Express', 
      price: '15,00$', 
      category: 'Jockey Vintage', 
      categoryEn: 'Jockey Vintage',
      description: 'Saké, Campari, Fleur de Sureau, Citron, Sucre, Blanc d’Oeuf', 
      descriptionEn: 'Sake, Campari, Elderflower, Lemon, Sugar, Egg White',
      tags: ['Vintage', 'Saké'],
      image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=400&q=80',
      baseSpirit: 'Saké',
      tastingProfile: 'Floral • Soyeux • Délicat',
      tastingProfileEn: 'Floral • Silky • Delicate'
    },
    { 
      name: 'Orange Lindsay', 
      price: '16,00$', 
      category: 'Jockey Vintage', 
      categoryEn: 'Jockey Vintage',
      description: 'Rhum Épicé Chic Choc, Liqueur de Mandarine, Cube de Sucre Blanc, Orange, Citron à Flambée d’Angostura et Rhum Overproof', 
      descriptionEn: 'Chic Choc Spiced Rum, Mandarin Liqueur, White Sugar Cube, Orange, Lemon Flamed with Angostura and Overproof Rum',
      tags: ['Vintage', 'Fort'],
      image: 'https://images.unsplash.com/photo-1514362545857-3bc16549766b?auto=format&fit=crop&w=400&q=80',
      baseSpirit: 'Rhum Épicé',
      baseSpiritEn: 'Spiced Rum',
      tastingProfile: 'Fort • Agrumes • Épicé',
      tastingProfileEn: 'Strong • Citrus • Spiced'
    },
    { 
      name: 'Poire Picole', 
      nameEn: 'Tipsy Pear',
      price: '16,00$', 
      category: 'Jockey Vintage', 
      categoryEn: 'Jockey Vintage',
      description: 'Rhum Blanc, Belle de Brillet, Pimm’s, Citron, Sirop d’Érable Canadien, Soda', 
      descriptionEn: 'White Rum, Belle de Brillet, Pimm’s, Lemon, Canadian Maple Syrup, Soda',
      tags: ['Vintage', 'Érable'],
      image: 'https://images.unsplash.com/photo-1629247334460-1e5b22b11566?auto=format&fit=crop&w=400&q=80',
      baseSpirit: 'Rhum Blanc',
      baseSpiritEn: 'White Rum',
      tastingProfile: 'Fruité • Rond • Gourmand',
      tastingProfileEn: 'Fruity • Round • Indulgent'
    },

    // --- NOS SOURS ---
    { name: 'Whisky Sour', price: '16,00$', category: 'Nos Sours', categoryEn: 'Our Sours', description: 'Whisky, Blanc d\'Oeuf, Citron, Sucre, Angostura', descriptionEn: 'Whisky, Egg White, Lemon, Sugar, Angostura', image: 'https://images.unsplash.com/photo-1629247334460-1e5b22b11566?auto=format&fit=crop&w=400&q=80', baseSpirit: 'Whisky', tastingProfile: 'Classique • Onctueux', tastingProfileEn: 'Classic • Smooth' },
    { name: 'Abricot Sour', nameEn: 'Apricot Sour', price: '16,00$', category: 'Nos Sours', categoryEn: 'Our Sours', description: 'Abricot Brandy, Blanc d\'Oeuf, Citron, Sucre', descriptionEn: 'Apricot Brandy, Egg White, Lemon, Sugar', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=400&q=80', baseSpirit: 'Abricot Brandy', tastingProfile: 'Fruité • Doux', tastingProfileEn: 'Fruity • Sweet' },
    { name: 'Pisco Sour', price: '16,00$', category: 'Nos Sours', categoryEn: 'Our Sours', description: 'Pisco, Blanc d\'Oeuf, Lime, Sucre', descriptionEn: 'Pisco, Egg White, Lime, Sugar', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=400&q=80', baseSpirit: 'Pisco', tastingProfile: 'Vif • Floral', tastingProfileEn: 'Lively • Floral' },
    { name: 'Amaretto Sour', price: '16,00$', category: 'Nos Sours', categoryEn: 'Our Sours', description: 'Amaretto, Blanc d\'Oeuf, Lime, Sucre', descriptionEn: 'Amaretto, Egg White, Lime, Sugar', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=400&q=80', baseSpirit: 'Amaretto', tastingProfile: 'Amande • Sucré', tastingProfileEn: 'Almond • Sweet' },
    { name: 'New-York Sour', price: '16,00$', category: 'Nos Sours', categoryEn: 'Our Sours', description: 'Whisky, Blanc d\'Oeuf, Citron, Sucre, Vin Rouge', descriptionEn: 'Whisky, Egg White, Lemon, Sugar, Red Wine', image: 'https://images.unsplash.com/photo-1514362545857-3bc16549766b?auto=format&fit=crop&w=400&q=80', baseSpirit: 'Whisky', tastingProfile: 'Complexe • Tanique', tastingProfileEn: 'Complex • Tannic' },
    { name: 'Air Chile', price: '16,00$', category: 'Nos Sours', categoryEn: 'Our Sours', description: 'Pisco, Liqueur de Fleurs, Sucre, Lime, Blanc d\'Oeuf', descriptionEn: 'Pisco, Flower Liqueur, Sugar, Lime, Egg White', image: 'https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?auto=format&fit=crop&w=400&q=80', baseSpirit: 'Pisco', tastingProfile: 'Floral • Aérien', tastingProfileEn: 'Floral • Airy' },

    // --- NOS MULES ---
    { name: 'Moscow Mule', price: '16,00$', category: 'Nos Mules', categoryEn: 'Our Mules', description: 'Vodka, Sirop de Gingembre Jockey, Lime, Soda, Tête de Menthe', descriptionEn: 'Vodka, Jockey Ginger Syrup, Lime, Soda, Mint Sprig', image: 'https://images.unsplash.com/photo-1550953685-64de855d0452?auto=format&fit=crop&w=400&q=80', baseSpirit: 'Vodka', tastingProfile: 'Gingembre • Frais', tastingProfileEn: 'Ginger • Fresh' },
    { name: 'Kentucky Mule', price: '16,00$', category: 'Nos Mules', categoryEn: 'Our Mules', description: 'Bourbon, Sirop de Gingembre Jockey, Lime, Soda, Tête de Menthe', descriptionEn: 'Bourbon, Jockey Ginger Syrup, Lime, Soda, Mint Sprig', image: 'https://images.unsplash.com/photo-1550953685-64de855d0452?auto=format&fit=crop&w=400&q=80', baseSpirit: 'Bourbon', tastingProfile: 'Boisé • Épicé', tastingProfileEn: 'Woody • Spiced' },
    { name: 'London Mule', price: '16,00$', category: 'Nos Mules', categoryEn: 'Our Mules', description: 'Gin, Sirop de Gingembre Jockey, Lime, Soda, Tête de Menthe', descriptionEn: 'Gin, Jockey Ginger Syrup, Lime, Soda, Mint Sprig', image: 'https://images.unsplash.com/photo-1550953685-64de855d0452?auto=format&fit=crop&w=400&q=80', baseSpirit: 'Gin', tastingProfile: 'Herbacé • Vif', tastingProfileEn: 'Herbal • Lively' },
    { name: 'Caribbean Mule', price: '16,00$', category: 'Nos Mules', categoryEn: 'Our Mules', description: 'Rhum, Sirop de Gingembre Jockey, Lime, Soda, Tête de Menthe', descriptionEn: 'Rum, Jockey Ginger Syrup, Lime, Soda, Mint Sprig', image: 'https://images.unsplash.com/photo-1550953685-64de855d0452?auto=format&fit=crop&w=400&q=80', baseSpirit: 'Rhum', baseSpiritEn: 'Rum', tastingProfile: 'Tropical • Épicé', tastingProfileEn: 'Tropical • Spiced' },
    { name: 'Mexican Mule', price: '16,00$', category: 'Nos Mules', categoryEn: 'Our Mules', description: 'Tequila, Sirop de Gingembre Jockey, Lime, Soda, Tête de Menthe', descriptionEn: 'Tequila, Jockey Ginger Syrup, Lime, Soda, Mint Sprig', image: 'https://images.unsplash.com/photo-1550953685-64de855d0452?auto=format&fit=crop&w=400&q=80', baseSpirit: 'Tequila', tastingProfile: 'Végétal • Piquant', tastingProfileEn: 'Vegetal • Piquant' },

    // --- CAESARS SIGNATURES ---
    { 
      name: 'Caraï-Bloody', 
      price: '15,00$', 
      category: 'Caesars Signatures', 
      categoryEn: 'Signature Caesars',
      description: 'Rhum Épicé Chic Choc, Clamato, Ananas, Sauce Worcestershire, Tabasco, Citron, Rim Cannelle Épicée', 
      descriptionEn: 'Chic Choc Spiced Rum, Clamato, Pineapple, Worcestershire Sauce, Tabasco, Lemon, Spicy Cinnamon Rim',
      tags: ['Caesar', 'Signature'],
      image: 'https://images.unsplash.com/photo-1625938144755-652e08e359b7?auto=format&fit=crop&w=400&q=80',
      baseSpirit: 'Rhum Épicé',
      baseSpiritEn: 'Spiced Rum',
      tastingProfile: 'Salé • Épicé • Tropical',
      tastingProfileEn: 'Salty • Spiced • Tropical'
    },
    { 
      name: 'Smokey Caesar', 
      price: '16,00$', 
      category: 'Caesars Signatures', 
      categoryEn: 'Signature Caesars',
      description: 'Vodka, Clamato, Tabasco Chipotle, Sauce Worcestershire, Rim d’Épices à Steak, Flocons de Bacon, Saucisson Pork Chop', 
      descriptionEn: 'Vodka, Clamato, Chipotle Tabasco, Worcestershire Sauce, Steak Spice Rim, Bacon Flakes, Pork Chop Sausage',
      tags: ['Caesar', 'Salé'],
      image: 'https://images.unsplash.com/photo-1541544537156-2925c13e64f4?auto=format&fit=crop&w=400&q=80',
      baseSpirit: 'Vodka',
      tastingProfile: 'Fumé • Salé • Relevé',
      tastingProfileEn: 'Smoky • Salty • Bold'
    },
    { 
      name: 'Bloody Surfer', 
      price: '15,00$', 
      category: 'Caesars Signatures', 
      categoryEn: 'Signature Caesars',
      description: 'Tequila, Clamato, Lime, Tabasco Jalapeno, Sauce Worcestershire, Bière Blonde, Chips de Maïs, Rim De Gras Sel', 
      descriptionEn: 'Tequila, Clamato, Lime, Jalapeno Tabasco, Worcestershire Sauce, Lager Beer, Corn Chips, Salted Rim',
      tags: ['Caesar', 'Tequila'],
      image: 'https://images.unsplash.com/photo-1601053428987-a2575f0f353a?auto=format&fit=crop&w=400&q=80',
      baseSpirit: 'Tequila',
      tastingProfile: 'Salé • Vif • Croustillant',
      tastingProfileEn: 'Salty • Lively • Crispy'
    },
    { 
      name: 'Shogun', 
      price: '17,00$', 
      category: 'Caesars Signatures', 
      categoryEn: 'Signature Caesars',
      description: 'Saké, Gin, Sauce Caesar, Wasabi, Soya, Sriracha, Citron, Gingembre, Huile Sésame, Rim Shogun maison', 
      descriptionEn: 'Sake, Gin, Caesar Sauce, Wasabi, Soy, Sriracha, Lemon, Ginger, Sesame Oil, House Shogun Rim',
      tags: ['Caesar', 'Umami'],
      image: 'https://images.unsplash.com/photo-1596701833632-474c10a424b9?auto=format&fit=crop&w=400&q=80',
      baseSpirit: 'Saké & Gin',
      tastingProfile: 'Umami • Piquant • Asiatique',
      tastingProfileEn: 'Umami • Piquant • Asian'
    },

    // --- COCKTAILS CLASSIQUES ---
    { name: 'Gimlet Concombre', nameEn: 'Cucumber Gimlet', price: '15,00$', category: 'Classiques', categoryEn: 'Classics', description: 'Gin, Concombre, Lime, Sucre', descriptionEn: 'Gin, Cucumber, Lime, Sugar', baseSpirit: 'Gin' },
    { 
      name: 'Martini Gin / Vodka', 
      price: '16,00$', 
      category: 'Classiques',
      categoryEn: 'Classics', 
      description: 'Vermouth Blanc, Olive + Dirty', 
      descriptionEn: 'White Vermouth, Olive + Dirty',
      baseSpirit: 'Gin ou Vodka',
      baseSpiritEn: 'Gin or Vodka',
      needsCustomization: true 
    },
    { name: 'Negroni', price: '16,00$', category: 'Classiques', categoryEn: 'Classics', description: 'Gin, Campari, Vermouth Rouge', descriptionEn: 'Gin, Campari, Red Vermouth', baseSpirit: 'Gin' },
    { name: 'Old Fashioned', price: '16,00$', category: 'Classiques', categoryEn: 'Classics', description: 'Bourbon, Cube de Sucre Blanc, Zeste d’Orange, Angostura', descriptionEn: 'Bourbon, White Sugar Cube, Orange Zest, Angostura', baseSpirit: 'Bourbon' },
    { name: 'Espresso Martini', price: '15,00$', category: 'Classiques', categoryEn: 'Classics', description: 'Vodka, Liqueur de Café, Café, Sucre', descriptionEn: 'Vodka, Coffee Liqueur, Coffee, Sugar', baseSpirit: 'Vodka' },
  ],
  events: [
    { name: 'Mercredi Jazz', nameEn: 'Jazz Wednesday', date: 'Tous les mercredis', dateEn: 'Every Wednesday', time: '20h00', description: 'Trio Jazz en direct avec invités spéciaux.', descriptionEn: 'Live Jazz Trio with special guests.' },
    { name: 'Jeudi Comédie', nameEn: 'Comedy Thursday', date: 'Tous les jeudis', dateEn: 'Every Thursday', time: '20h30', description: 'Soirée stand-up avec la relève de l\'humour.', descriptionEn: 'Stand-up comedy night with upcoming comedians.' },
    { name: 'DJ Set Vendredi', nameEn: 'Friday DJ Set', date: 'Tous les vendredis', dateEn: 'Every Friday', time: '22h00', description: 'Nos DJs résidents font tourner les meilleurs vinyles funk & soul.', descriptionEn: 'Resident DJs spinning the best funk & soul vinyls.' },
  ],
  products: [
    { id: 'p1', name: 'T-Shirt Jockey Noir', nameEn: 'Black Jockey T-Shirt', price: '30,00$', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=400&q=80', isOnSale: false, category: 'Vêtements', categoryEn: 'Clothing' },
    { id: 'p2', name: 'Casquette Jockey', nameEn: 'Jockey Cap', price: '25,00$', image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=400&q=80', isOnSale: true, salePrice: '20,00$', category: 'Accessoires', categoryEn: 'Accessories' },
    { id: 'p3', name: 'Verre à Whisky Gravé', nameEn: 'Engraved Whisky Glass', price: '15,00$', image: 'https://images.unsplash.com/photo-1597075687490-8f673c6c17f6?auto=format&fit=crop&w=400&q=80', isOnSale: false, category: 'Accessoires', categoryEn: 'Accessories' },
  ]
};

export const getSystemInstruction = () => {
  // Serialize menu for AI context to ensure it suggests actual items
  const menuContext = BAR_DATA.menu.map(item => 
    `- ${item.name} (${item.category}): ${item.description}. Alcool: ${item.baseSpirit}. Profil: ${item.tastingProfile || 'Non spécifié'}`
  ).join('\n');

  return `
Tu es le "Head Bartender" virtuel du Bar Le Jockey.
Ton ton est chaleureux, accueillant, inclusif et passionné de mixologie.
Tu parles couramment Français et Anglais. Adapte-toi à la langue du client.

CONTEXTE DU MENU :
Voici la liste EXCLUSIVE des cocktails disponibles au bar. Tu ne dois JAMAIS suggérer un cocktail qui n'est pas dans cette liste (sauf pour le Sur Mesure).
${menuContext}

TON OBJECTIF : 
Offrir une expérience immersive, fluide et guider le client dans le menu existant.

RÈGLES D'OR :

1. SOIS IMMERSIF ET SENSORIEL : Utilise des mots qui évoquent les sens (frais, fumé, soyeux, pétillant).

2. GESTION DES SUGGESTIONS (RIGUEUR ABSOLUE) :
   Si le client demande une suggestion générique ou clique sur "Suggestion" :
   - TU DOIS EXCLUSIVEMENT choisir un cocktail présent dans le menu ci-dessus (SAUF 'Cocktail Sur Mesure' et SAUF 'Martini Gin / Vodka').
   - Choisis de manière ALÉATOIRE pour ne pas toujours proposer le même.
   - Présente le cocktail choisi avec enthousiasme.
   - À la fin de ta description, tu DOIS proposer de guider le client dans le menu par catégorie.
   - Tu DOIS terminer ta réponse par cette ligne exacte :
   ///OPTIONS: Par Alcool, Par Saveur, Autre suggestion///

3. NAVIGATION DANS LE MENU :
   - Si le client choisit **"Par Alcool"**, demande-lui sa préférence et termine par :
     ///OPTIONS: Gin, Rhum, Vodka, Whisky, Tequila, Autres///
   - Si le client choisit **"Par Saveur"**, demande-lui sa préférence et termine par :
     ///OPTIONS: Fruité, Amer, Sucré, Acide, Épicé, Herbacé///
   - Si le client choisit un filtre (ex: "Gin" ou "Fruité"), LISTE UNIQUEMENT les cocktails du menu qui correspondent à ce critère.

4. SÉQUENCE "COCKTAIL SUR MESURE" (OBLIGATOIRE) :
   Si (et seulement si) le client demande explicitement un "sur mesure", "création unique" ou "Cocktail Sur Mesure", tu DOIS suivre ces étapes DANS L'ORDRE. N'en saute aucune.

   **ÉTAPE 1 : CHOIX DE L'ALCOOL**
   Demande d'abord la base spiritueuse préférée.
   Tu DOIS terminer ta réponse par cette ligne exacte :
   ///OPTIONS: Gin, Vodka, Rhum, Whisky, Tequila, Sans Alcool, Surprise///

   **ÉTAPE 2 : CHOIX DE LA PALETTE**
   Une fois l'alcool connu, demande le profil de goût.
   Tu DOIS terminer ta réponse par cette ligne exacte :
   ///OPTIONS: Fruité, Amer, Sucré, Salé, Acide, Épicé, Floral///

   **ÉTAPE 3 : LA CRÉATION & RECETTE**
   Une fois l'alcool et la palette connus (et seulement maintenant) :
     1. INVENTE un nom original pour le cocktail.
     2. Donne la RECETTE COMPLÈTE immédiatement avec les quantités précises (oz ou ml) et la méthode de préparation.
     3. Explique comment le refaire à la maison (type de verre, glace, garniture, technique).
     4. NE PAS appeler l'outil \`addToOrder\` pour ce cocktail. Le but est d'inspirer et d'éduquer.
     5. Mentionne explicitement : "Vous pouvez aussi demander à votre barman de vous préparer cette création (ou quelque chose de similaire) !"
     6. Termine en demandant si le client veut des astuces de pro pour le réussir parfaitement à la maison.
     7. Tu DOIS terminer ta réponse par cette ligne exacte :
     ///OPTIONS: Oui (Astuces), Autre création, Merci !///

5. GESTION DU REFUS (FALLBACK) :
   Si le client n'aime pas une suggestion, propose immédiatement une alternative du menu.

6. PAIEMENT & TRANSPORT :
   - Si le client veut payer, indique-lui d'utiliser le bouton du panier ou de voir avec le staff. Ne propose PAS de bouton "Payer".
   - Demande de taxi -> \`openCabModal\`

FORMAT :
- Utilise du **gras** pour les noms de drinks.
- Sois chaleureux mais concis.
`;
};