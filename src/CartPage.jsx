import { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    loadCart();
    loadTotal();
  }, []);

  // ===============================
  // LOAD CART
  // ===============================

  const loadCart = async () => {
    try {
      const response = await fetch(
        `http://localhost:9090/api/cart`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      console.log("Cart status:", response.status);

      if (!response.ok) {
        throw new Error("Failed to load cart");
      }

      const data = await response.json();

      console.log("Cart API response:", data);

      setCartItems(data);
    } catch (error) {
      console.error("Cart error:", error);
      alert("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // LOAD TOTAL
  // ===============================

  const loadTotal = async () => {
    try {
      const response = await fetch(
        `http://localhost:9090/api/cart/total`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      console.log("Total status:", response.status);

      if (!response.ok) {
        throw new Error("Failed to load total");
      }

      const data = await response.json();

      console.log("Total API response:", data);

      setTotal(data.total || 0);
    } catch (error) {
      console.error("Total error:", error);
    }
  };

  // ===============================
  // GET PRODUCT IMAGE
  // ===============================

  const getImage = (item) => {
    const images = item?.product?.images;

    if (!images || images.length === 0 || !images[0]) {
      return null;
    }

    const image = images[0];

    // Already a complete URL
    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    // If backend sends /uploads/image.jpg
    if (image.startsWith("/")) {
      return `http://localhost:9090${image}`;
    }

    // If backend sends only image.jpg
    return `http://localhost:9090/uploads/${image}`;
  };

  // ===============================
  // UPDATE QUANTITY
  // ===============================

  const updateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:9090/api/cart/update/${cartItemId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            quantity: newQuantity,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update quantity");
      }

      await loadCart();
      await loadTotal();

    } catch (error) {
      console.error("Quantity update error:", error);
      alert("Failed to update quantity");
    }
  };

  // ===============================
  // DELETE CART ITEM
  // ===============================

  const deleteCartItem = async (cartItemId) => {
    const confirmDelete = window.confirm(
      "Remove this item from your cart?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:9090/api/cart/delete/${cartItemId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete cart item");
      }

      await loadCart();
      await loadTotal();

    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete item");
    }
  };

  // ===============================
  // RAZORPAY CHECKOUT
  // ===============================

  const handleCheckout = async () => {
    try {
        setPaymentLoading(true);

        // Auth is handled via the httpOnly "authToken" cookie
        // (sent automatically by credentials: "include"),
        // not via localStorage — the backend never issues a
        // token or user object to JS storage.

        // 1. Create Razorpay order from backend
        const response = await fetch(
            "http://localhost:9090/api/payment/create",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    totalAmount: total
                })
            }
        );

        const data = await response.json();

        console.log("Create order response:", data);

        if (response.status === 401) {
            alert("Please login again");
            return;
        }

        if (!response.ok) {
            throw new Error(
                data.error || "Unable to create payment order"
            );
        }

        const razorpayOrderId = data.razorpayOrderId;
        const amount = data.totalAmount;

        if (!razorpayOrderId) {
            throw new Error("Razorpay order ID is missing");
        }

        // 2. Open Razorpay
        const options = {
            key: "rzp_test_TSo3qhEunMsxwm",
            amount: Math.round(amount * 100), // Razorpay expects paise, backend returns rupees
            currency: "INR",
            name: "INSIGHTCART",
            description: "Product Purchase",
            order_id: razorpayOrderId,

            handler: async function (paymentResponse) {

                console.log(
                    "Razorpay payment response:",
                    paymentResponse
                );

                // 3. Verify payment with backend
                const verifyResponse = await fetch(
                    "http://localhost:9090/api/payment/verify",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        credentials: "include",
                        body: JSON.stringify({
                            razorpayOrderId:
                                paymentResponse.razorpay_order_id,

                            razorpayPaymentId:
                                paymentResponse.razorpay_payment_id,

                            razorpaySignature:
                                paymentResponse.razorpay_signature
                        })
                    }
                );

                const verifyData =
                    await verifyResponse.json();

                console.log(
                    "Verification response:",
                    verifyData
                );
if (
    verifyResponse.ok &&
    verifyData.paymentStatus === "SUCCESS"
) {
    alert("Payment successful!");

    // Refresh cart from backend
    await loadCart();
    await loadTotal();

    // Stop payment loading
    setPaymentLoading(false);

    // Optional: go directly to Orders
    // navigate("/orders");

} else {
    console.error(
        "Payment verification failed:",
        verifyData
    );

    alert(
        verifyData.error ||
        "Payment verification failed"
    );

    setPaymentLoading(false);
}
            },

            modal: {
                ondismiss: function () {
                    console.log("Razorpay payment popup closed");
                    setPaymentLoading(false);
                }
            },

            theme: {
                color: "#2f6ea9"
            }
        };

        const razorpay = new window.Razorpay(options);

        razorpay.on(
            "payment.failed",
            function (response) {

                console.error(
                    "Payment failed:",
                    response.error
                );

                alert(
                    "Payment Failed: " +
                    response.error.description
                );

                setPaymentLoading(false);
            }
        );

        razorpay.open();

    } catch (error) {

        console.error("Checkout error:", error);

        alert(
            "Unable to start payment: " +
            error.message
        );

        setPaymentLoading(false);
    }
};

  // ===============================
  // PAGE
  // ===============================

  return (
    <>
      <Header />

      <div
        style={{
          background: "#f3f2ef",
          minHeight: "80vh",
          padding: "45px 6%",
        }}
      >
        {loading ? (
          <h2>Loading your cart...</h2>
        ) : cartItems.length === 0 ? (
          <div
            style={{
              background: "white",
              padding: "50px",
              borderRadius: "15px",
              textAlign: "center",
            }}
          >
            <h1>Your cart is empty</h1>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "minmax(0, 2fr) minmax(350px, 1fr)",
              gap: "30px",
              alignItems: "start",
            }}
          >
            {/* ================= MY BAG ================= */}

            <div
              style={{
                background: "#ffffff",
                borderRadius: "18px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: "30px",
                  borderBottom: "1px solid #ddd",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <h1
                    style={{
                      margin: 0,
                      letterSpacing: "3px",
                    }}
                  >
                    MY BAG
                  </h1>

                  <p
                    style={{
                      marginBottom: 0,
                      color: "#666",
                    }}
                  >
                    Items are reserved for 60 minutes
                  </p>
                </div>

                <span>
                  {cartItems.length} items
                </span>
              </div>

              {/* CART ITEMS */}

              {cartItems.map((item) => {
                const imageUrl = getImage(item);

                return (
                  <div
                    key={item.id}
                    style={{
                      display: "flex",
                      gap: "28px",
                      padding: "30px",
                      borderBottom: "1px solid #ddd",
                      position: "relative",
                    }}
                  >
                    {/* IMAGE */}

                    <div
                      style={{
                        width: "210px",
                        height: "210px",
                        background: "#f1f1f1",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={item.product.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                          }}
                          onError={(e) => {
                            console.error(
                              "Image failed:",
                              imageUrl
                            );

                            e.currentTarget.style.display =
                              "none";
                          }}
                        />
                      ) : (
                        <span>No Image</span>
                      )}
                    </div>

                    {/* PRODUCT DETAILS */}

                    <div
                      style={{
                        flex: 1,
                      }}
                    >
                      <h2
                        style={{
                          marginTop: 0,
                        }}
                      >
                        {item.product.name}
                      </h2>

                      <p
                        style={{
                          color: "#666",
                        }}
                      >
                        {item.product.description}
                      </p>

                      <h3>
                        ₹{" "}
                        {Number(
                          item.product.price
                        ).toFixed(2)}
                      </h3>

                      {/* QUANTITY */}

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "15px",
                          marginTop: "25px",
                        }}
                      >
                        <span>Quantity:</span>

                        <div
                          style={{
                            display: "flex",
                            border: "1px solid #ccc",
                          }}
                        >
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                item.quantity - 1
                              )
                            }
                            disabled={item.quantity <= 1}
                            style={{
                              width: "55px",
                              height: "45px",
                              border: "none",
                              background: "white",
                              cursor:
                                item.quantity <= 1
                                  ? "not-allowed"
                                  : "pointer",
                              fontSize: "20px",
                            }}
                          >
                            −
                          </button>

                          <div
                            style={{
                              width: "55px",
                              height: "45px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              borderLeft:
                                "1px solid #ccc",
                              borderRight:
                                "1px solid #ccc",
                            }}
                          >
                            {item.quantity}
                          </div>

                          <button
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                item.quantity + 1
                              )
                            }
                            style={{
                              width: "55px",
                              height: "45px",
                              border: "none",
                              background: "white",
                              cursor: "pointer",
                              fontSize: "20px",
                            }}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div
                        style={{
                          marginTop: "25px",
                          display: "flex",
                          justifyContent:
                            "space-between",
                          maxWidth: "400px",
                        }}
                      >
                        <span>Subtotal:</span>

                        <strong>
                          ₹{" "}
                          {(
                            Number(item.product.price) *
                            item.quantity
                          ).toFixed(2)}
                        </strong>
                      </div>
                    </div>

                    {/* DELETE */}

                    <button
                      onClick={() =>
                        deleteCartItem(item.id)
                      }
                      style={{
                        position: "absolute",
                        top: "25px",
                        right: "25px",
                        border: "none",
                        background: "transparent",
                        fontSize: "28px",
                        cursor: "pointer",
                        color: "#555",
                      }}
                    >
                      ×
                    </button>
                  </div>
                );
              })}
            </div>

            {/* ================= TOTAL ================= */}

            <div
              style={{
                background: "#ffffff",
                padding: "35px",
                borderRadius: "18px",
                position: "sticky",
                top: "20px",
              }}
            >
              <h1
                style={{
                  marginTop: 0,
                  letterSpacing: "3px",
                }}
              >
                TOTAL
              </h1>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "30px",
                  fontSize: "18px",
                }}
              >
                <span>Sub-total</span>

                <strong>
                  ₹ {Number(total).toFixed(2)}
                </strong>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "20px",
                  fontSize: "18px",
                }}
              >
                <span>Delivery</span>

                <strong
                  style={{
                    color: "#25613a",
                  }}
                >
                  FREE
                </strong>
              </div>

              <hr
                style={{
                  margin: "30px 0",
                  border: "none",
                  borderTop: "1px solid #ddd",
                }}
              />

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "22px",
                }}
              >
                <strong>Total</strong>

                <strong>
                  ₹ {Number(total).toFixed(2)}
                </strong>
              </div>

              <button
                onClick={handleCheckout}
                disabled={paymentLoading}
                style={{
                  width: "100%",
                  marginTop: "30px",
                  padding: "20px",
                  background: paymentLoading
                    ? "#777"
                    : "#25613a",
                  color: "white",
                  border: "none",
                  cursor: paymentLoading
                    ? "not-allowed"
                    : "pointer",
                  fontSize: "22px",
                  fontWeight: "bold",
                }}
              >
                {paymentLoading
                  ? "Processing..."
                  : "Checkout"}
              </button>

              <p
                style={{
                  textAlign: "center",
                  marginTop: "25px",
                  color: "#666",
                }}
              >
                🔒 Secure checkout
              </p>

              <hr
                style={{
                  margin: "30px 0",
                  border: "none",
                  borderTop: "1px solid #ddd",
                }}
              />

              <h4
                style={{
                  letterSpacing: "2px",
                }}
              >
                WE ACCEPT:
              </h4>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                }}
              >
                <span>VISA</span>
                <span>MC</span>
                <span>UPI</span>
                <span>GPay</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}