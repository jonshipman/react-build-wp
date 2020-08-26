import React, { useState, useEffect, forwardRef } from "react";

const groupClassName = "form-group overflow-hidden w-100 mb4";
const fieldClassName =
  "w-100 b--light-silver br0 bb-1 bl-0 br-0 bt-0 pa pl2 pb2";
const labelClassName = "fw7 ttu db w-100 mb2 pl2";

const keyGeneration = ({ loading = false }) => {
  return loading ? `loading` : `loaded`;
};

const CheckboxRef = (
  {
    id,
    label = "Checkbox",
    type = "checkbox",
    onChange = () => true,
    value = "",
    className = "",
    children,
    checked = false,
    loading,
    ...props
  },
  ref
) => {
  const [isChecked, setIsChecked] = useState(checked);

  useEffect(() => {
    setIsChecked(checked);
  }, [setIsChecked, checked]);

  return (
    <div className={className}>
      <label htmlFor={id} className="fw7 ttu dib w-100 pointer">
        {label}:{" "}
        <input
          ref={ref}
          onChange={() => {
            setIsChecked((prev) => {
              setTimeout(() => {
                onChange(!prev, value, id);
              });
              return !prev;
            });
          }}
          id={id}
          type={type}
          value={value}
          checked={isChecked}
          className="dib ml2"
          key={keyGeneration({ loading })}
          {...props}
        />
      </label>

      {children}
    </div>
  );
};

export const Checkbox = forwardRef(CheckboxRef);

const InputRef = (
  {
    id,
    label,
    type = "text",
    onChange = () => true,
    onEnter = () => true,
    value = "",
    className = "",
    children,
    loading,
    ...props
  },
  ref
) => (
  <div className={className}>
    {label && (
      <label htmlFor={id} className={labelClassName}>
        {label}:{" "}
      </label>
    )}
    <input
      ref={ref}
      onKeyDown={(e) => "Enter" === e.key && onEnter()}
      onChange={(e) => onChange(e.currentTarget.value)}
      id={id}
      type={type}
      value={value}
      className={fieldClassName}
      style={{ flexGrow: 1 }}
      key={keyGeneration({ loading })}
      {...props}
    />
    {children}
  </div>
);

export const Input = forwardRef(InputRef);

const SelectRef = (
  {
    id,
    label,
    onChange = () => true,
    options = {},
    value = "",
    className = "",
    children,
    placeholder,
    loading,
    ...props
  },
  ref
) => (
  <div className={className}>
    {label && (
      <label htmlFor={id} className={labelClassName}>
        {label}:{" "}
      </label>
    )}
    <select
      ref={ref}
      onChange={(e) => onChange(e.currentTarget.value)}
      id={id}
      value={value}
      className={fieldClassName}
      style={{ flexGrow: 1 }}
      key={keyGeneration({ loading })}
      {...props}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    {children}
  </div>
);

export const Select = forwardRef(SelectRef);

const TextareaRef = (
  {
    id,
    label,
    onChange = () => true,
    onEnter = () => true,
    value = "",
    className = "",
    children,
    loading,
    ...props
  },
  ref
) => (
  <div className={className}>
    {label && (
      <label htmlFor={id} className={labelClassName}>
        {label}:{" "}
      </label>
    )}
    <textarea
      ref={ref}
      onKeyDown={(e) => "Enter" === e.key && onEnter()}
      onChange={(e) => onChange(e.currentTarget.value)}
      id={id}
      value={value}
      className={fieldClassName}
      style={{ flexGrow: 1 }}
      key={keyGeneration({ loading })}
      {...props}
    />
    {children}
  </div>
);

export const Textarea = forwardRef(TextareaRef);

const FormGroup = (
  { type = "text", className = "", children, ...props },
  ref
) => {
  const mergedClassName = `${groupClassName} ${className}`;

  if ("textarea" === type) {
    return (
      <Textarea ref={ref} className={mergedClassName} {...props}>
        {children}
      </Textarea>
    );
  }

  if ("select" === type) {
    return (
      <Select ref={ref} className={mergedClassName} {...props}>
        {children}
      </Select>
    );
  }

  if ("checkbox" === type || "radio" === type) {
    return (
      <Checkbox ref={ref} type={type} className={mergedClassName} {...props}>
        {children}
      </Checkbox>
    );
  }

  return (
    <Input ref={ref} type={type} className={mergedClassName} {...props}>
      {children}
    </Input>
  );
};

export default forwardRef(FormGroup);
