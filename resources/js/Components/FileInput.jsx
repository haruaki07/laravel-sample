import React, { forwardRef, useEffect, useRef, useState } from "react";

/**
 * @type {React.ForwardRefExoticComponent<
 *   React.RefAttributes<HTMLInputElement>
 *     & Pick<React.PropsWithoutRef<HTMLInputElement>, "name" | "id" | "className" | "required">
 *     & { isFocused?: boolean, handleChange?: () => void, defaultPreview?: string, value?: File }
 * >}
 */
const FileInput = forwardRef((props, ref) => {
  const {
    name,
    id = "file_input",
    className = "",
    required,
    isFocused,
    handleChange,
    defaultPreview,
    value = null,
  } = props;

  const input = ref ? ref : useRef();

  /** @type {[File, React.SetStateAction<File>]} */
  const [file, setFile] = useState(value);

  /** @type {React.ChangeEventHandler<HTMLInputElement>} */
  const onChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;

    if (!f.type.toLowerCase().startsWith("image")) {
      return;
    }

    setFile(
      Object.assign(f, {
        preview: URL.createObjectURL(f),
      })
    );

    handleChange && handleChange(f);
  };

  useEffect(() => {
    setFile(value);
  }, [value]);

  useEffect(() => {
    if (isFocused) {
      input.current.focus();
    }

    return () => {
      file?.preview && URL.revokeObjectURL(file.preview);
    };
  }, []);

  return (
    <div className={["flex flex-col items-start", className].join(" ")}>
      <label
        className="form-label inline-block text-gray-700 cursor-pointer"
        htmlFor={id}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
          />
        </svg>
      </label>
      <input
        ref={input}
        type="file"
        accept="image/*"
        id={id}
        name={name}
        aria-describedby={id + "_help"}
        required={required}
        className={"hidden"}
        onChange={onChange}
      />
      {(file !== null || !!defaultPreview) && (
        <Preview file={file} defaultPreview={defaultPreview} />
      )}
    </div>
  );
});

/** @type {React.FC<{file: File & { preview?: string }, defaultPreview?: string }>} */
const Preview = ({ file, defaultPreview }) => {
  return (
    <div
      className="w-32 h-32 mt-4 bg-cover border-4 border-white"
      style={{ backgroundImage: `url(${file?.preview || defaultPreview})` }}
    />
  );
};

export default FileInput;
