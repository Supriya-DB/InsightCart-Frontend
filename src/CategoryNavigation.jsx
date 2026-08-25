import { useState } from "react";

export default function CategoryNavigation({
  categories,
  selectedCategory,
  setSelectedCategory,
}) {
  const [hovered, setHovered] = useState(null);

  const isActive = (name) => selectedCategory === name;

  return (
    <div style={wrapperStyle}>
      <div style={scrollRowStyle}>
        <button
          onClick={() => setSelectedCategory("ALL")}
          onMouseEnter={() => setHovered("ALL")}
          onMouseLeave={() => setHovered(null)}
          style={getChipStyle(isActive("ALL"), hovered === "ALL")}
        >
          All
        </button>

        {categories.map((category) => {
          const active = isActive(category.categoryName);
          const isHovered = hovered === category.categoryId;

          return (
            <button
              key={category.categoryId}
              onClick={() => setSelectedCategory(category.categoryName)}
              onMouseEnter={() => setHovered(category.categoryId)}
              onMouseLeave={() => setHovered(null)}
              style={getChipStyle(active, isHovered)}
            >
              {category.categoryName}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const wrapperStyle = {
  padding: "24px 20px",
  background: "linear-gradient(180deg, #fafbfc 0%, #ffffff 100%)",
  borderBottom: "1px solid #eef0f2",
};

const scrollRowStyle = {
  display: "flex",
  justifyContent: "center",
  gap: "12px",
  flexWrap: "wrap",
  maxWidth: "1100px",
  margin: "0 auto",
};

const getChipStyle = (active, hovered) => {
  let bg = "#ffffff";
  if (active) {
    bg = "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)";
  } else if (hovered) {
    bg = "#f0f6ff";
  }

  let shadow = "none";
  if (active) {
    shadow = "0 4px 14px rgba(25, 118, 210, 0.35)";
  } else if (hovered) {
    shadow = "0 2px 8px rgba(0,0,0,0.06)";
  }

  let moveUp = "translateY(0)";
  if (hovered && !active) {
    moveUp = "translateY(-1px)";
  }

  return {
    padding: "10px 22px",
    border: active ? "1.5px solid #1976d2" : "1.5px solid #e0e4e9",
    background: bg,
    color: active ? "#ffffff" : "#33373d",
    cursor: "pointer",
    borderRadius: "999px",
    fontSize: "14.5px",
    fontWeight: active ? "600" : "500",
    letterSpacing: "0.2px",
    transition: "all 0.2s ease",
    boxShadow: shadow,
    transform: moveUp,
  };
};