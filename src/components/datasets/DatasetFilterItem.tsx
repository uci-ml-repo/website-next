import { motion } from "motion/react";
import { useState } from "react";

export default function DatasetFilterItem({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-full rounded-lg p-3 text-left text-lg hover:bg-accent"
      >
        {label}
      </button>
      <motion.div
        initial={{ height: 0 }}
        animate={open ? { height: "auto", marginTop: 2 } : {}}
        transition={{ duration: 0.1 }}
        className="flex min-h-full space-x-2 overflow-y-hidden"
      >
        {children}
      </motion.div>
    </div>
  );
}
