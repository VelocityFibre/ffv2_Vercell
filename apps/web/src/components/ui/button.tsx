import { Component, JSX } from "solid-js"

interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'secondary' | 'destructive'
  size?: 'sm' | 'default' | 'lg'
}

export const Button: Component<ButtonProps> = (props) => {
  const variants = {
    default: 'bg-blue-600 text-white hover:bg-blue-700 border-blue-600',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 border-gray-100',
    destructive: 'bg-red-600 text-white hover:bg-red-700 border-red-600'
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    default: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  }
  
  const variant = variants[props.variant || 'default']
  const size = sizes[props.size || 'default']
  
  return (
    <button 
      class={`inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed border ${variant} ${size} ${props.class || ''}`}
      {...props}
    />
  )
}