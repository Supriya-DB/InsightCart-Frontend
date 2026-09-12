import { useEffect, useState } from "react";
import "./AdminDashboard.css";

const API = "http://localhost:9090";

function AdminDashboard() {
  const [username, setUsername] = useState("admin");

  const [overall, setOverall] = useState(null);
  const [monthly, setMonthly] = useState(null);
  const [yearly, setYearly] = useState(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showDeleteProduct, setShowDeleteProduct] = useState(false);
  const [showModifyUser, setShowModifyUser] = useState(false);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [showMonthly, setShowMonthly] = useState(false);
  const [showDaily, setShowDaily] = useState(false);
  const [showYearly, setShowYearly] = useState(false);
  const [showOverall, setShowOverall] = useState(false);

  const [userDetails, setUserDetails] = useState(null);
  const [businessResult, setBusinessResult] = useState(null);

  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
    imageUrl: "",
  });

  const [deleteProductId, setDeleteProductId] = useState("");

  const [user, setUser] = useState({
    userId: "",
    username: "",
    email: "",
    role: "CUSTOMER",
  });

  const [userId, setUserId] = useState("");

  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  /* =========================
     AUTH HEADER
  ========================= */

  const getHeaders = () => {
    const token =
      localStorage.getItem("jwtToken") ||
      localStorage.getItem("token") ||
      localStorage.getItem("jwt");

    const headers = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  };

  /* =========================
     GENERIC API
  ========================= */

  const apiRequest = async (url, options = {}) => {
    const response = await fetch(`${API}${url}`, {
      credentials: "include",
      ...options,
      headers: {
        ...getHeaders(),
        ...(options.headers || {}),
      },
    });

    let data = null;

    try {
      data = await response.json();
    } catch {
      data = null;
    }

    if (!response.ok) {
      throw new Error(
        data?.message ||
          data?.error ||
          data ||
          `Request failed with status ${response.status}`
      );
    }

    return data;
  };

  /* =========================
     LOAD DASHBOARD
  ========================= */

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const [overallData, monthlyData, yearlyData] =
        await Promise.all([
          apiRequest("/admin/business/overall"),
          apiRequest(
            `/admin/business/monthly?month=${month}&year=${year}`
          ),
          apiRequest(`/admin/business/yearly?year=${year}`),
        ]);

      setOverall(overallData);
      setMonthly(monthlyData);
      setYearly(yearlyData);
    } catch (err) {
      console.error("Dashboard error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");

    if (storedUsername) {
      setUsername(storedUsername);
    }

    loadDashboard();
  }, []);

  /* =========================
     ADD PRODUCT
  ========================= */

  const handleAddProduct = async (e) => {
    e.preventDefault();

    try {
      setMessage("");
      setError("");

      const data = await apiRequest("/admin/products/add", {
        method: "POST",
        body: JSON.stringify({
          name: product.name,
          description: product.description,
          price: Number(product.price),
          stock: Number(product.stock),
          categoryId: Number(product.categoryId),
          imageUrl: product.imageUrl,
        }),
      });

      console.log("Product added:", data);

      setMessage("Product added successfully.");

      setProduct({
        name: "",
        description: "",
        price: "",
        stock: "",
        categoryId: "",
        imageUrl: "",
      });

      setShowAddProduct(false);
    } catch (err) {
      setError(err.message);
    }
  };

  /* =========================
     DELETE PRODUCT
  ========================= */

  const handleDeleteProduct = async (e) => {
    e.preventDefault();

    try {
      setMessage("");
      setError("");

      await apiRequest("/admin/products/delete", {
        method: "DELETE",
        body: JSON.stringify({
          productId: Number(deleteProductId),
        }),
      });

      setMessage("Product deleted successfully.");

      setDeleteProductId("");
      setShowDeleteProduct(false);
    } catch (err) {
      setError(err.message);
    }
  };

  /* =========================
     MODIFY USER
  ========================= */

  const handleModifyUser = async (e) => {
    e.preventDefault();

    try {
      setMessage("");
      setError("");

      const data = await apiRequest("/admin/user/modify", {
        method: "PUT",
        body: JSON.stringify({
          userId: Number(user.userId),
          username: user.username,
          email: user.email,
          role: user.role,
        }),
      });

      console.log("User modified:", data);

      setMessage("User modified successfully.");
      setShowModifyUser(false);
    } catch (err) {
      setError(err.message);
    }
  };

  /* =========================
     GET USER
  ========================= */

  const handleGetUser = async (e) => {
    e.preventDefault();

    try {
      setMessage("");
      setError("");

      const data = await apiRequest(
        `/admin/user/getbyid?userId=${Number(userId)}`
      );

      setUserDetails(data);
      setShowUserDetails(true);
    } catch (err) {
      setError(err.message);
    }
  };

  /* =========================
     MONTHLY BUSINESS
  ========================= */

  const handleMonthlyBusiness = async (e) => {
    e.preventDefault();

    try {
      setMessage("");
      setError("");

      const data = await apiRequest(
        `/admin/business/monthly?month=${Number(
          month
        )}&year=${Number(year)}`
      );

      setBusinessResult(data);
      setShowMonthly(true);
    } catch (err) {
      setError(err.message);
    }
  };

  /* =========================
     DAILY BUSINESS
  ========================= */

  const handleDailyBusiness = async (e) => {
    e.preventDefault();

    try {
      setMessage("");
      setError("");

      const data = await apiRequest(
        `/admin/business/daily?date=${date}`
      );

      setBusinessResult(data);
      setShowDaily(true);
    } catch (err) {
      setError(err.message);
    }
  };

  /* =========================
     YEARLY BUSINESS
  ========================= */

  const handleYearlyBusiness = async (e) => {
    e.preventDefault();

    try {
      setMessage("");
      setError("");

      const data = await apiRequest(
        `/admin/business/yearly?year=${Number(year)}`
      );

      setBusinessResult(data);
      setShowYearly(true);
    } catch (err) {
      setError(err.message);
    }
  };

  /* =========================
     OVERALL BUSINESS
  ========================= */

  const handleOverallBusiness = async () => {
    try {
      setMessage("");
      setError("");

      const data = await apiRequest("/admin/business/overall");

      setBusinessResult(data);
      setShowOverall(true);
    } catch (err) {
      setError(err.message);
    }
  };

  /* =========================
     LOGOUT
  ========================= */

  const logout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("token");
    localStorage.removeItem("jwt");

    window.location.href = "/";
  };

  const totalRevenue =
    overall?.totalBusiness ??
    overall?.totalRevenue ??
    0;

  const monthlyRevenue =
    monthly?.totalRevenue ?? 0;

  const yearlyRevenue =
    yearly?.totalRevenue ?? 0;

  const categorySales =
    overall?.categorySales || {};

  return (
    <div className="admin-layout">

      {/* ================= HEADER ================= */}

      <header className="admin-header">

        <div className="admin-logo">
          <strong>INSIGHTCART</strong>
          <span>Administration Panel</span>
        </div>

        <div className="admin-user">

          <span>👤 {username}</span>

          <button onClick={logout}>
            Logout
          </button>

        </div>

      </header>

      {/* ================= SIDEBAR ================= */}

      <aside className="admin-sidebar">

        <h3>MAIN MENU</h3>

        <button className="active">
          📊 Dashboard
        </button>

        <button onClick={() => setShowAddProduct(true)}>
          📦 Products
        </button>

        <button onClick={() => setShowDeleteProduct(true)}>
          🗑️ Delete Product
        </button>

        <button onClick={() => setShowModifyUser(true)}>
          👥 Users
        </button>

        <button onClick={() => setShowUserDetails(true)}>
          🔎 User Details
        </button>

        <h3>SYSTEM</h3>

        <button onClick={() => setShowMonthly(true)}>
          📅 Monthly Business
        </button>

        <button onClick={() => setShowDaily(true)}>
          📆 Daily Business
        </button>

        <button onClick={() => setShowYearly(true)}>
          📈 Yearly Business
        </button>

        <button onClick={handleOverallBusiness}>
          💰 Overall Business
        </button>

      </aside>

      {/* ================= MAIN ================= */}

      <main className="admin-main">

        <div className="dashboard-heading">

          <div>
            <h1>Dashboard</h1>
            <p>Manage your InsightCart administration.</p>
          </div>

          <div className="dashboard-date">
            {new Date().toLocaleDateString("en-IN")}
          </div>

        </div>

        {message && (
          <div className="success-message">
            ✓ {message}
          </div>
        )}

        {error && (
          <div className="error-message">
            ⚠ {error}
          </div>
        )}

        {/* ================= STAT CARDS ================= */}

        <section className="stat-grid">

          <div className="stat-card">
            <span>Total Sales</span>
            <strong>
              ₹{Number(totalRevenue).toLocaleString("en-IN", {
                minimumFractionDigits: 2,
              })}
            </strong>
            <small>Overall successful business</small>
          </div>

          <div className="stat-card">
            <span>Total Business</span>
            <strong>
              ₹{Number(totalRevenue).toLocaleString("en-IN", {
                minimumFractionDigits: 2,
              })}
            </strong>
            <small>All successful orders</small>
          </div>

          <div className="stat-card">
            <span>This Month</span>
            <strong>
              ₹{Number(monthlyRevenue).toLocaleString("en-IN", {
                minimumFractionDigits: 2,
              })}
            </strong>
            <small>
              {month}/{year}
            </small>
          </div>

        </section>

        {/* ================= ANALYTICS ================= */}

        <section className="dashboard-grid">

          <div className="dashboard-card revenue-card">

            <div className="card-heading">
              <h2>Revenue Analytics</h2>
              <button onClick={loadDashboard}>
                ↻ Refresh
              </button>
            </div>

            <div className="revenue-number">
              ₹
              {Number(totalRevenue).toLocaleString("en-IN", {
                minimumFractionDigits: 2,
              })}
            </div>

            <div className="revenue-bar">
              <div className="revenue-fill"></div>
            </div>

            <div className="revenue-footer">
              <span>Overall Revenue</span>
              <span>100%</span>
            </div>

          </div>

          {/* ================= CATEGORIES ================= */}

          <div className="dashboard-card">

            <div className="card-heading">
              <h2>Top Categories</h2>
            </div>

            {Object.keys(categorySales).length === 0 ? (
              <p className="empty-text">
                No category data available.
              </p>
            ) : (
              Object.entries(categorySales)
                .sort((a, b) => b[1] - a[1])
                .map(([category, value]) => {

                  const max =
                    Math.max(...Object.values(categorySales));

                  const percentage =
                    max > 0 ? (value / max) * 100 : 0;

                  return (
                    <div
                      className="category-row"
                      key={category}
                    >

                      <div className="category-title">
                        <span>{category}</span>
                        <strong>{value}</strong>
                      </div>

                      <div className="category-bar">
                        <div
                          style={{
                            width: `${percentage}%`,
                          }}
                        ></div>
                      </div>

                    </div>
                  );
                })
            )}

          </div>

        </section>

        {/* ================= REVENUE CARDS ================= */}

        <section className="dashboard-grid two">

          <div className="dashboard-card">

            <h2>Monthly Revenue</h2>

            <div className="big-number">
              ₹
              {Number(monthlyRevenue).toLocaleString("en-IN", {
                minimumFractionDigits: 2,
              })}
            </div>

            <p>
              Current month: {month}/{year}
            </p>

          </div>

          <div className="dashboard-card">

            <h2>Yearly Revenue</h2>

            <div className="big-number">
              ₹
              {Number(yearlyRevenue).toLocaleString("en-IN", {
                minimumFractionDigits: 2,
              })}
            </div>

            <p>Year: {year}</p>

          </div>

        </section>

        {/* ================= ADMIN FUNCTIONS ================= */}

        <div className="section-title">

          <h2>Administration Functions</h2>

          <p>
            Manage products, users and business analytics.
          </p>

        </div>

        <section className="function-grid">

          <FunctionCard
            title="Add Product"
            description="Create and manage new product listings with validation."
            team="Product Management"
            icon="➕"
            onClick={() => setShowAddProduct(true)}
          />

          <FunctionCard
            title="Delete Product"
            description="Remove products from inventory system."
            team="Product Management"
            icon="🗑️"
            onClick={() => setShowDeleteProduct(true)}
          />

          <FunctionCard
            title="Modify User"
            description="Update user details and manage roles."
            team="User Management"
            icon="✏️"
            onClick={() => setShowModifyUser(true)}
          />

          <FunctionCard
            title="View User Details"
            description="Fetch and display details of a specific user."
            team="User Management"
            icon="👤"
            onClick={() => setShowUserDetails(true)}
          />

          <FunctionCard
            title="Monthly Business"
            description="View revenue metrics for a specific month."
            team="Analytics"
            icon="📅"
            onClick={() => setShowMonthly(true)}
          />

          <FunctionCard
            title="Day Business"
            description="Track daily revenue and transactions."
            team="Analytics"
            icon="📆"
            onClick={() => setShowDaily(true)}
          />

          <FunctionCard
            title="Yearly Business"
            description="Analyze annual revenue performance."
            team="Analytics"
            icon="📈"
            onClick={() => setShowYearly(true)}
          />

          <FunctionCard
            title="Overall Business"
            description="View total revenue since inception."
            team="Analytics"
            icon="💰"
            onClick={handleOverallBusiness}
          />

        </section>

      </main>

      {/* ==================================================
          ADD PRODUCT MODAL
      ================================================== */}

      {showAddProduct && (
        <Modal
          title="Add Product"
          close={() => setShowAddProduct(false)}
        >

          <form
            className="admin-form"
            onSubmit={handleAddProduct}
          >

            <input
              placeholder="Product Name"
              value={product.name}
              onChange={(e) =>
                setProduct({
                  ...product,
                  name: e.target.value,
                })
              }
              required
            />

            <textarea
              placeholder="Description"
              value={product.description}
              onChange={(e) =>
                setProduct({
                  ...product,
                  description: e.target.value,
                })
              }
              required
            />

            <input
              type="number"
              placeholder="Price"
              value={product.price}
              onChange={(e) =>
                setProduct({
                  ...product,
                  price: e.target.value,
                })
              }
              required
            />

            <input
              type="number"
              placeholder="Stock"
              value={product.stock}
              onChange={(e) =>
                setProduct({
                  ...product,
                  stock: e.target.value,
                })
              }
              required
            />

            <input
              type="number"
              placeholder="Category ID"
              value={product.categoryId}
              onChange={(e) =>
                setProduct({
                  ...product,
                  categoryId: e.target.value,
                })
              }
              required
            />

            <input
              placeholder="Image URL"
              value={product.imageUrl}
              onChange={(e) =>
                setProduct({
                  ...product,
                  imageUrl: e.target.value,
                })
              }
              required
            />

            <button className="primary-btn">
              Add Product
            </button>

          </form>

        </Modal>
      )}

      {/* ==================================================
          DELETE PRODUCT
      ================================================== */}

      {showDeleteProduct && (
        <Modal
          title="Delete Product"
          close={() => setShowDeleteProduct(false)}
        >

          <form
            className="admin-form"
            onSubmit={handleDeleteProduct}
          >

            <input
              type="number"
              placeholder="Product ID"
              value={deleteProductId}
              onChange={(e) =>
                setDeleteProductId(e.target.value)
              }
              required
            />

            <button className="danger-btn">
              Delete Product
            </button>

          </form>

        </Modal>
      )}

      {/* ==================================================
          MODIFY USER
      ================================================== */}

      {showModifyUser && (
        <Modal
          title="Modify User"
          close={() => setShowModifyUser(false)}
        >

          <form
            className="admin-form"
            onSubmit={handleModifyUser}
          >

            <input
              type="number"
              placeholder="User ID"
              value={user.userId}
              onChange={(e) =>
                setUser({
                  ...user,
                  userId: e.target.value,
                })
              }
              required
            />

            <input
              placeholder="Username"
              value={user.username}
              onChange={(e) =>
                setUser({
                  ...user,
                  username: e.target.value,
                })
              }
            />

            <input
              type="email"
              placeholder="Email"
              value={user.email}
              onChange={(e) =>
                setUser({
                  ...user,
                  email: e.target.value,
                })
              }
            />

            <select
              value={user.role}
              onChange={(e) =>
                setUser({
                  ...user,
                  role: e.target.value,
                })
              }
            >

              <option value="CUSTOMER">
                CUSTOMER
              </option>

              <option value="ADMIN">
                ADMIN
              </option>

            </select>

            <button className="primary-btn">
              Modify User
            </button>

          </form>

        </Modal>
      )}

      {/* ==================================================
          USER DETAILS
      ================================================== */}

      {showUserDetails && (
        <Modal
          title="View User Details"
          close={() => setShowUserDetails(false)}
        >

          {!userDetails ? (
            <form
              className="admin-form"
              onSubmit={handleGetUser}
            >

              <input
                type="number"
                placeholder="Enter User ID"
                value={userId}
                onChange={(e) =>
                  setUserId(e.target.value)
                }
                required
              />

              <button className="primary-btn">
                Get User
              </button>

            </form>
          ) : (
            <div className="user-details">

              <p>
                <strong>User ID:</strong>{" "}
                {userDetails.userId}
              </p>

              <p>
                <strong>Username:</strong>{" "}
                {userDetails.username}
              </p>

              <p>
                <strong>Email:</strong>{" "}
                {userDetails.email}
              </p>

              <p>
                <strong>Role:</strong>{" "}
                {userDetails.role}
              </p>

              <button
                className="secondary-btn"
                onClick={() => setUserDetails(null)}
              >
                Search Another User
              </button>

            </div>
          )}

        </Modal>
      )}

      {/* ==================================================
          MONTHLY BUSINESS
      ================================================== */}

      {showMonthly && (
        <Modal
          title="Monthly Business"
          close={() => {
            setShowMonthly(false);
            setBusinessResult(null);
          }}
        >

          {!businessResult ? (
            <form
              className="admin-form"
              onSubmit={handleMonthlyBusiness}
            >

              <input
                type="number"
                min="1"
                max="12"
                placeholder="Month"
                value={month}
                onChange={(e) =>
                  setMonth(e.target.value)
                }
                required
              />

              <input
                type="number"
                placeholder="Year"
                value={year}
                onChange={(e) =>
                  setYear(e.target.value)
                }
                required
              />

              <button className="primary-btn">
                Get Monthly Business
              </button>

            </form>
          ) : (
            <BusinessResult
              title="Monthly Business"
              data={businessResult}
            />
          )}

        </Modal>
      )}

      {/* ==================================================
          DAILY BUSINESS
      ================================================== */}

      {showDaily && (
        <Modal
          title="Daily Business"
          close={() => {
            setShowDaily(false);
            setBusinessResult(null);
          }}
        >

          {!businessResult ? (
            <form
              className="admin-form"
              onSubmit={handleDailyBusiness}
            >

              <input
                type="date"
                value={date}
                onChange={(e) =>
                  setDate(e.target.value)
                }
                required
              />

              <button className="primary-btn">
                Get Daily Business
              </button>

            </form>
          ) : (
            <BusinessResult
              title="Daily Business"
              data={businessResult}
            />
          )}

        </Modal>
      )}

      {/* ==================================================
          YEARLY BUSINESS
      ================================================== */}

      {showYearly && (
        <Modal
          title="Yearly Business"
          close={() => {
            setShowYearly(false);
            setBusinessResult(null);
          }}
        >

          {!businessResult ? (
            <form
              className="admin-form"
              onSubmit={handleYearlyBusiness}
            >

              <input
                type="number"
                placeholder="Year"
                value={year}
                onChange={(e) =>
                  setYear(e.target.value)
                }
                required
              />

              <button className="primary-btn">
                Get Yearly Business
              </button>

            </form>
          ) : (
            <BusinessResult
              title="Yearly Business"
              data={businessResult}
            />
          )}

        </Modal>
      )}

      {/* ==================================================
          OVERALL BUSINESS
      ================================================== */}

      {showOverall && (
        <Modal
          title="Overall Business"
          close={() => {
            setShowOverall(false);
            setBusinessResult(null);
          }}
        >

          {businessResult && (
            <BusinessResult
              title="Overall Business"
              data={businessResult}
            />
          )}

        </Modal>
      )}

    </div>
  );
}


