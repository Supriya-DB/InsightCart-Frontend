import { useEffect, useState } from "react";
import axios from "axios";

function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:9090/api/products", {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response.data);
        setProducts(response.data.products);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  return (
    <div>
      <h1>Products</h1>

      {products.map((product) => (
        <div key={product.product_id}>
          {product.images?.length > 0 && (
            <img
              src={product.images[0]}
              alt={product.name}
              width="200"
            />
          )}

          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <p>₹{product.price}</p>
          <p>Stock: {product.stock}</p>
        </div>
      ))}
    </div>
  );
}

export default Products;