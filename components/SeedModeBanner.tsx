'use client'

import { useEffect, useState } from 'react'

type SystemMode = 'seed' | 'live'

export function SeedModeBanner() {
  const [mode, setMode] = useState<SystemMode | null>(null)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    fetch('/api/system/mode')
      .then(res => res.json())
      .then(data => setMode(data.mode))
      .catch(() => setMode('seed')) // fallback to seed mode on error
  }, [])

  if (!isVisible || mode === 'live' || mode === null) {
    return null
  }

  return (
    <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <svg className="h-5 w-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="text-sm font-medium text-yellow-800">
              Sistema en Modo Demo
            </p>
            <p className="text-sm text-yellow-700">
              Los datos son temporales. Configure la base de datos para activar el modo producción.
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-yellow-500 hover:text-yellow-600"
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  )
}