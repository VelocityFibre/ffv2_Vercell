import { Component, JSX } from "solid-js"

interface CardProps extends JSX.HTMLAttributes<HTMLDivElement> {}

export const Card: Component<CardProps> = (props) => {
  return (
    <div 
      class={`bg-white rounded-lg border border-gray-200 shadow-sm p-6 ${props.class || ''}`}
      {...props}
    />
  )
}