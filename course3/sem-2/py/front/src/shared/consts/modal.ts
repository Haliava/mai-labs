import LoginModal from "@/features/loginModal";
import RegisterModal from "@/features/registerModal";

export enum MODALS {
  LOGIN = 'login',
  REGISTRATION = 'registration',
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const modalComponents: Record<any, any> = {
  [MODALS.LOGIN]: LoginModal,
  [MODALS.REGISTRATION]: RegisterModal,
}