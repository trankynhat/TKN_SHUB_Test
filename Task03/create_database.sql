-- Tạo cơ sở dữ liệu
CREATE DATABASE GasStationDB;
USE GasStationDB;

-- Tạo bảng Station (Trạm xăng)
CREATE TABLE Station (
    station_id INT PRIMARY KEY AUTO_INCREMENT,
    station_name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20)
);

-- Tạo bảng Product (Hàng hoá)
CREATE TABLE Product (
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    product_name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,  -- Trường price lưu giá bán
    unit VARCHAR(20) NOT NULL      -- Đơn vị đo (ví dụ: Lít)
);

-- Tạo bảng Pump (Trụ bơm)
CREATE TABLE Pump (
    pump_id INT PRIMARY KEY AUTO_INCREMENT,
    station_id INT,
    product_id INT,
    pump_number INT NOT NULL,      -- Số thứ tự của trụ bơm tại trạm xăng
    FOREIGN KEY (station_id) REFERENCES Station(station_id),
    FOREIGN KEY (product_id) REFERENCES Product(product_id)
);

-- Tạo bảng Transaction (Giao dịch)
CREATE TABLE Transaction (
    transaction_id INT PRIMARY KEY AUTO_INCREMENT,
    station_id INT,
    pump_id INT,
    product_id INT,
    transaction_date DATETIME NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,    -- Số lượng hàng hoá (tính bằng lít)
    total_amount DECIMAL(15,2) NOT NULL,  -- Tổng số tiền giao dịch
    FOREIGN KEY (station_id) REFERENCES Station(station_id),
    FOREIGN KEY (pump_id) REFERENCES Pump(pump_id),
    FOREIGN KEY (product_id) REFERENCES Product(product_id)
);

-- Cài đặt chỉ mục (index) cho hiệu suất truy vấn
-- Chỉ mục cho bảng Transaction để tối ưu truy vấn theo station_id, pump_id và product_id
CREATE INDEX idx_station_id ON Transaction(station_id);
CREATE INDEX idx_pump_id ON Transaction(pump_id);
CREATE INDEX idx_product_id ON Transaction(product_id);

-- Chỉ mục cho bảng Pump để tối ưu truy vấn theo station_id và product_id
CREATE INDEX idx_pump_station_id ON Pump(station_id);
CREATE INDEX idx_pump_product_id ON Pump(product_id);

-- Thêm dữ liệu mẫu vào bảng Station (Trạm xăng)
INSERT INTO Station (station_name, location, phone_number)
VALUES 
('Trạm xăng A', '123 Đường ABC, Thủ Đức, TP HCM', '0912345678'),
('Trạm xăng B', '456 Đường DEF, Quận 1, TP HCM', '0987654321');

-- Thêm dữ liệu mẫu vào bảng Product (Hàng hoá)
INSERT INTO Product (product_name, price, unit)
VALUES 
('Xăng A95', 22000, 'Lít'),
('Xăng E5', 20000, 'Lít'),
('Dầu DO', 18000, 'Lít');

-- Thêm dữ liệu mẫu vào bảng Pump (Trụ bơm)
INSERT INTO Pump (station_id, product_id, pump_number)
VALUES 
(1, 1, 1),  -- Trụ bơm 1 tại Trạm xăng A bán Xăng A95
(1, 2, 2),  -- Trụ bơm 2 tại Trạm xăng A bán Xăng E5
(2, 3, 1);  -- Trụ bơm 1 tại Trạm xăng B bán Dầu DO

-- Thêm dữ liệu mẫu vào bảng Transaction (Giao dịch)
INSERT INTO Transaction (station_id, pump_id, product_id, transaction_date, quantity, total_amount)
VALUES 
(1, 1, 1, '2024-10-01 08:00:00', 50, 1100000),  -- Giao dịch bán Xăng A95 tại Trạm xăng A, Trụ bơm 1
(1, 2, 2, '2024-10-02 09:00:00', 40, 800000),   -- Giao dịch bán Xăng E5 tại Trạm xăng A, Trụ bơm 2
(2, 1, 3, '2024-10-03 10:00:00', 60, 1080000);  -- Giao dịch bán Dầu DO tại Trạm xăng B, Trụ bơm 1
