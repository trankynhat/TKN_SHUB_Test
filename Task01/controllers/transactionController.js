const multer = require("multer");
const path = require("path");
const XLSX = require("xlsx");
const fs = require("fs");
const moment = require("moment");

// Kiểm tra và tạo thư mục uploads nếu chưa tồn tại
const uploadsDir = "./uploads";
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Cấu hình multer để lưu trữ file vào thư mục uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /xlsx/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    if (extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only .xlsx files are allowed!"));
    }
  },
}).single("file");

// Hàm xử lý upload file
const uploadFile = (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    return res
      .status(200)
      .json({ message: "File uploaded successfully", file: req.file.filename });
  });
};

// Hàm xử lý truy vấn dựa trên khoảng thời gian
const queryTransactions = (req, res) => {
  const { start_time, end_time } = req.query;

  // Kiểm tra định dạng thời gian
  if (
    !moment(start_time, "HH:mm", true).isValid() ||
    !moment(end_time, "HH:mm", true).isValid()
  ) {
    return res.status(400).json({ error: "Invalid time format. Use HH:mm." });
  }

  const startTime = moment(start_time, "HH:mm");
  const endTime = moment(end_time, "HH:mm");

  // Lấy file mới nhất trong thư mục uploads
  const files = fs
    .readdirSync("uploads")
    .filter((file) => file.endsWith(".xlsx"));
  if (files.length === 0) {
    return res.status(404).json({ error: "No files found" });
  }

  const latestFile = path.join("uploads", files[files.length - 1]);

  // Đọc dữ liệu từ file Excel
  const workbook = XLSX.readFile(latestFile);
  const sheetName = workbook.SheetNames[0];
  const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
    header: 1,
  });

  // Bỏ qua 5 dòng đầu tiên
  const dataRows = worksheet.slice(5); // Bỏ qua 5 dòng đầu tiên

  // Lọc dữ liệu dựa trên giờ
  const filteredTransactions = dataRows.filter((row) => {
    const transactionTime = moment(row[2], "HH:mm:ss"); // Cột "Giờ" là cột thứ 3 (index 2)
    return transactionTime.isBetween(startTime, endTime, undefined, "[]");
  });

  // Tính tổng "Thành tiền"
  const totalAmount = filteredTransactions.reduce((sum, row) => {
    const amount = parseFloat(row[8]); // Cột "Thành tiền (VND)" là cột thứ 9 (index 8)
    if (isNaN(amount)) {
      console.error(`Invalid amount at row: ${JSON.stringify(row)}`); // Ghi log lỗi
    }
    return sum + (isNaN(amount) ? 0 : amount); // Kiểm tra giá trị NaN
  }, 0);

  // Kiểm tra xem có dữ liệu nào được lọc không
  if (filteredTransactions.length === 0) {
    return res
      .status(404)
      .json({ error: "No transactions found for the specified time range." });
  }

  return res.status(200).json({ total_amount: totalAmount });
};

module.exports = { uploadFile, queryTransactions };
