import { cn } from "@/lib/utils";

interface MainProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
}

export default function Main({ children, className, ...props }: MainProps) {
  return (
    <main
      className={cn(
        "content mx-auto",
        "max-md: pt-4 max-md:mt-[--header-height]",
        className,
      )}
      {...props}
    >
      {children}
    </main>
  );
}
