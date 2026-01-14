import React from 'react'

export function Avatar({ src, alt, className = '' }) {
  return (
    <div className={`h-10 w-10 rounded-full overflow-hidden border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-800 ${className}`}>
      <img src={src} alt={alt} className="h-full w-full object-cover" />
    </div>
  )
}
