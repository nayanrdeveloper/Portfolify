export type Product = {
  id: string;
  name: string;
  price: number;
};

export type ProductsState = {
  items: Product[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: string | null;
};
