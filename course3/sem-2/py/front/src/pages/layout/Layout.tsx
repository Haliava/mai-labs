import { ReactNode, useEffect } from "react"
import { Outlet } from "react-router"

import Header from "@/features/header"
import { Toaster } from "@/shared/ui/toaster"
import { useUserStore } from "@/shared/store/userStore"
import { useModalStore } from "@/shared/store/modalStore"
import { modalComponents, MODALS } from "@/shared/consts/modal"

export type LayoutProps = {
  children?: ReactNode
}

export const Layout = ({children}: LayoutProps) => {
  const {openModals, openModal} = useModalStore();
  const {user, setUser} = useUserStore();

  useEffect(() => {
    if (!user) {
      if (localStorage.getItem('jwt')) {
        setUser(JSON.parse(localStorage.getItem('jwt')!));
        return;
      }

      openModal({
        name: MODALS.LOGIN,
        props: {}
      });
    };
  }, [user, localStorage.getItem('jwt')])

  return (
    <div className="w-[90vw] m-auto">
      <Header />
      {children}
      {Array.from(openModals.entries()).map(([modal, {props}]) => {
        console.log(modal);
        const ModalElement = modalComponents[modal];

        return (
          <ModalElement key={modal} {...props} />
        )
      })}
      <Outlet />
      <Toaster />
    </div>
  )
}