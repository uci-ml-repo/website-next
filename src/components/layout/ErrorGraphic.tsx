"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { useRef } from "react";

import { Main } from "@/components/layout/Main";

interface ErrorGraphicProps {
  code?: number | string;
  header?: string;
  children?: React.ReactNode;
}

export function ErrorGraphic({ code, header, children }: ErrorGraphicProps) {
  const constraintsRef = useRef(null);

  return (
    <Main className="flex flex-1">
      <div className="flex flex-grow flex-col items-center justify-center space-y-4">
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
              alt="Anteater"
              title="Artwork by UCI ICSSC Graphics Committee"
              className="drop-shadow-xl"
              width={200}
              height={200}
            />
          </motion.div>
        </div>
        <div className="flex flex-col items-center space-y-4">
          {code && <div className="text-7xl text-muted-foreground">{code}</div>}
          {header && (
            <h1 className="text-center text-4xl font-bold">{header}</h1>
          )}
        </div>
        {children}
      </div>
    </Main>
  );
}
