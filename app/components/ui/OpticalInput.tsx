// components/ui/OpticalInput.tsx
"use client";

import { useState, useEffect } from "react";

interface Props {
  label: string;
  name: string;
  step?: number;
  min?: number;
  max?: number;
  placeholder?: string;
}

export function OpticalInput({
  label,
  name,
  step = 0.25,
  min,
  max,
  placeholder,
}: Props) {
  const [value, setValue] = useState("");

  // Formata para 2 casas decimais quando sai do campo (blur)
  const handleBlur = () => {
    if (!value) return;
    const num = parseFloat(value);
    if (!isNaN(num)) {
      // Arredonda para o step mais próximo (ex: 0.25)
      const rounded = (Math.round(num * 4) / 4).toFixed(2);
      setValue(rounded);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
      <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "#475569" }}>
        {label}
      </label>
      <input
        type="number"
        name={name}
        step={step}
        min={min}
        max={max}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleBlur}
        placeholder={placeholder || "0.00"}
        style={{
          padding: "0.5rem",
          border: "1px solid #cbd5e1",
          borderRadius: "0.375rem",
          fontFamily: "monospace",
          fontSize: "1rem",
          width: "100%",
        }}
      />
    </div>
  );
}
