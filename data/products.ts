// data/products.ts

export interface Product {
  sku: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  // можно дополнять по мере надобности:
  shortDescription?: string;
  category?: 'Water & Ice Dispensers' | 'Ice Makers' | 'Accessories';
  iceType?: 'B-cubes' | 'Cubes' | 'Flakes' | 'Pebbles';
  inStock?: boolean;
}

export const products: Product[] = [
  {
    name: 'B-QUBE Ice Machine',
    brand: 'Brema',
    sku: 'CB249A BHC AWS',
    price: 2000,
    image: 'http://eurodib.com/wp-content/uploads/2024/01/CB249_B-Qube-2.png',
    category: 'Ice Makers',
    iceType: 'B-cubes',
    inStock: true,
  },
  {
    name: 'B-QUBE Ice Machine',
    brand: 'Brema',
    sku: 'CB316A BHC AWS',
    price: 2000,
    image: 'http://eurodib.com/wp-content/uploads/2024/01/CB249_B-Qube-2.png',
    category: 'Ice Makers',
    iceType: 'B-cubes',
    inStock: true,
  },
  {
    name: 'B-QUBE Ice Machine',
    brand: 'Brema',
    sku: 'CB425A BHC AWS',
    price: 2000,
    image: 'http://eurodib.com/wp-content/uploads/2024/01/CB249_B-Qube-2.png',
    category: 'Ice Makers',
    iceType: 'B-cubes',
    inStock: false,
  },
  {
    name: 'B-QUBE Ice Machine',
    brand: 'Brema',
    sku: 'CB640A BHC AWS',
    price: 2000,
    image: 'http://eurodib.com/wp-content/uploads/2024/01/CB249_B-Qube-2.png',
    category: 'Ice Makers',
    iceType: 'B-cubes',
    inStock: true,
  },
  {
    name: 'Ice Cube Machine',
    brand: 'Brema',
    sku: 'CB249A HC AWS',
    price: 2000,
    image: 'http://eurodib.com/wp-content/uploads/2024/01/CB249_B-Qube-2.png',
    category: 'Ice Makers',
    iceType: 'Cubes',
    inStock: true,
  },
  {
    name: 'Ice Cube Machine',
    brand: 'Brema',
    sku: 'CB316A HC AWS',
    price: 2000,
    image: 'http://eurodib.com/wp-content/uploads/2024/01/CB249_B-Qube-2.png',
    category: 'Ice Makers',
    iceType: 'Cubes',
    inStock: true,
  },
  {
    name: 'B-QUBE Ice Machine',
    brand: 'Brema',
    sku: 'CB640A BHC AWS 2',
    price: 2000,
    image: 'http://eurodib.com/wp-content/uploads/2024/01/CB249_B-Qube-2.png',
    category: 'Water & Ice Dispensers',
    iceType: 'B-cubes',
    inStock: true,
  },
  {
    name: 'Ice Cube Machine',
    brand: 'Brema',
    sku: 'CB249A HC AWS 2',
    price: 2000,
    image: 'http://eurodib.com/wp-content/uploads/2024/01/CB249_B-Qube-2.png',
    category: 'Ice Makers',
    iceType: 'Cubes',
    inStock: false,
  },
  {
    name: 'Ice Cube Machine',
    brand: 'Brema',
    sku: 'CB316A HC AWS 2',
    price: 2000,
    image: 'http://eurodib.com/wp-content/uploads/2024/01/CB249_B-Qube-2.png',
    category: 'Ice Makers',
    iceType: 'Flakes',
    inStock: true,
  },
];

