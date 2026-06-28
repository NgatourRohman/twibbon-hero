import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-2xl text-sm font-bold transition-all duration-300 before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-white/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:translate-y-px",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-br from-[#8667ff] via-[#6f50ef] to-[#5734d6] text-primary-foreground shadow-[0_10px_24px_-10px_rgba(104,72,229,.75),inset_0_1px_0_rgba(255,255,255,.35)] hover:-translate-y-0.5 hover:shadow-[0_16px_30px_-12px_rgba(104,72,229,.85),inset_0_1px_0_rgba(255,255,255,.4)]",
        secondary: "bg-gradient-to-br from-white to-violet-50 text-foreground shadow-clay hover:-translate-y-0.5",
        outline:
          "border border-white/80 bg-white/65 text-foreground shadow-[0_8px_24px_-16px_rgba(35,30,80,.5),inset_0_1px_0_white] backdrop-blur-xl hover:-translate-y-0.5 hover:border-primary/30 hover:bg-white",
        ghost: "before:hidden hover:bg-white/65 hover:shadow-sm",
        destructive:
          "bg-gradient-to-br from-red-500 to-red-600 text-destructive-foreground shadow-[0_10px_22px_-12px_rgba(220,38,38,.7)] hover:-translate-y-0.5",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 rounded-xl px-4 text-xs",
        lg: "h-13 rounded-2xl px-7 text-base",
        icon: "size-10 rounded-xl p-0",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
