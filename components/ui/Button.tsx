'use client'

import { ButtonHTMLAttributes, forwardRef } from 'react'
import { VariantProps, cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-cs text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cs-teal focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default: 'bg-cs-indigo text-white hover:bg-cs-indigo/90',
        secondary: 'bg-white text-cs-indigo border border-cs-indigo hover:bg-cs-lavender/20',
        outline: 'border border-cs-gray text-cs-gray hover:bg-cs-light',
        ghost: 'text-cs-indigo hover:bg-cs-lavender/20',
        link: 'text-cs-indigo underline-offset-4 hover:underline',
        danger: 'bg-cs-coral text-white hover:bg-cs-coral/90',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-12 px-6 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
