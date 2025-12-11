"use client"

interface CheckboxFieldProps {
  label: string
  checked?: boolean
  onChange?: (checked: boolean) => void
}

export function CheckboxField({ label, checked = false, onChange }: CheckboxFieldProps) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        defaultChecked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
        className="w-4 h-4 rounded border-border accent-primary"
      />
      <span className="text-sm font-medium">{label}</span>
    </label>
  )
}
