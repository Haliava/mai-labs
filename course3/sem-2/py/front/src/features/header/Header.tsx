import { TIcon } from "@/shared/types/ui"
import { Icon } from "@/shared/ui/icon"
import { Input } from "@/shared/ui/input"
import { NavLink } from "react-router"
import blackFriday from '@/shared/assets/images/blackFriday.png'
import { useSearchStore } from "@/shared/store/searchStore"
import { useEffect, useState } from "react"

export type HeaderLink = {name: string, link: string}
export type HeaderIcon = {name: TIcon, link: string, text: string}
const headerLinks: HeaderLink[] = [
  {name: 'Продавайте на SPO Shop', link: '/sell'},
  {name: 'Работа в SPO Shop', link: '/work'},
  {name: 'Акции', link: '/sale'},
  {name: 'Магазины', link: '/shops'},
  {name: 'Доставка', link: '/delivery'},
  {name: 'Покупателям', link: '/for-customers'},
  {name: 'Юидическим лицам', link: '/for-legal'},
]

const headerIcons: HeaderIcon[] = [
  {name: 'box', link: '/orders', text: 'заказы'},
  {name: 'cart', link: '/cart', text: 'корзина'},
  {name: 'favourites', link: '/favourites', text: 'избранное'},
  {name: 'profile', link: '/profile', text: 'профиль'},
]

export const Header = () => {
  const {query, setQuery} = useSearchStore();
  let timeout: NodeJS.Timeout | null = null;
  const [inputValue, setInputValue] = useState(query ?? '');

  useEffect(() => {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      setQuery(inputValue);
    }, 400);
  }, [inputValue, setQuery]);

  const handleSearchChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setInputValue(e.target.value);
  }

  return (
    <div className="flex flex-col gap-6 mb-6">
      <div className="grid grid-cols-[min-content_auto_auto] gap-5 mt-5">
        <div className="flex flex-row gap-2">
          <Icon size={15} icon="mapPin" />
          <p className="text-[12px]">Москва</p>
        </div>
        <div className="flex gap-5">
          {headerLinks.map(({link, name}) => (
            <NavLink key={name} to={link}>
              <p className="md:text-[0px] xl:text-[12px]">{name}</p>
            </NavLink>
          ))}
        </div>
        <div>
          <p className="text-[12px] ml-8 justify-self-end">8-800-1000-7</p>
        </div>
        <NavLink to={'/'} className="mr-8">
          <Icon size={230} icon="headerLogo" />
        </NavLink>
        <Input
          className="p-5 h-full rounded-2xl bg-[#F1F1F1] border-none placeholder:text-[18px]"
          placeholder="///Поиск по сайту///"
          value={inputValue}
          onChange={handleSearchChange}
        />
        <div className="flex justify-between gap-5 ml-8">
            {headerIcons.map(({link, name, text}) => (
              <NavLink className="transition-all flex flex-col justify-center items-center hover:scale-110" to={link} key={name}>
                <Icon size={52} icon={name} />
                <p className="uppercase text-xs">{text}</p>
              </NavLink>
            ))}
          </div>
      </div>
      <img className="h-15 min-h-[50px]" src={blackFriday} />
    </div>
  )
}