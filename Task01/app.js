const express = require("express");
const path = require("path");
const app = express();
const transactionRoutes = require("./routes/transactionRoutes");

// Cấu hình để phục vụ tệp tĩnh từ thư mục views
app.use(express.static(path.join(__dirname, "views"))); // Thư mục chứa tệp CSS

app.use(express.json());
app.use("/api/transactions", transactionRoutes);

// Khởi động server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Route để render trang chính
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html")); // Render tệp index.html
});
