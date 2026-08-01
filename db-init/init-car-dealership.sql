-- SQL Script to Populate Car_Dealership database with 16 popular Vietnamese showroom cars
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'Car_Dealership')
BEGIN
    CREATE DATABASE Car_Dealership;
END
GO

USE Car_Dealership;
GO

-- Table: Cars
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Cars')
BEGIN
    CREATE TABLE Cars (
        carID DECIMAL(18,0) PRIMARY KEY,
        serialNumber NVARCHAR(100),
        model NVARCHAR(150) NOT NULL,
        colour NVARCHAR(50),
        year INT,
        price BIGINT,
        imageUrl NVARCHAR(500),
        Status NVARCHAR(50) DEFAULT 'Available'
    );
END
GO

-- Populate 16 Popular Vehicles in Vietnam
DELETE FROM Cars;
INSERT INTO Cars (carID, serialNumber, model, colour, year, price, imageUrl, Status) VALUES
(201, 'WBA5R1C57KAJ12345', N'BMW 330i M Sport', N'Đen Sapphire', 2022, 1899000000, 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80', 'Available'),
(202, 'MHF8KC3D1N0123456', N'Toyota Fortuner 2.8AT 4x4', N'Trắng Ngọc Trai', 2023, 1245000000, 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80', 'Available'),
(203, 'RMHFC1F32PN123456', N'Honda Civic RS', N'Xám Titan', 2023, 870000000, 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=800&q=80', 'Available'),
(204, 'W1K2050771R123456', N'Mercedes-Benz C 200 AMG', N'Đen Obsidian', 2021, 1599000000, 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80', 'Available'),
(205, 'JTJZAMCA2N2001234', N'Lexus RX 350 Luxury', N'Bạc Sonic', 2022, 2950000000, 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80', 'Available'),
(206, 'RUMKEF976PV123456', N'Mazda CX-5 2.5 Premium', N'Đỏ Pha Lê', 2023, 889000000, 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80', 'Available'),
(207, 'VF8P2024VN001007', N'VinFast VF 8 Plus EV', N'Đỏ Crimson', 2024, 1270000000, 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=800&q=80', 'Available'),
(208, 'VF9E2024VN002008', N'VinFast VF 9 Eco EV', N'Xanh VinFast', 2024, 1491000000, 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=800&q=80', 'Available'),
(209, 'VFE342023VN003009', N'VinFast VF e34', N'Trắng Neptune', 2023, 710000000, 'https://images.unsplash.com/photo-1541348263662-e068662d82af?auto=format&fit=crop&w=800&q=80', 'Available'),
(210, 'HYUTUC2023VN004010', N'Hyundai Tucson 2.0 Special', N'Đen Nam Cực', 2023, 959000000, 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80', 'Available'),
(211, 'HYUSAN2024VN005011', N'Hyundai Santa Fe 2.2 Diesel', N'Trắng Ngọc Trai', 2024, 1269000000, 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=800&q=80', 'Available'),
(212, 'KIASEL2023VN006012', N'Kia Seltos 1.4 Turbo Premium', N'Cam Bạc', 2023, 719000000, 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80', 'Available'),
(213, 'KIACAR2024VN007013', N'Kia Carnival 2.2D Signature', N'Đen Kim Cương', 2024, 1469000000, 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80', 'Available'),
(214, 'FOREVE2024VN008014', N'Ford Everest Titanium+ 4x4', N'Nâu Đồng', 2024, 1468000000, 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80', 'Available'),
(215, 'MITXPA2023VN009015', N'Mitsubishi Xpander Cross', N'Cam Đen', 2023, 698000000, 'https://images.unsplash.com/photo-1541348263662-e068662d82af?auto=format&fit=crop&w=800&q=80', 'Available'),
(216, 'TOYCRO2023VN010016', N'Toyota Corolla Cross 1.8V', N'Đỏ Pha Lê', 2023, 860000000, 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80', 'Available');
GO
