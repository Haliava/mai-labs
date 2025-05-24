import { ROLES } from "@/shared/types/model/permission";
import { User } from "@/shared/types/model/user";

export const mockUser: User = {
  id: 1,
  email: 'mityaDB@mail.ru',
  password: 'xX_mitya_tanki_online_Xx',
  role: ROLES.ADMIN,
}
