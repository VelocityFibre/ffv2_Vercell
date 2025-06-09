import { Component, JSX, Show } from "solid-js"

interface DialogProps extends JSX.HTMLAttributes<HTMLDivElement> {
  open?: boolean
  onClose?: () => void
}

export const Dialog: Component<DialogProps> = (props) => {
  return (
    <Show when={props.open}>
      <div class="fixed inset-0 z-50 flex items-center justify-center">
        <div 
          class="fixed inset-0 bg-black/50" 
          onClick={props.onClose}
        />
        <div 
          class={`relative bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4 ${props.class || ''}`}
          {...props}
        />
      </div>
    </Show>
  )
}