import { EyeIcon, EyeOffIcon } from "lucide-react";
import * as React from "react";

import { Input, type InputProps } from "@/components/ui/input";

interface PasswordInputProps
  extends Omit<InputProps, "type" | "icon" | "iconPosition"> {}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    const handleToggle = () => {
      setShowPassword((prev) => !prev);
    };

    return (
      <Input
        ref={ref}
        {...props}
        type={showPassword ? "text" : "password"}
        icon={showPassword ? EyeOffIcon : EyeIcon}
        iconPosition="right"
        onIconClick={handleToggle}
      />
    );
  },
);

PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
