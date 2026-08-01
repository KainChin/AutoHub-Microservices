-- Database Initialization Script for Car_Dealership
CREATE DATABASE Car_Dealership;
GO

USE Car_Dealership;
GO

-- 1. Customer Table
CREATE TABLE Customer (
    custID DECIMAL(18,0) PRIMARY KEY,
    custName NVARCHAR(255) NOT NULL,
    phone DECIMAL(18,0),
    sex CHAR(10),
    cusAddress NVARCHAR(255)
);

-- 2. Cars Table
CREATE TABLE Cars (
    carID DECIMAL(18,0) PRIMARY KEY,
    serialNumber NVARCHAR(100),
    model NVARCHAR(100) NOT NULL,
    colour NVARCHAR(50),
    year INT,
    Status NVARCHAR(50) NOT NULL DEFAULT 'Active'
);

-- 3. SalesPerson Table
CREATE TABLE SalesPerson (
    salesID DECIMAL(18,0) PRIMARY KEY,
    salesName NVARCHAR(255) NOT NULL,
    birthday DATE,
    sex CHAR(10),
    salesAddress NVARCHAR(255)
);

-- 4. SalesInvoice Table
CREATE TABLE SalesInvoice (
    invoiceID INT PRIMARY KEY IDENTITY(1,1),
    invoiceDate DATE DEFAULT GETDATE(),
    salesID DECIMAL(18,0) FOREIGN KEY REFERENCES SalesPerson(salesID),
    carID DECIMAL(18,0) FOREIGN KEY REFERENCES Cars(carID),
    custID DECIMAL(18,0) FOREIGN KEY REFERENCES Customer(custID),
    price INT
);

-- 5. Mechanic Table
CREATE TABLE Mechanic (
    mechanicID DECIMAL(18,0) PRIMARY KEY,
    mechanicName NVARCHAR(255) NOT NULL
);

-- 6. Service Table
CREATE TABLE Service (
    serviceID INT PRIMARY KEY,
    serviceName NVARCHAR(255) NOT NULL,
    hourlyRate MONEY,
    Status NVARCHAR(50) NOT NULL DEFAULT 'Active'
);

-- 7. ServiceTicket Table
CREATE TABLE ServiceTicket (
    serviceTicketID INT PRIMARY KEY IDENTITY(1,1),
    dateReceived DATE DEFAULT GETDATE(),
    dateReturned DATE,
    custID DECIMAL(18,0) FOREIGN KEY REFERENCES Customer(custID),
    carID DECIMAL(18,0) FOREIGN KEY REFERENCES Cars(carID)
);

-- 8. ServiceMehanic Table
CREATE TABLE ServiceMehanic (
    serviceTicketID INT FOREIGN KEY REFERENCES ServiceTicket(serviceTicketID),
    serviceID INT FOREIGN KEY REFERENCES Service(serviceID),
    mechanicID DECIMAL(18,0) FOREIGN KEY REFERENCES Mechanic(mechanicID),
    hours INT,
    comment NVARCHAR(MAX),
    rate MONEY,
    PRIMARY KEY (serviceTicketID, serviceID, mechanicID)
);

-- 9. Parts Table
CREATE TABLE Parts (
    partID DECIMAL(18,0) PRIMARY KEY,
    partName NVARCHAR(255) NOT NULL,
    purchasePrice MONEY,
    retailPrice MONEY,
    Status NVARCHAR(50) NOT NULL DEFAULT 'Active'
);

-- 10. PartsUsed Table
CREATE TABLE PartsUsed (
    serviceTicketID INT FOREIGN KEY REFERENCES ServiceTicket(serviceTicketID),
    partID DECIMAL(18,0) FOREIGN KEY REFERENCES Parts(partID),
    numberUsed INT,
    price MONEY,
    PRIMARY KEY (serviceTicketID, partID)
);
GO

-- Initial Seed Data
INSERT INTO Customer (custID, custName, phone, sex, cusAddress) VALUES
(101, N'Nguyen Van A', 0901234567, 'M', N'123 Le Loi, District 1, HCMC'),
(102, N'Tran Thi B', 0918765432, 'F', N'456 Nguyen Hue, District 1, HCMC'),
(103, N'Pham Van C', 0988112233, 'M', N'789 Tran Hung Dao, District 5, HCMC');

INSERT INTO Cars (carID, serialNumber, model, colour, year, Status) VALUES
(201, 'VIN-TOY-001', N'Toyota Camry 2.5Q', N'Black', 2023, 'Available'),
(202, 'VIN-HON-002', N'Honda CR-V L', N'White', 2024, 'Available'),
(203, 'VIN-BMW-003', N'BMW 330i M Sport', N'Blue', 2023, 'Sold'),
(204, 'VIN-MER-004', N'Mercedes C300 AMG', N'Red', 2024, 'InService');

INSERT INTO SalesPerson (salesID, salesName, birthday, sex, salesAddress) VALUES
(301, N'Le Hoang Nam', '1992-05-15', 'M', N'12 Nguyen Thi Minh Khai, HCMC'),
(302, N'Vo Thi Mai', '1995-11-20', 'F', N'88 Vo Van Tan, District 3, HCMC');

SET IDENTITY_INSERT SalesInvoice ON;
INSERT INTO SalesInvoice (invoiceID, invoiceDate, salesID, carID, custID, price) VALUES
(1, '2024-01-10', 301, 203, 101, 1850000000);
SET IDENTITY_INSERT SalesInvoice OFF;

INSERT INTO Mechanic (mechanicID, mechanicName) VALUES
(401, N'Dang Van Minh (Senior Tech)'),
(402, N'Bui Quoc Tuan (Electrical Spec)');

INSERT INTO Service (serviceID, serviceName, hourlyRate, Status) VALUES
(1, N'Bao duong dinh ky 10,000 km', 250000.00, 'Active'),
(2, N'Thay dau dong co & loc dau', 150000.00, 'Active'),
(3, N'Kiem tra he thong phanh', 200000.00, 'Active');

SET IDENTITY_INSERT ServiceTicket ON;
INSERT INTO ServiceTicket (serviceTicketID, dateReceived, dateReturned, custID, carID) VALUES
(1001, '2024-02-01', '2024-02-02', 102, 204);
SET IDENTITY_INSERT ServiceTicket OFF;

INSERT INTO ServiceMehanic (serviceTicketID, serviceID, mechanicID, hours, comment, rate) VALUES
(1001, 1, 401, 2, N'Hoan thanh bao duong', 500000.00);

INSERT INTO Parts (partID, partName, purchasePrice, retailPrice, Status) VALUES
(501, N'Dau dong co Synthetic 5W-30 (4L)', 350000.00, 500000.00, 'Active'),
(502, N'Loc dau Honda/Toyota', 120000.00, 180000.00, 'Active'),
(503, N'Ma phanh truoc Brembo', 1200000.00, 1600000.00, 'Active');

INSERT INTO PartsUsed (serviceTicketID, partID, numberUsed, price) VALUES
(1001, 501, 1, 500000.00),
(1001, 502, 1, 180000.00);
GO
