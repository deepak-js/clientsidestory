'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { createColorVariables, isValidHexColor } from '@/lib/utils/color-utils'

interface ColorContextType {
  accentColor: string
  setAccentColor: (color: string) => void
  colorStyles: React.CSSProperties
}

const defaultAccentColor = '#6366f1' // Default indigo color

const ColorContext = createContext<ColorContextType>({
  accentColor: defaultAccentColor,
  setAccentColor: () => {},
  colorStyles: createColorVariables(defaultAccentColor)
})

export const useColorContext = () => useContext(ColorContext)

export function ColorProvider({ children }: { children: React.ReactNode }) {
  const [accentColor, setAccentColor] = useState(defaultAccentColor)
  const [colorStyles, setColorStyles] = useState<React.CSSProperties>(
    createColorVariables(defaultAccentColor)
  )

  // Update color styles when accent color changes
  useEffect(() => {
    if (isValidHexColor(accentColor)) {
      setColorStyles(createColorVariables(accentColor))
    } else {
      setColorStyles(createColorVariables(defaultAccentColor))
    }
  }, [accentColor])

  return (
    <ColorContext.Provider value={{ accentColor, setAccentColor, colorStyles }}>
      <div style={colorStyles}>{children}</div>
    </ColorContext.Provider>
  )
}
