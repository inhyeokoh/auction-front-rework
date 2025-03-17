import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";
import styles from "./button.module.css";

const Button = React.forwardRef(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    
    const variantClass = styles[variant] || styles.default;
    const sizeClass = styles[size] || styles["default-size"];
    
    return (
      <Comp
        className={cn(styles.button, variantClass, sizeClass, className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

// Export the button component
export { Button };

// Define buttonVariants function to maintain compatibility
const buttonVariants = ({ variant, size, className }) => {
  const variantClass = styles[variant || "default"] || styles.default;
  const sizeClass = styles[size || "default"] || styles["default-size"];
  return cn(styles.button, variantClass, sizeClass, className);
};

export { buttonVariants };