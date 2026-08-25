import { useEffect, useState } from "react";

import Header from "./Header";
import Footer from "./Footer";
import CategoryNavigation from "./CategoryNavigation";
import ProductList from "./ProductList";

export default function CustomerHomePage() {

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([
    {
      categoryId: 1,
      categoryName: "Kurtas"
    },
    {
      categoryId: 2,
      categoryName: "Kurta Sets"
    },
    {
      categoryId: 3,
      categoryName: "Kurtis"
    },
    {
      categoryId: 4,
      categoryName: "Anarkali"
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [loading, setLoading] = useState(true);


  // =========================================================
  // LOAD PRODUCTS WHEN CATEGORY CHANGES
  // =========================================================

  useEffect(() => {
    loadProducts();
  }, [selectedCategory]);


  // =========================================================
  // LOAD PRODUCTS
  // =========================================================

  const loadProducts = async () => {

    try {

      setLoading(true);

      let url = "http://localhost:9090/api/products";


      // ALL PRODUCTS
      if (selectedCategory === "ALL") {

        url = "http://localhost:9090/api/products";

      }

      // CATEGORY PRODUCTS
      else {

        const selectedCategoryObject =
          categories.find(
            (category) =>
              category.categoryName === selectedCategory
          );

        if (!selectedCategoryObject) {

          console.error(
            "Category not found:",
            selectedCategory
          );

          setProducts([]);
          return;
        }

        const categoryId =
          selectedCategoryObject.categoryId;

        url =
          `http://localhost:9090/api/products/category/${categoryId}`;
      }


      console.log(
        "Fetching products from:",
        url
      );


      const response = await fetch(
        url,
        {
          method: "GET",
          credentials: "include"
        }
      );


      console.log(
        "Product status:",
        response.status
      );


      if (!response.ok) {

        throw new Error(
          "HTTP Error: " + response.status
        );
      }


      const data =
        await response.json();


      console.log(
        "Product API response:",
        data
      );


      // Backend returns:
      //
      // {
      //    products: [...]
      // }
      //
      setProducts(
        data.products || []
      );


    } catch (error) {

      console.error(
        "Product error:",
        error
      );

      setProducts([]);


    } finally {

      setLoading(false);
    }
  };


  // =========================================================
  // CATEGORY CHANGE
  // =========================================================

  const handleCategoryChange =
    (category) => {

      console.log(
        "Selected category:",
        category
      );

      setSelectedCategory(category);
    };


  // =========================================================
  // RENDER
  // =========================================================

  return (
    <>
      <Header />

      <div>

        {/* =================================================
            PAGE TITLE
        ================================================= */}

        <div
          style={{
            textAlign: "center",
            marginTop: "36px",
            marginBottom: "4px",
          }}
        >

          <h1
            style={{
              fontSize: "32px",
              fontWeight: "700",
              color: "#1a1d21",
              margin: 0,
              letterSpacing: "-0.5px",
            }}
          >
            Our Products
          </h1>


          <p
            style={{
              color: "#7a828c",
              fontSize: "15px",
              marginTop: "8px",
            }}
          >
            Browse by category or explore everything we have
          </p>

        </div>


        {/* =================================================
            CATEGORY NAVIGATION
        ================================================= */}

        <CategoryNavigation
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={handleCategoryChange}
        />


        {/* =================================================
            PRODUCTS
        ================================================= */}

        {loading ? (

          <h2
            style={{
              textAlign: "center"
            }}
          >
            Loading products...
          </h2>

        ) : (

          <ProductList
            products={products}
          />

        )}

      </div>


      <Footer />
    </>
  );
}