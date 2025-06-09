import { Component, JSX } from "solid-js"

interface InputProps extends JSX.InputHTMLAttributes<HTMLInputElement> {}

export const Input: Component<InputProps> = (props) => {
  return (
    <input 
      class={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${props.class || ''}`}
      {...props}
    />
  )
}