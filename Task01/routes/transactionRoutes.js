const express = require("express");
const router = express.Router();
const {
  uploadFile,
  queryTransactions,
} = require("../controllers/transactionController"); // Kết hợp import

// Route để upload file
router.post("/upload", uploadFile);

// Route để truy vấn file Excel
router.get("/query", queryTransactions);

module.exports = router; // Đảm bảo chỉ xuất một lần
