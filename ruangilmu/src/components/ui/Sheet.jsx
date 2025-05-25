// src/components/ui/sheet.jsx
import * as React from "react"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { clsx } from "clsx"

const Sheet = SheetPrimitive.Root
const SheetTrigger = SheetPrimitive.Trigger

const SheetContent = React.forwardRef(({ className, side = "right", children, ...props }, ref) => {
  return (
    <SheetPrimitive.Portal>
      <SheetPrimitive.Overlay className="fixed" />
      <SheetPrimitive.Content
        ref={ref}
        className={clsx(
          "fixed z-50 flex flex-col bg-white p-6 shadow-lg transition ease-in-out duration-300",
          side === "right" && "right-0 top-0 h-full w-80",
          side === "left" && "left-0 top-0 h-full w-80",
          className
        )}
        {...props}
      >
        {children}
      </SheetPrimitive.Content>
    </SheetPrimitive.Portal>
  )
})
SheetContent.displayName = "SheetContent"

export { Sheet, SheetTrigger, SheetContent }
