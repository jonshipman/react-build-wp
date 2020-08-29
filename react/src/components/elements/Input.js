import React, { forwardRef } from "react";

const groupClassName = "form-group overflow-hidden w-100 mb4";
const fieldClassName =
  "w-100 b--light-silver br0 bb-1 bl-0 br-0 bt-0 pa pl2 pb2";
const labelClassName = "fw7 ttu db w-100 mb2 pl2";

const keyGeneration = ({ loading = false }) => {
  return loading ? `loading` : `loaded`;
};

const _Checkbox = (
  {
    id,
    type = "checkbox",
    label = "Checkbox",
    onChange = () => true,
    value = "",
    className = "",
    children,
    loading,
    options = [{ value: "1", label: "" }],
    ...props
  },
  ref
) => {
  return (
    <div className={className} ref={ref}>
      <div className="flex-l">
        <div className="w-50-l">
          <label htmlFor={id} className={`primary ${labelClassName}`}>
            {label}:{" "}
          </label>
        </div>

        <div className="w-50-l">
          {options.map(({ value: oValue, label: oLabel }) => (
            <label
              htmlFor={`${id}-${oValue}`}
              className="dib pointer mr3 mb2"
              key={`${id}-${oValue}`}
            >
              <input
                id={`${id}-${oValue}`}
                type={type}
                value={oValue}
                checked={value === oValue}
                className="dib ml2"
                onChange={(e) => onChange(e.currentTarget.value)}
                key={keyGeneration({ loading })}
                {...props}
              />
              {` ${oLabel}`}
            </label>
          ))}
        </div>
      </div>

      {children}
    </div>
  );
};

const Checkbox = forwardRef(_Checkbox);

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
