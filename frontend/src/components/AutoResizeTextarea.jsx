import { forwardRef } from 'react'

const AutoResizeTextarea = forwardRef(({
  value,
  onChange,
  onKeyDown,
  disabled,
  placeholder,
  'aria-label': ariaLabel,
}, ref) => (
  <textarea
    ref={ref}
    className="form-control message-input"
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    onKeyDown={onKeyDown}
    maxLength={500}
    disabled={disabled}
    rows={1}
    aria-label={ariaLabel}
  />
))

AutoResizeTextarea.displayName = 'AutoResizeTextarea'

export default AutoResizeTextarea
