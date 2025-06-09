import { Component, JSX } from "solid-js"

interface BadgeProps extends JSX.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'warning' | 'outline'
}

export const Badge: Component<BadgeProps> = (props) => {
  const variants = {
    default: 'bg-blue-100 text-blue-800',
    secondary: 'bg-gray-100 text-gray-800',
    destructive: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800',
    outline: 'border border-gray-300 text-gray-700 bg-white'
  }
  
  const variant = variants[props.variant || 'default']
  
  return (
    <span 
      class={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variant} ${props.class || ''}`}
      {...props}
    />
  )
}