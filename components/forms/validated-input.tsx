"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { masks } from "@/lib/validation"
import { AlertCircle } from "lucide-react"

interface ValidatedInputProps {
  name: string
  label: string
  type?: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  error?: string
  required?: boolean
  disabled?: boolean
  maxLength?: number
  minLength?: number
  pattern?: string
  mask?: keyof typeof masks
  showCounter?: boolean
  className?: string
  validate?: (value: string) => string | undefined
}

export function ValidatedInput({
  name,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  required = false,
  disabled = false,
  maxLength,
  minLength,
  pattern,
  mask,
  showCounter = false,
  className,
  validate,
}: ValidatedInputProps) {
  const [internalError, setInternalError] = useState<string>()
  const [touched, setTouched] = useState(false)

  // Validar quando o valor muda
  useEffect(() => {
    if (touched && validate) {
      const validationError = validate(value)
      setInternalError(validationError)
    }
  }, [value, validate, touched])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value

    // Aplicar máscara se especificada
    if (mask && masks[mask]) {
      newValue = masks[mask](newValue)
    }

    // Respeitar limite máximo
    if (maxLength && newValue.length > maxLength) {
      return
    }

    onChange(newValue)
  }

  const handleBlur = () => {
    setTouched(true)
    if (validate) {
      const validationError = validate(value)
      setInternalError(validationError)
    }
    onBlur?.()
  }

  const displayError = error || internalError
  const currentLength = value.length
  const isOverLimit = maxLength && currentLength > maxLength

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex justify-between items-center">
        <Label
          htmlFor={name}
          className={cn(
            "text-sm font-medium text-gray-700",
            displayError && "text-red-600",
            required && 'after:content-["*"] after:ml-0.5 after:text-red-500',
          )}
        >
          {label}
        </Label>
        {showCounter && maxLength && (
          <span className={cn("text-xs", isOverLimit ? "text-red-500" : "text-gray-500")}>
            {currentLength}/{maxLength}
          </span>
        )}
      </div>

      <div className="relative">
        <Input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={disabled}
          maxLength={maxLength}
          minLength={minLength}
          pattern={pattern}
          className={cn(
            "transition-colors",
            displayError && "border-red-500 focus:border-red-500 focus:ring-red-500",
            isOverLimit && "border-red-500",
          )}
          aria-invalid={!!displayError}
          aria-describedby={displayError ? `${name}-error` : undefined}
        />
      </div>

      {displayError && (
        <div id={`${name}-error`} className="flex items-center gap-2 text-sm text-red-600">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{displayError}</span>
        </div>
      )}
    </div>
  )
}
