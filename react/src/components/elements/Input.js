import React, { useState, useEffect } from "react";

export const Checkbox = ({
  id,
  label = "Checkbox",
  type = "checkbox",
  onChange = () => true,
  value = "",
  className = "",
  children,
  checked = false,
  ...props
}) => {
  const [isChecked, setIsChecked] = useState(checked);

  useEffect(() => {
    setIsChecked(checked);
  }, [setIsChecked, checked]);

  return (
    <div className={className}>
      <label htmlFor={id} className="fw7 ttu dib w-100 pointer">
        {label}:{" "}
        <input
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
          {...props}
        />
      </label>

      {children}
    </div>
  );
};

export const Input = ({
  id,
  label,
  type = "text",
  fieldClassName,
  onChange = () => true,
  onEnter = () => true,
  value = "",
  className = "",
  children,
  ...props
}) => (
  <div className={className}>
    {label && (
      <label htmlFor={id} className="fw7 ttu db w-100 mb2 pl2">
        {label}:{" "}
      </label>
    )}
    <input
      onKeyDown={(e) => "Enter" === e.key && onEnter()}
      onChange={(e) => onChange(e.currentTarget.value)}
      id={id}
      type={type}
      defaultValue={value}
      className={fieldClassName}
      style={{ flexGrow: 1 }}
      {...props}
    />
    {children}
  </div>
);

export const Select = ({
  id,
  label,
  fieldClassName,
  onChange = () => true,
  options = {},
  value = "",
  className = "",
  children,
  placeholder,
  ...props
}) => (
  <div className={className}>
    {label && (
      <label htmlFor={id} className="fw7 ttu db w-100 mb2 pl2">
        {label}:{" "}
      </label>
    )}
    <select
      onChange={(e) => onChange(e.currentTarget.value)}
      id={id}
      defaultValue={value}
      className={fieldClassName}
      style={{ flexGrow: 1 }}
      {...props}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((option) => (
        <option
          key={option.value}
          value={option.value}
          selected={option.value === value}
        >
          {option.label}
        </option>
      ))}
    </select>
    {children}
  </div>
);

export const Textarea = ({
  id,
  label,
  fieldClassName,
  onChange = () => true,
  onEnter = () => true,
  value = "",
  className = "",
  children,
  ...props
}) => (
  <div className={className}>
    {label && (
      <label htmlFor={id} className="fw7 ttu db w-100 mb2 pl2">
        {label}:{" "}
      </label>
    )}
    <textarea
      onKeyDown={(e) => "Enter" === e.key && onEnter()}
      onChange={(e) => onChange(e.currentTarget.value)}
      id={id}
      defaultValue={value}
      className={fieldClassName}
      style={{ flexGrow: 1 }}
      {...props}
    />
    {children}
  </div>
);

export default ({ type = "text", className = "", children, ...props }) => {
  const fieldClassName =
    "w-100 b--light-silver br0 bb-1 bl-0 br-0 bt-0 pa pl2 pb2";
  const groupClassName = `form-group overflow-hidden w-100 mb4 ${className}`;

  if ("textarea" === type) {
    return (
      <Textarea
        className={groupClassName}
        fieldClassName={fieldClassName}
        {...props}
      >
        {children}
      </Textarea>
    );
  }

  if ("select" === type) {
    return (
      <Select
        className={groupClassName}
        fieldClassName={fieldClassName}
        {...props}
      >
        {children}
      </Select>
    );
  }

  if ("checkbox" === type || "radio" === type) {
    return (
      <Checkbox type={type} className={groupClassName} {...props}>
        {children}
      </Checkbox>
    );
  }

  return (
    <Input
      type={type}
      className={groupClassName}
      fieldClassName={fieldClassName}
      {...props}
    >
      {children}
    </Input>
  );
};
