-- SQL Script to Populate Car_Dealership database with 6 luxury showroom cars
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

-- Insert / Update 6 Showroom Cars
DELETE FROM Cars;
INSERT INTO Cars (carID, serialNumber, model, colour, year, price, imageUrl, Status) VALUES
(201, 'WBA5R1C57KAJ12345', N'BMW 330i M Sport', N'Đen Sapphire', 2022, 1899000000, 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80', 'Available'),
(202, 'MHF8KC3D1N0123456', N'Toyota Fortuner 2.8AT 4x4', N'Trắng Ngọc Trai', 2023, 1245000000, 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80', 'Available'),
(203, 'RMHFC1F32PN123456', N'Honda Civic RS', N'Xám Titan', 2023, 870000000, 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=800&q=80', 'Available'),
(204, 'W1K2050771R123456', N'Mercedes-Benz C 200 AMG', N'Đen Obsidian', 2021, 1599000000, 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80', 'Available'),
(205, 'JTJZAMCA2N2001234', N'Lexus RX 350 Luxury', N'Bạc Sonic', 2022, 2950000000, 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80', 'Available'),
(206, 'RUMKEF976PV123456', N'Mazda CX-5 2.5 Premium', N'Đỏ Pha Lê', 2023, 889000000, 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80', 'Available');
GO
