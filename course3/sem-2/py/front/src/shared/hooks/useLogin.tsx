import { useMutation } from "@tanstack/react-query"
import { User } from "../types/entity"
import { login } from "../api/user"
import { useUserStore } from "../store/userStore"

export const useLogin = () => {
  const {setUser} = useUserStore();
  const {isPending, isIdle, data, mutate} = useMutation({
    mutationFn: (user: Omit<User, 'id' | 'username'>) => login(user),
    onSuccess: (data) => {
      if (!data) return;
      setUser(data.access_token)
    }
  })

  return {
    isLoading: isPending, isIdle, loginUser: mutate, data
  }
}