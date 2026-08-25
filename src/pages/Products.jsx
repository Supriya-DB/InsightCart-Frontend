import { useEffect, useState } from "react";
import axios from "axios";
import ProductList from "../ProductList";

function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:9090/api/products", {
        withCredentials: true,
      })
      .then((response) => {
        console.log("FULL RESPONSE:", response.data);
        console.log("PRODUCTS:", response.data.products);

        setProducts(response.data.products || []);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>Our Products</h1>

      <ProductList products={products} />
    </div>
  );
}

export default Products;