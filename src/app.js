import express from "express";

const app = express();
app.use(express.json());

const products = [
  {
    id: 1,
    name: "Laptop",
    description: "A high performance laptop",
    price: 350000,
    category: "Electronics",
    inStock: true,
  },
  {
    id: 2,
    name: "Phone",
    description: "A smartphone with a good camera",
    price: 180000,
    category: "Electronics",
    inStock: false,
  },
];

const findProductIndex = (id) => products.findIndex((p) => p.id === id);

/* GET ALL PRODUCTS */
app.get("/products", (req, res) => {
  res.status(200).json({
    status: "Success",
    message:
      products.length > 0
        ? "Products fetched successfully"
        : "No products available",
    data: products,
  });
});

/* GET PRODUCT BY ID */
app.get("/products/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = findProductIndex(id);

  if (index === -1) {
    return res.status(404).json({
      status: "Error",
      message: "Product not found",
    });
  }

  res.status(200).json({
    status: "Success",
    message: "Product fetched successfully",
    data: products[index],
  });
});

/* CREATE PRODUCT */
app.post("/products", (req, res) => {
  const { name, description, price, category, inStock } = req.body;

  if (
    !name ||
    !description ||
    price === undefined ||
    !category ||
    inStock === undefined
  ) {
    return res.status(400).json({
      status: "Error",
      message: "All fields are required",
    });
  }

  const newProduct = {
    id: products.length ? products[products.length - 1].id + 1 : 1,
    name,
    description,
    price,
    category,
    inStock,
  };

  products.push(newProduct);

  res.status(201).json({
    status: "Success",
    message: "Product created successfully",
    data: newProduct,
  });
});

/* UPDATE PRODUCT */
app.put("/products/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = findProductIndex(id);

  if (index === -1) {
    return res.status(404).json({
      status: "Error",
      message: "Product not found",
    });
  }

  products[index] = { ...products[index], ...req.body };

  res.status(200).json({
    status: "Success",
    message: "Product updated successfully",
    data: products[index],
  });
});

/* DELETE PRODUCT */
app.delete("/products/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = findProductIndex(id);

  if (index === -1) {
    return res.status(404).json({
      status: "Error",
      message: "Product not found",
    });
  }

  const deletedProduct = products.splice(index, 1)[0];

  res.status(200).json({
    status: "Success",
    message: "Product deleted successfully",
    data: deletedProduct,
  });
});

export default app;
