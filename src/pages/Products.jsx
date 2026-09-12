import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Products() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [addingProductId, setAddingProductId] =
    useState(null);

  const [message, setMessage] = useState("");

  const username =
    localStorage.getItem("username") || "";

  const categories = [
    "All",
    "Kurtas",
    "Kurta Sets",
    "Kurtis",
    "Anarkali",
  ];


  // =========================================================
  // FETCH PRODUCTS
  // =========================================================

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        "http://localhost:9090/api/products",
        {
          withCredentials: true,
        }
      );

      console.log(
        "PRODUCT RESPONSE:",
        response.data
      );

      const productData =
        Array.isArray(response.data.products)
          ? response.data.products
          : [];

      console.log(
        "PRODUCT ARRAY:",
        productData
      );

      setProducts(productData);

    } catch (err) {

      console.error(
        "Error fetching products:",
        err
      );

      if (err.response?.status === 401) {
        setError(
          "Please login to view products."
        );
      } else {
        setError(
          "Unable to load products. Please try again."
        );
      }

    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchProducts();
  }, []);


  // =========================================================
  // ADD TO CART
  // =========================================================

  const handleAddToCart = async (productId) => {

    try {

      setAddingProductId(productId);
      setMessage("");

      console.log(
        "Adding product to cart:",
        productId
      );

      const response = await axios.post(
        "http://localhost:9090/api/cart/add",
        {
          productId: productId,
          quantity: 1,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(
        "ADD TO CART RESPONSE:",
        response.data
      );

      setMessage(
        "Product added to cart successfully!"
      );

      // Remove message after 2 seconds
      setTimeout(() => {
        setMessage("");
      }, 2000);

    } catch (err) {

      console.error(
        "Add to cart error:",
        err
      );

      if (err.response?.status === 401) {

        setMessage(
          "Please login before adding products to cart."
        );

        setTimeout(() => {
          navigate("/login");
        }, 1500);

      } else if (err.response?.status === 400) {

        setMessage(
          err.response?.data?.error ||
          "Unable to add product to cart."
        );

      } else {

        setMessage(
          "Unable to add product to cart."
        );
      }

    } finally {

      setAddingProductId(null);

    }
  };


  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = () => {

    localStorage.removeItem("username");
    localStorage.removeItem("role");

    navigate("/login");
  };


  // =========================================================
  // CATEGORY
  // =========================================================

  const getCategoryName = (product) => {

    if (
      product.category &&
      product.category.categoryName
    ) {
      return product.category.categoryName;
    }

    if (product.categoryName) {
      return product.categoryName;
    }

    if (
      typeof product.category === "string"
    ) {
      return product.category;
    }

    return "";
  };


  // =========================================================
  // FILTER PRODUCTS
  // =========================================================

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((product) => {

          const category =
            getCategoryName(product)
              .toLowerCase()
              .trim();

          return (
            category ===
            selectedCategory
              .toLowerCase()
              .trim()
          );
        });


  // =========================================================
  // IMAGE
  // =========================================================

  const getImageUrl = (product) => {

    if (product.imageUrl) {
      return product.imageUrl;
    }


    if (
      product.image &&
      product.image.imageUrl
    ) {
      return product.image.imageUrl;
    }


    if (
      Array.isArray(product.images) &&
      product.images.length > 0
    ) {

      const firstImage =
        product.images[0];

      if (
        typeof firstImage === "string"
      ) {
        return firstImage;
      }

      if (
        firstImage &&
        firstImage.imageUrl
      ) {
        return firstImage.imageUrl;
      }
    }


    if (
      Array.isArray(product.productImages) &&
      product.productImages.length > 0
    ) {

      const firstImage =
        product.productImages[0];

      if (
        typeof firstImage === "string"
      ) {
        return firstImage;
      }

      if (
        firstImage &&
        firstImage.imageUrl
      ) {
        return firstImage.imageUrl;
      }
    }


    return "https://via.placeholder.com/400x500?text=No+Image";
  };


  // =========================================================
  // STYLES
  // =========================================================

  const styles = {

    page: {
      minHeight: "100vh",
      background: "#ffffff",
      fontFamily:
        "Arial, Helvetica, sans-serif",
      color: "#111827",
    },


    navbar: {
      height: "76px",
      background: "#1976d2",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 55px",
      color: "#ffffff",
    },


    logo: {
      fontSize: "27px",
      fontWeight: "700",
      letterSpacing: "1px",
    },


    navRight: {
      display: "flex",
      alignItems: "center",
      gap: "26px",
    },


    navLink: {
      color: "#ffffff",
      fontSize: "16px",
      cursor: "pointer",
      textDecoration: "none",
    },


    logoutButton: {
      border: "none",
      background: "#ffffff",
      color: "#333333",
      padding: "11px 20px",
      borderRadius: "3px",
      cursor: "pointer",
      fontSize: "15px",
    },


    headingArea: {
      textAlign: "center",
      padding: "45px 20px 25px",
    },


    heading: {
      fontSize: "38px",
      margin: "0 0 10px",
      fontFamily:
        "Georgia, 'Times New Roman', serif",
    },


    subtitle: {
      color: "#777777",
      fontSize: "17px",
      margin: 0,
    },


    categoryArea: {
      display: "flex",
      justifyContent: "center",
      gap: "14px",
      padding: "20px 20px 30px",
      borderBottom:
        "1px solid #eeeeee",
      flexWrap: "wrap",
    },


    categoryButton: {
      padding: "13px 28px",
      borderRadius: "25px",
      border:
        "1px solid #dddddd",
      background: "#ffffff",
      fontSize: "16px",
      cursor: "pointer",
    },


    activeCategory: {
      background: "#1976d2",
      color: "#ffffff",
      border:
        "1px solid #1976d2",
      boxShadow:
        "0 5px 15px rgba(25,118,210,0.25)",
    },


    message: {
      position: "fixed",
      top: "95px",
      right: "25px",
      zIndex: 1000,
      background: "#25613a",
      color: "#ffffff",
      padding: "14px 22px",
      borderRadius: "6px",
      boxShadow:
        "0 5px 20px rgba(0,0,0,0.2)",
      fontWeight: "600",
    },


    productsGrid: {
      display: "grid",
      gridTemplateColumns:
        "repeat(4, minmax(0, 1fr))",
      gap: "28px",
      padding: "38px 45px",
    },


    productCard: {
      border:
        "1px solid #dddddd",
      borderRadius: "18px",
      overflow: "hidden",
      background: "#ffffff",
      transition: "0.2s",
    },


    imageWrapper: {
      height: "390px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#f5f5f5",
      overflow: "hidden",
    },


    productImage: {
      width: "100%",
      height: "100%",
      objectFit: "contain",
    },


    productInfo: {
      padding: "20px",
    },


    productName: {
      fontSize: "21px",
      margin: "0 0 10px",
      fontFamily:
        "Georgia, 'Times New Roman', serif",
    },


    productDescription: {
      color: "#777777",
      lineHeight: "1.5",
      minHeight: "70px",
      fontSize: "14px",
    },


    productBottom: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: "15px",
    },


    price: {
      color: "#1976d2",
      fontSize: "21px",
      fontWeight: "700",
    },


    stock: {
      color: "#555555",
      fontSize: "14px",
    },


    addButton: {
      width: "100%",
      marginTop: "18px",
      padding: "13px",
      background: "#1976d2",
      color: "#ffffff",
      border: "none",
      borderRadius: "6px",
      fontSize: "16px",
      fontWeight: "600",
      cursor: "pointer",
    },


    disabledButton: {
      background: "#999999",
      cursor: "not-allowed",
    },


    loading: {
      textAlign: "center",
      padding: "60px",
      fontSize: "20px",
      color: "#666666",
    },


    errorBox: {
      textAlign: "center",
      padding: "50px 20px",
      color: "#d32f2f",
      fontSize: "20px",
      fontWeight: "600",
    },


    retryButton: {
      marginTop: "20px",
      padding: "11px 28px",
      border: "none",
      background: "#1976d2",
      color: "#ffffff",
      cursor: "pointer",
      borderRadius: "4px",
      fontSize: "16px",
    },


    noProducts: {
      textAlign: "center",
      padding: "60px",
      color: "#d32f2f",
      fontSize: "20px",
      fontWeight: "600",
    },
  };


  // =========================================================
  // PAGE
  // =========================================================

  return (
    <div style={styles.page}>

      {/* ================= NAVBAR ================= */}

      <header style={styles.navbar}>

        <div style={styles.logo}>
          INSIGHTCART
        </div>


        <div style={styles.navRight}>

          <span
            style={styles.navLink}
            onClick={() =>
              navigate("/home")
            }
          >
            Home
          </span>


          <span
            style={styles.navLink}
            onClick={() =>
              navigate("/cart")
            }
          >
            Cart
          </span>


          <span
            style={styles.navLink}
            onClick={() =>
              navigate("/orders")
            }
          >
            Orders
          </span>


          <span
            style={styles.navLink}
            onClick={() =>
              navigate("/profile")
            }
          >
            Profile
          </span>


          <span style={styles.navLink}>
            Hello, {username || "User"}
          </span>


          <button
            style={styles.logoutButton}
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </header>


      {/* ================= SUCCESS MESSAGE ================= */}

      {message && (
        <div style={styles.message}>
          {message}
        </div>
      )}


      {/* ================= HEADING ================= */}

      <section style={styles.headingArea}>

        <h1 style={styles.heading}>
          Our Products
        </h1>

        <p style={styles.subtitle}>
          Browse by category or explore everything we have
        </p>

      </section>


      {/* ================= CATEGORIES ================= */}

      <div style={styles.categoryArea}>

        {categories.map((category) => {

          const active =
            selectedCategory === category;

          return (
            <button
              key={category}
              style={{
                ...styles.categoryButton,
                ...(active
                  ? styles.activeCategory
                  : {}),
              }}
              onClick={() =>
                setSelectedCategory(category)
              }
            >
              {category}
            </button>
          );

        })}

      </div>


      {/* ================= LOADING ================= */}

      {loading && (
        <div style={styles.loading}>
          Loading products...
        </div>
      )}


      {/* ================= ERROR ================= */}

      {!loading && error && (

        <div style={styles.errorBox}>

          <div>
            {error}
          </div>

          <button
            style={styles.retryButton}
            onClick={fetchProducts}
          >
            Retry
          </button>

        </div>

      )}


      {/* ================= NO PRODUCTS ================= */}

      {!loading &&
        !error &&
        filteredProducts.length === 0 && (

          <div style={styles.noProducts}>
            No products found
          </div>

        )}


      {/* ================= PRODUCTS ================= */}

      {!loading &&
        !error &&
        filteredProducts.length > 0 && (

          <div style={styles.productsGrid}>

            {filteredProducts.map(
              (product) => {

                const productId =
                  product.product_id ||
                  product.productId ||
                  product.id;

                const stock =
                  Number(product.stock || 0);

                const isAdding =
                  addingProductId === productId;

                return (

                  <div
                    key={productId}
                    style={styles.productCard}
                  >

                    {/* IMAGE */}

                    <div
                      style={
                        styles.imageWrapper
                      }
                    >

                      <img
                        src={getImageUrl(
                          product
                        )}
                        alt={
                          product.name ||
                          "Product"
                        }
                        style={
                          styles.productImage
                        }
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://via.placeholder.com/400x500?text=No+Image";
                        }}
                      />

                    </div>


                    {/* INFO */}

                    <div
                      style={styles.productInfo}
                    >

                      <h2
                        style={
                          styles.productName
                        }
                      >
                        {product.name ||
                          "Unnamed Product"}
                      </h2>


                      <p
                        style={
                          styles.productDescription
                        }
                      >
                        {product.description ||
                          "No description available."}
                      </p>


                      <div
                        style={
                          styles.productBottom
                        }
                      >

                        <span
                          style={styles.price}
                        >
                          ₹
                          {Number(
                            product.price || 0
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </span>


                        <span
                          style={styles.stock}
                        >
                          Stock: {stock}
                        </span>

                      </div>


                      {/* ADD TO CART */}

                      <button
                        style={{
                          ...styles.addButton,
                          ...(isAdding ||
                          stock <= 0
                            ? styles.disabledButton
                            : {}),
                        }}
                        disabled={
                          isAdding ||
                          stock <= 0
                        }
                        onClick={() =>
                          handleAddToCart(
                            productId
                          )
                        }
                      >

                        {stock <= 0
                          ? "Out of Stock"
                          : isAdding
                          ? "Adding..."
                          : "Add to Cart"}

                      </button>

                    </div>

                  </div>

                );
              }
            )}

          </div>

        )}

    </div>
  );
}