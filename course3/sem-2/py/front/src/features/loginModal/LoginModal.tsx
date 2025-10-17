import { Button } from "@/shared/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog"
import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"
import { useEffect, useState } from "react"
import { useModalStore } from "@/shared/store/modalStore"
import { MODALS } from "@/shared/consts/modal"
import { useLogin } from "@/shared/hooks/useLogin"
import { RegisterModalProps } from "../registerModal/RegisterModal"
 
export const LoginModal = () => {
  const {loginUser, isLoading, isIdle, data} = useLogin();
  const {openModals, openModal, closeModal} = useModalStore();
  const [isOpen, setIsOpen] = useState(openModals.has(MODALS.LOGIN));
  const [password, setPassword] = useState('');
  const [login, setLogin] = useState('');

  const handleLoginButton = () => {
    loginUser({username: login, password})
  }

  const handlePasswordChange: React.ChangeEventHandler<HTMLInputElement> = (value) => {
    setPassword(value.target.value)
  }

  const handleLoginChange: React.ChangeEventHandler<HTMLInputElement> = (value) => {
    setLogin(value.target.value)
  }

  useEffect(() => {
    if (isLoading || isIdle) return;
    if (!data) {
      openModal({
        name: MODALS.REGISTRATION,
        props: {user: {username: login, password}} as RegisterModalProps
      })
    } else {
      localStorage.setItem('jwt', JSON.stringify(data.access_token));
      closeModal(MODALS.LOGIN);
      setIsOpen(false);
    }
  }, [isLoading])

  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-[724px] p-10 gap-[13px] bg-white">
        <DialogHeader>
          <DialogTitle className="mb-8">
            <h2 className="text-3xl">Вход в систему</h2>
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 grid-cols-2">
          <Input className="flex-1 h-full" value={login} onChange={handleLoginChange} placeholder="imya" id="login" />
          <Label className="flex-1 text-md font-normal h-full! flex justify-start items-center leading-1 rounded-lg pl-2" htmlFor="phone">имя пользователя</Label>
          <Input className="flex-1 h-full" value={password} onChange={handlePasswordChange} placeholder="pass123" id="password" />
          <Label className="flex-1 text-md font-normal h-full! flex justify-start items-center leading-1 rounded-lg pl-2" htmlFor="email">пароль</Label>
        </div>
        <DialogFooter className="flex content-between">
          <Button disabled={!login.length || !password.length || isLoading} className="bg-[#FF9874] flex-1" onClick={handleLoginButton}>
            <p className="font-light text-white uppercase">Войти</p>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
