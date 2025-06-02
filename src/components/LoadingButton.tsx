import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
  variant?:
    | "link"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | null
    | undefined;
}

export const LoadingButton = ({
  children,
  isLoading,
  loadingText,
  disabled,
  className,
  variant,
  ...props
}: LoadingButtonProps) => {
  return (
    <Button
      variant={variant}
      disabled={isLoading || disabled}
      className={cn(className, "inline-flex items-center")}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {isLoading && loadingText ? loadingText : children}
    </Button>
  );
};
