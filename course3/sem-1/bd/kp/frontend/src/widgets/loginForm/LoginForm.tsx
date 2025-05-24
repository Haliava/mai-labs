import { createUser, getUserByEmailAndPassword } from "@/entities/user/api"
import { useUserStore } from "@/shared/store/userStore"
import { ROLES } from "@/shared/types/model/permission"
import { Switch } from "@/shared/ui"
import { Button } from "@/shared/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/shared/ui/card"
import { Input } from "@/shared/ui/input"
import { Label } from "@radix-ui/react-label"
import { useState } from "react"
import { useNavigate } from "react-router"

export function LoginForm() {
  const {setUser} = useUserStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    getUserByEmailAndPassword(email, password).then(user => {
      if (user) {
        setUser(user)
        localStorage.setItem('user', JSON.stringify(user));
        navigate('/')
      } else {
        setError('Такого пользователя нет')
      }
    })
  }

  const handleRegistration = () => {
    createUser({
      email,
      password,
      role: isAdmin ? ROLES.ADMIN: ROLES.DEFAULT
    }).then(res => {
      setUser(res)
      localStorage.setItem('user', JSON.stringify(res));
      navigate('/')
    }).catch(e => {
      setError(e)
    })
  }

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login + Registration</CardTitle>
        <CardDescription>
          Введите почту и пароль чтобы войти в свой аккаунт или создать его, если вы ещё не зарегистрированы
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={(e) => {
                setError('');
                setEmail(e.target.value)
              }}
              required
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                setError('');
                setPassword(e.target.value)
              }}
              required
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="admin">Администратор?</Label>
            </div>
            <Switch
              id="admin"
              checked={isAdmin}
              onCheckedChange={(e) => {
                setError('');
                setIsAdmin(e)
              }}
            />
          </div>
          <Button onClick={handleLogin} className="w-full">
            Войти
          </Button>
          <Button onClick={handleRegistration} variant="outline" className="w-full">
            Зарегистрироваться
          </Button>
        </div>
        {error && <p className="text-destructive">{error}</p>}
      </CardContent>
    </Card>
  )
}
