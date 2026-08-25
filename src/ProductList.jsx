import { useState } from "react";

export default function ProductList({ products }) {
  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const addToCart = async (product) => {
    try {
      const response = await fetch(
        "http://localhost:9090/api/cart/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            productId: product.product_id,
            quantity: 1,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Failed to add product");
        setShowPopup(true);

        setTimeout(() => {
          setShowPopup(false);
        }, 3000);

        return;
      }

      // SUCCESS
      setMessage(`${product.name} added to cart successfully!`);
      setShowPopup(true);

      setTimeout(() => {
        setShowPopup(false);
      }, 3000);

    } catch (error) {
      console.error("Cart error:", error);

      setMessage("Unable to add product to cart");
      setShowPopup(true);

      setTimeout(() => {
        setShowPopup(false);
      }, 3000);
    }
  };

  if (!products || products.length === 0) {
    return (
      <h3 style={{ textAlign: "center" }}>
        No products found
      </h3>
    );
  }

  return (
    <div>

      {/* POPUP MESSAGE */}

      {showPopup && (
        <div
          style={{
            position: "fixed",
            top: "25px",
            right: "25px",
            zIndex: 9999,
            background: "#2e7d32",
            color: "white",
            padding: "15px 25px",
            borderRadius: "8px",
            boxShadow: "0 5px 20px rgba(0,0,0,0.25)",
            fontSize: "16px",
            fontWeight: "600",
          }}
        >
          ✓ {message}
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "25px",
          padding: "30px",
        }}
      >

        {products.map((product) => (

          <div
            key={product.product_id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "15px",
              padding: "20px",
              textAlign: "center",
              background: "white",
            }}
          >

            {/* PRODUCT IMAGE */}

            {product.images &&
              product.images.length > 0 && (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  style={{
                    width: "100%",
                    height: "220px",
                    objectFit: "contain",
                  }}
                />
              )}

            {/* PRODUCT NAME */}

            <h2>{product.name}</h2>

            {/* DESCRIPTION */}

            <p>{product.description}</p>

            {/* PRICE */}

            <h3>
              ₹ {Number(product.price).toFixed(2)}
            </h3>

            {/* STOCK */}

            <p>
              Stock: {product.stock}
            </p>

            {/* ADD TO CART */}

            <button
              onClick={() => addToCart(product)}
              style={{
                padding: "12px 25px",
                background: "#1976d2",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "600",
              }}
            >
              Add to Cart
            </button>

          </div>

        ))}

      </div>
    </div>
  );
}