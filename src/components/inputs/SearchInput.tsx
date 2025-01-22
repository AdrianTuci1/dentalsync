import React, { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

const SearchInput: React.FC<{
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ value, onChange }) => {
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const handleClear = () => {
    onChange({ target: { value: "" } } as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        marginLeft: "20px",
        width: "200px",
      }}
    >
      {/* Magnifier Icon - Always Positioned on the Left */}
      {!isFocused && (
        <SearchIcon
          style={{
            position: "absolute",
            left: "8px",
            color: "#888",
          }}
        />
      )}

      {/* Input Field */}
      <input
        type="text"
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="Search..."
        style={{
          padding: "10px 30px 10px 30px", // Add consistent padding to prevent overlap
          border: "1px solid #ccc",
          borderRadius: "4px",
          outline: "none",
          fontSize: "14px",
          width: "100%",
        }}
      />

      {/* Clear Icon - Visible only when there is text */}
      {value && (
        <CloseIcon
          onClick={handleClear}
          style={{
            position: "absolute",
            right: "8px",
            color: "#888",
            cursor: "pointer",
          }}
        />
      )}
    </div>
  );
};

export default SearchInput;
