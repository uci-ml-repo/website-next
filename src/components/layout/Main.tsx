import { cn } from "@/lib/utils";

interface MainProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
}

export default function Main({ children, className, ...props }: MainProps) {
  return (
    <main
      className={cn(
        "content mx-auto min-h-[100svh] max-md:mt-[--header-height]",
        className,
      )}
      {...props}
    >
      {children}
    </main>
  );
}
