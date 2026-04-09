'use client'

import { motion } from 'framer-motion'
import { AnimatedText } from './AnimatedText'

interface HolaMundoProps {
  title: string
  subtitle: string
  description: string
}

export function HolaMundo({ title, subtitle, description }: HolaMundoProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 100,
        damping: 10,
      },
    },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Decorative line above */}
      <motion.div variants={itemVariants} className="flex justify-center">
        <div className="h-px w-16 bg-gradient-to-r from-transparent via-violet-500 to-transparent" />
      </motion.div>

      {/* Title */}
      <motion.div variants={itemVariants} className="text-center">
        <h1 className="text-6xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-purple-400 to-violet-400">
          <AnimatedText text={title} delay={1} />
        </h1>
      </motion.div>

      {/* Subtitle */}
      <motion.div variants={itemVariants} className="text-center">
        <p className="text-xl md:text-2xl font-light text-slate-200 tracking-wide">
          {subtitle}
        </p>
      </motion.div>

      {/* Description */}
      <motion.div variants={itemVariants} className="text-center">
        <p className="text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          {description}
        </p>
      </motion.div>

      {/* Decorative line below */}
      <motion.div variants={itemVariants} className="flex justify-center">
        <div className="h-px w-16 bg-gradient-to-r from-transparent via-violet-500 to-transparent" />
      </motion.div>

      {/* Subtle glow effect */}
      <motion.div
        className="absolute inset-0 -z-10 opacity-20"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: 'reverse' as const,
        }}
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(124, 58, 237, 0.3), transparent)',
          backgroundSize: '200% 200%',
        }}
      />
    </motion.div>
  )
}
