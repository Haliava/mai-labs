import { create } from "zustand";

export type Modal = {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props: {[key: string]: any};
}

export type ModalState = {
  openModals: Map<string, Modal>;
  openModal: (modal: Modal) => void;
  closeModal: (name: string) => void;
}
export const useModalStore = create<ModalState>((set) => ({
  openModals: new Map(),
  openModal: (modal) => set((state) => ({
    openModals: state.openModals.set(modal.name, modal),
  })),
  closeModal: (name) => set((state) => {
    state.openModals.delete(name);

    return {openModals: state.openModals};
  })
}))