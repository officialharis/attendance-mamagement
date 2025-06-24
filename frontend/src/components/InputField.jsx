import React from "react";

const InputField = ({ type, placeholder, name, handleChange, data }) => {
  return (
    <input
      className="w-full px-2 py-2.5 border border-gray-500/30 rounded outline-none
    text-gray-500 focus:border-primary transition"
      type={type}
      placeholder={placeholder}
      name={name}
      onChange={handleChange}
      value={data[name]}
    />
  );
};

export default InputField;