/* ======================================================
   FUNCTION CARD
====================================================== */

function FunctionCard({
  title,
  description,
  team,
  icon,
  onClick,
}) {
  return (
    <button
      className="function-card"
      onClick={onClick}
    >

      <div className="function-icon">
        {icon}
      </div>

      <h3>{title}</h3>

      <p>{description}</p>

      <small>
        Team: <i>{team}</i>
      </small>

    </button>
  );
}


/* ======================================================
   MODAL
====================================================== */

function Modal({ title, close, children }) {
  return (
    <div className="modal-overlay">

      <div className="modal">

        <div className="modal-header">

          <h2>{title}</h2>

          <button
            className="close-btn"
            onClick={close}
          >
            ×
          </button>

        </div>

        <div className="modal-body">
          {children}
        </div>

      </div>

    </div>
  );
}


/* ======================================================
   BUSINESS RESULT
====================================================== */

function BusinessResult({ title, data }) {
  return (
    <div className="business-result">

      <h3>{title}</h3>

      {data?.totalRevenue !== undefined && (
        <div className="result-number">
          ₹
          {Number(data.totalRevenue).toLocaleString(
            "en-IN",
            {
              minimumFractionDigits: 2,
            }
          )}
        </div>
      )}

      {data?.totalBusiness !== undefined && (
        <div className="result-number">
          ₹
          {Number(data.totalBusiness).toLocaleString(
            "en-IN",
            {
              minimumFractionDigits: 2,
            }
          )}
        </div>
      )}

      {data?.categorySales && (
        <div className="result-categories">

          <h4>Category Sales</h4>

          {Object.entries(data.categorySales).map(
            ([category, value]) => (
              <div
                className="result-category"
                key={category}
              >

                <span>{category}</span>

                <strong>{value}</strong>

              </div>
            )
          )}

        </div>
      )}

      <details>
        <summary>View API Response</summary>

        <pre>
          {JSON.stringify(data, null, 2)}
        </pre>

      </details>

    </div>
  );
}

export default AdminDashboard;