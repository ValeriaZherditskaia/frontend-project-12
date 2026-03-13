// Хук для авто-высоты textarea

import { useEffect, useRef } from 'react'

const useAutoResize = (value) => {
  const textareaRef = useRef(null)

  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    textarea.style.height = 'auto'
    textarea.style.height = `${textarea.scrollHeight}px`
  }, [value])

  return textareaRef
}

export default useAutoResize
