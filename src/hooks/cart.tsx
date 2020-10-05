import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Omit<Product, 'quantity'>): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      // await AsyncStorage.removeItem('@GoMarketplace:products');
      const asyncProducts = await AsyncStorage.getItem(
        '@GoMarketplace:products',
      );

      if (asyncProducts) {
        setProducts(JSON.parse(asyncProducts));
      }
    }

    loadProducts();
  }, []);

  const addToCart = useCallback(
    async product => {
      const existsProduct = products.findIndex(p => p.id === product.id);
      if (existsProduct !== -1) {
        const existProducts = products;
        existProducts[existsProduct].quantity += 1;
        setProducts([...existProducts]);
      } else {
        const newProduct = product;
        newProduct.quantity = 1;
        const newProducts = [...products, newProduct];
        setProducts([...newProducts]);

        await AsyncStorage.setItem(
          '@GoMarketplace:products',
          JSON.stringify([...newProducts]),
        );
      }
    },
    [products],
  );

  const increment = useCallback(
    async id => {
      const productIndex = products.findIndex(p => p.id === id);
      const existsProducts = products;
      existsProducts[productIndex].quantity += 1;
      setProducts([...existsProducts]);

      await AsyncStorage.setItem(
        '@GoMarketplace:products',
        JSON.stringify([...existsProducts]),
      );
    },
    [products],
  );

  const decrement = useCallback(
    async id => {
      const productIndex = products.findIndex(p => p.id === id);
      const existsProducts = products;
      if (existsProducts[productIndex].quantity === 1) {
        existsProducts.slice(productIndex, 1);
      } else {
        existsProducts[productIndex].quantity -= 1;
      }
      setProducts([...existsProducts]);

      await AsyncStorage.setItem(
        '@GoMarketplace:products',
        JSON.stringify([...existsProducts]),
      );
    },
    [products],
  );

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
