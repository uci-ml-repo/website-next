"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { useRef } from "react";

import { ROUTES } from "@/lib/routes";

interface ErrorGraphicProps {
  code?: number | string;
  header?: string;
  children?: ReactNode;
}

export function ErrorPage({ code, header, children }: ErrorGraphicProps) {
  const constraintsRef = useRef(null);

  return (
    <div className="flex grow flex-col">
      <div className="flex grow flex-col items-center justify-center space-y-4">
        <div ref={constraintsRef}>
          <motion.div
            drag
            dragConstraints={constraintsRef}
            dragElastic={0.4}
            dragTransition={{
              bounceStiffness: 100,
              bounceDamping: 15,
              restDelta: 0.001,
            }}
            initial={{ scale: 0.85 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 1500,
              damping: 30,
              mass: 3,
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="cursor-grab active:cursor-grabbing"
            tabIndex={-1}
          >
            <Image
              draggable={false}
              src="/img/anteater.png"
              alt="Anteater graphic"
              className="drop-shadow-xl"
              width={200}
              height={200}
            />
          </motion.div>
        </div>
        <div className="flex flex-col items-center space-y-4">
          {code && <div className="text-muted-foreground text-6xl">{code}</div>}
          {header && <h1 className="text-center text-4xl font-bold">{header}</h1>}
        </div>
        <div className="flex">{children}</div>
      </div>
      <div className="flex justify-center">
        <Link href={ROUTES.CONTACT} className="text-muted-foreground underline">
          Report an Issue
        </Link>
      </div>
    </div>
  );
}
