//import { useState } from 'react';

export default function TextInput(props) {
  const { value, onChange, placeholder, isRequired = false, style } = props;
  return (
    <input
      className='text-input'
      type='text'
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={isRequired}
      placeholder={placeholder}
      style={style}
    />
  );
}
