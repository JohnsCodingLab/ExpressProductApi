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

app.get("/products", (req, res) => {
  if (products.length > 0) {
    res.status(200).json({
      status: "Success",
      message: "Products Fetched Succesffully",
      data: products,
    });
  } else {
    res.status(200).json({
      status: "Success",
      message: "No products Available",
      data: [],
    });
  }
});

app.get("/products/:id", (req, res) => {
  const id = req.params.id;
  const index = products.findIndex((p) => p.id.toString() === id);
  if (index !== -1) {
    const product = products[index];
    res.status(200).json({
      status: "Success",
      message: "Product fetched successfully",
      data: product,
    });
  } else {
    res.status(404).json({
      status: "Not found",
      message: "Product not found",
      data: [],
    });
  }
});

app.post("/product", (req, res) => {
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
      message:
        "All fields (name, description, price, category, inStock) are required",
    });
  }

  const newId =
    products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;

  const newProduct = {
    id: newId,
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

app.put("/products/:id", (req, res) => {
  const id = req.params.id;
  const { name, description, price, category, inStock } = req.body;

  const product = products.find((p) => p.id.toString() === id);

  if (!product) {
    return res.status(404).json({
      status: "Error",
      message: `No product found with id ${id}`,
    });
  }

  if (name !== undefined) product.name = name;
  if (description !== undefined) product.description = description;
  if (price !== undefined) product.price = price;
  if (category !== undefined) product.category = category;
  if (inStock !== undefined) product.inStock = inStock;

  res.status(200).json({
    status: "Success",
    message: "Product updated successfully",
    data: product,
  });
});

app.delete("/products/:id", (req, res) => {
  const id = req.params.id;
  const index = products.findIndex((p) => p.id.toString() === id);
  if (index !== -1) {
    products.splice(index, 1)[0];
    res.status(200).json({
      status: "Success",
      message: "Product deleted successfully",
    });
  } else {
    res.status(404).json({
      status: "Not found",
      message: "Product not found",
    });
  }
});

export default app;
