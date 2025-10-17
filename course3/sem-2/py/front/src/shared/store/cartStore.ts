import { create } from "zustand";

export type CartState = {
  products: Map<number, number>;
  addProduct: (id: number) => void;
  subtractProduct: (id: number) => void;
}
export const useCartStore = create<CartState>((set) => ({
  products: new Map(),
  addProduct: (id) => set((state) => ({
    products: state.products.set(id, (state.products.get(id) ?? 0) + 1),
  })),
  subtractProduct: (id) => set((state) => {
    if (!state.products.get(id)) {
      return {products: state.products};
    }

    if (state.products.get(id)! <= 1) {
      state.products.delete(id);
    } else {
      state.products.set(id, state.products.get(id)! - 1)
    }

    return {products: state.products};
  }),
}))