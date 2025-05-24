import { useUserStore } from "@/shared/store/userStore"
import { useEffect } from "react";
import { useNavigate } from "react-router";

export const LogoutPage = () => {
  const {setUser} = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/login');
  }, [])

  return (
    <>
    </>
  )
}