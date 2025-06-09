import { Component, JSX } from "solid-js"

interface ProgressProps extends JSX.HTMLAttributes<HTMLDivElement> {
  value: number
  max: number
}

export const Progress: Component<ProgressProps> = (props) => {
  const percentage = Math.min(100, Math.max(0, (props.value / props.max) * 100))
  
  return (
    <div 
      class={`w-full bg-gray-200 rounded-full overflow-hidden h-2 ${props.class || ''}`}
      {...props}
    >
      <div
        class="bg-blue-600 h-full transition-all duration-300 ease-in-out"
        style={{ width: `${percentage}%` }}
      />
    </div>
  )
}