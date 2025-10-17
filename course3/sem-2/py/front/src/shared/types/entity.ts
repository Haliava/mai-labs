export type Product = {
  id: number,
  name: string,
  delivery: string,
  price: number,
}

export type User = {
  user_id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  is_verified_email: boolean;
  date_joined: string;
  updated_at: string;
  last_login: string;
}