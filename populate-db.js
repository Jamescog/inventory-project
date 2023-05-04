const fs = require("fs");
try {
  let data = fs.readFileSync("products.json", "utf-8");
  products = JSON.parse(data);

  products.forEach(async (product) => {
    product.addedBy = "644153ad5a76aec9b91674eb";
    try {
      const response = await fetch("http://localhost:3001/api/products", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.text();
      console.log(data);
    } catch (err) {
      console.log(err.message);
    }
  });
} catch (err) {
  console.log(JSON.parse(err.message));
}
