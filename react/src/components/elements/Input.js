import React from "react";

export const Input = ({
  id,
  label,
  type = "text",
  onChange = () => true,
  onEnter = () => true,
  value = "",
  className = "",
  children,
  ...props
}) => (
  <div className={`form-group w-100 mb4 drop-last-mb ${className}`}>
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
      value={value}
      className="w-100 b--light-silver br0 bb-1 bl-0 br-0 bt-0 pa pl2 pb2"
      style={{ flexGrow: 1 }}
      {...props}
    />
    {children}
  </div>
);

export const Select = ({
  id,
  label,
  onChange = () => true,
  options = {},
  value = "",
  className = "",
  children,
  placeholder,
  ...props
}) => (
  <div className={`form-group w-100 mb4 drop-last-mb ${className}`}>
    {label && (
      <label htmlFor={id} className="fw7 ttu db w-100 mb2 pl2">
        {label}:{" "}
      </label>
    )}
    <select
      onChange={(e) => onChange(e.currentTarget.value)}
      id={id}
      defaultValue={value}
      className="w-100 b--light-silver br0 bb-1 bl-0 br-0 bt-0 pa pl2 pb2"
      style={{ flexGrow: 1 }}
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

export const Textarea = ({
  id,
  label,
  onChange = () => true,
  onEnter = () => true,
  value = "",
  className = "",
  children,
  ...props
}) => (
  <div className={`form-group w-100 mb4 drop-last-mb ${className}`}>
    {label && (
      <label htmlFor={id} className="fw7 ttu db w-100 mb2 pl2">
        {label}:{" "}
      </label>
    )}
    <textarea
      onKeyDown={(e) => "Enter" === e.key && onEnter()}
      onChange={(e) => onChange(e.currentTarget.value)}
      id={id}
      className="w-100 b--light-silver br0 bb-1 bl-0 br-0 bt-0 pa pl2 pb2"
      style={{ flexGrow: 1 }}
      {...props}
    >
      {value}
    </textarea>
    {children}
  </div>
);

export default ({ type = "text", ...props }) => {
  if ("textarea" === type) {
    return <Textarea {...props} />;
  }

  if ("select" === type) {
    return <Select {...props} />;
  }

  return <Input type={type} {...props} />;
};
