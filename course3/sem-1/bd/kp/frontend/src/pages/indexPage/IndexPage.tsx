import { useNavigate } from "react-router"

import { Button } from "@/shared/ui/button"
import { Glow, GlowCapture } from "@codaworks/react-glow";
import { animated, useTransition } from "@react-spring/web";
import { appearTransition } from "@/shared/lib/utils";
import Footer from "@/widgets/footer";
import { useUserStore } from "@/shared/store/userStore";
import { useEffect } from "react";

const listButtons: {id: number, to: string, text: string}[] = [
  {id: 1, text: 'Профиль', to: 'profile'},
  {id: 2, text: 'Флаги', to: 'flags'},
  {id: 3, text: 'Организации', to: 'organizations'},
  {id: 4, text: 'Логи', to: 'logs'},
  {id: 5, text: 'Посмотреть UML', to: 'uml'},
  {id: 6, text: 'Выйти', to: 'logout'},
]

export const IndexPage = () => {
  const navigate = useNavigate()
  const {user, setUser} = useUserStore()

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (!user && !savedUser) {
      navigate('/login')
    } else if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const transitions = useTransition(listButtons, appearTransition(400));

  const navigateTo = (path: string) => {
    navigate(path);
  }

  return (
    <div className="flex items-center">
      <div className="m-auto min-h-[80vmin] flex flex-col items-center justify-center gap-0 w-[80vmin] max-w-[300px]">
        {transitions((props, item) => {
          const {id, text, to} = item;

          return (
            <animated.div key={id} style={{...props}}>
              <GlowCapture>
                <Glow>
                  <Button className="w-full min-w-[40vmin] bg-transparent hover:bg-transparent glow:text-glow/50 glow:bg-[#EDFFF9] py-10" onClick={() => navigateTo(to)}>
                    <p className="font-medium text-lg uppercase tracking-wide">{text}</p>
                  </Button>
                </Glow>
              </GlowCapture>
            </animated.div>
          )
        })}
      </div>
      <Footer />
    </div>
    
  )
}
