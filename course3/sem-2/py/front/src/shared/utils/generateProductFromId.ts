import { Product } from "../types/entity";

const names = [
  'Прод',
  'укт',
  'Мормышки',
  'Сожитель',
  'Мега продукт',
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const randomChoice = (arr: any[]) => {
  return arr[Math.floor(arr.length * Math.random())];
}

export const generateProductFromId = (id: number): Product => {
  return ({
    id,
    delivery: randomChoice(['Сегодня', 'Завтра', 'Послезавтра']),
    name: randomChoice([0, 1, 2, 3, 4]) ? randomChoice(names): `${randomChoice(['невероятный', 'средний', 'не оч', 'хороший'])}`,
    price: randomChoice(Array.from({length: 1000}, (_, v) => v + 1))
  })
}