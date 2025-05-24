import { ReactNode } from "react"
import { LabelColors } from "../types/ui"
import { Button } from "./button"

export type ButtonLabelProps = {
  color: LabelColors
  children?: ReactNode
  className?: string
}

export const ButtonLabel = ({color, children, className}: ButtonLabelProps) => {
  return (
    <Button disabled className={`bg-[${color}] rounded-lg ${className}`}>
      {children}
    </Button>
  )
}
