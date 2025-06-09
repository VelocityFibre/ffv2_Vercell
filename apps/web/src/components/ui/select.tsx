import { Component, JSX } from "solid-js"

interface SelectProps extends JSX.SelectHTMLAttributes<HTMLSelectElement> {}

export const Select: Component<SelectProps> = (props) => {
  return (
    <select 
      class={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white ${props.class || ''}`}
      {...props}
    />
  )
}