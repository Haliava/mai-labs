import { register } from "@/shared/api/user"
import { MODALS } from "@/shared/consts/modal"
import { useToast } from "@/shared/hooks/useToast"
import { useModalStore } from "@/shared/store/modalStore"
import { User } from "@/shared/types/entity"
import { Button } from "@/shared/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/shared/ui/dialog"
import { useState } from "react"

export type RegisterModalProps = {
  user: Omit<User, 'id'>,
}

export const RegisterModal = ({user}: RegisterModalProps) => {
  const { toast } = useToast()
  const {closeModal, openModals} = useModalStore()
  const [isOpen, setIsOpen] = useState(openModals.has(MODALS.REGISTRATION))
  const handleRegButtonClick = () => {
    register(user).then(() => {
      toast({
        title: 'вы успешно зарегистрировались',
        description: 'теперь нужно зайти в аккаунт',
      })
      closeModal(MODALS.REGISTRATION)
      setIsOpen(false);
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>У вас нет аккаунта.<br/>Зарегистрироваться с этими данными?</DialogTitle>
        </DialogHeader>
        <DialogFooter>
          <Button className="w-full h-full bg-[#FF9874]" onClick={handleRegButtonClick}>
            <p>Да</p>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}