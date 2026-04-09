'use client'

import { motion } from 'framer-motion'

interface AnimatedTextProps {
  text: string
  delay?: number
}

export function AnimatedText({ text, delay = 0 }: AnimatedTextProps) {
  const letters = text.split('')

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: delay * 0.1 },
    }),
  }

  const child = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring' as const,
        damping: 12,
        stiffness: 100,
      },
    },
  }

  return (
    <motion.div variants={container} initial="hidden" animate="visible">
      <span className="inline-flex flex-wrap justify-center gap-1">
        {letters.map((letter, index) => (
          <motion.span key={index} variants={child} className="inline-block">
            {letter === ' ' ? '\u00A0' : letter}
          </motion.span>
        ))}
      </span>
    </motion.div>
  )
}
