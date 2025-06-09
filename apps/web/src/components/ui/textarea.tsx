import { Component, JSX } from "solid-js"

interface TextareaProps extends JSX.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea: Component<TextareaProps> = (props) => {
  return (
    <textarea 
      class={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${props.class || ''}`}
      {...props}
    />
  )
}