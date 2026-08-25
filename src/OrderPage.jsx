import { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";

export default function OrderPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:9090/api/orders",
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to load orders"
        );
      }

      /*
       * Backend response:
       *
       * {
       *   role: "CUSTOMER",
       *   username: "supri",
       *   products: [...]
       * }
       *
       * We need data.products.
       */

      const products = data.products || [];

      /*
       * Multiple products can belong to the same order.
       *
       * Example:
       *
       * order_123
       *   -> Shirt10
       *   -> Shirt2
       *   -> Shirt1
       *
       * So group products using order_id.
       */

      const groupedOrders = {};

      products.forEach((product) => {
        const orderId = product.order_id;

        if (!groupedOrders[orderId]) {
          groupedOrders[orderId] = {
            order_id: orderId,
            status: product.status,
            order_date: product.order_date,
            order_total: product.order_total,
            products: [],
          };
        }

        groupedOrders[orderId].products.push(product);
      });

      setOrders(Object.values(groupedOrders));
    } catch (error) {
      console.error("Error loading orders:", error);
      setError(error.message);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <>
      <Header />

      <div
        style={{
          width: "85%",
          maxWidth: "1100px",
          margin: "40px auto",
          minHeight: "500px",
        }}
      >
        <h1
          style={{
            marginBottom: "30px",
            color: "#222",
          }}
        >
          My Orders
        </h1>

        {/* Loading */}
        {loading && (
          <div
            style={{
              textAlign: "center",
              padding: "50px",
            }}
          >
            <h3>Loading your orders...</h3>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div
            style={{
              background: "#ffe6e6",
              color: "#c62828",
              padding: "15px 20px",
              borderRadius: "8px",
              marginBottom: "20px",
            }}
          >
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* No orders */}
        {!loading && !error && orders.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              border: "1px solid #ddd",
              borderRadius: "10px",
              background: "#fafafa",
            }}
          >
            <h2>No orders found</h2>

            <p
              style={{
                color: "#666",
                marginTop: "10px",
              }}
            >
              You haven't placed any successful orders yet.
            </p>
          </div>
        )}

        {/* Orders */}
        {!loading &&
          !error &&
          orders.map((order) => (
            <div
              key={order.order_id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "12px",
                marginBottom: "30px",
                overflow: "hidden",
                background: "white",
                boxShadow:
                  "0 2px 8px rgba(0,0,0,0.08)",
              }}
            >
              {/* Order Header */}
              <div
                style={{
                  padding: "20px",
                  background: "#f5f7fa",
                  borderBottom: "1px solid #ddd",
                  display: "flex",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "15px",
                }}
              >
                <div>
                  <h3
                    style={{
                      margin: "0 0 8px 0",
                    }}
                  >
                    Order #{order.order_id}
                  </h3>

                  <p
                    style={{
                      margin: "4px 0",
                      color: "#666",
                    }}
                  >
                    Ordered on:{" "}
                    {formatDate(order.order_date)}
                  </p>
                </div>

                <div
                  style={{
                    textAlign: "right",
                  }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      background: "#d4edda",
                      color: "#155724",
                      padding: "6px 12px",
                      borderRadius: "20px",
                      fontWeight: "600",
                      fontSize: "14px",
                    }}
                  >
                    {order.status}
                  </span>

                  <p
                    style={{
                      margin: "10px 0 0",
                      fontWeight: "bold",
                      fontSize: "18px",
                    }}
                  >
                    ₹ {Number(order.order_total).toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Products */}
              <div
                style={{
                  padding: "20px",
                }}
              >
                {order.products.map((product, index) => (
                  <div
                    key={`${order.order_id}-${product.product_id}-${index}`}
                    style={{
                      display: "flex",
                      gap: "20px",
                      padding: "18px 0",
                      borderBottom:
                        index !== order.products.length - 1
                          ? "1px solid #eee"
                          : "none",
                      alignItems: "center",
                    }}
                  >
                    {/* Product Image */}
                    <img
                      src={
                        product.image_url ||
                        "https://via.placeholder.com/120"
                      }
                      alt={product.name}
                      style={{
                        width: "110px",
                        height: "110px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        border: "1px solid #ddd",
                      }}
                    />

                    {/* Product Information */}
                    <div
                      style={{
                        flex: 1,
                      }}
                    >
                      <h3
                        style={{
                          margin: "0 0 8px",
                        }}
                      >
                        {product.name}
                      </h3>

                      <p
                        style={{
                          margin: "5px 0",
                          color: "#666",
                        }}
                      >
                        {product.description}
                      </p>

                      <p
                        style={{
                          margin: "8px 0 0",
                        }}
                      >
                        <strong>Quantity:</strong>{" "}
                        {product.quantity}
                      </p>

                      <p
                        style={{
                          margin: "5px 0 0",
                        }}
                      >
                        <strong>Price per unit:</strong>{" "}
                        ₹{" "}
                        {Number(
                          product.price_per_unit
                        ).toFixed(2)}
                      </p>
                    </div>

                    {/* Product Total */}
                    <div
                      style={{
                        textAlign: "right",
                        minWidth: "120px",
                      }}
                    >
                      <p
                        style={{
                          margin: 0,
                          fontSize: "18px",
                          fontWeight: "bold",
                        }}
                      >
                        ₹{" "}
                        {Number(
                          product.total_price
                        ).toFixed(2)}
                      </p>

                      <p
                        style={{
                          margin: "5px 0 0",
                          color: "#777",
                          fontSize: "13px",
                        }}
                      >
                        Product Total
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Footer */}
              <div
                style={{
                  padding: "15px 20px",
                  background: "#fafafa",
                  borderTop: "1px solid #eee",
                  textAlign: "right",
                }}
              >
                <strong>
                  Order Total: ₹{" "}
                  {Number(order.order_total).toFixed(2)}
                </strong>
              </div>
            </div>
          ))}
      </div>

      <Footer />
    </>
  );
}