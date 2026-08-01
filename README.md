# 🚗 Car Dealership & Garage - Microservices System Architecture with Docker

System Architecture and Containerized Microservices Platform built for the **Car_Dealership** enterprise database.

---

## 📐 System Architecture Overview

This project decomposes the monolithic `Car_Dealership` database into **4 Domain Microservices**, an **API Gateway**, a **Database Container**, and an **Interactive Web Dashboard**.

```
                           +------------------------+
                           |  Web Dashboard (UI)    |
                           |     (Port 8080)        |
                           +-----------+------------+
                                       |
                                       v
                           +------------------------+
                           |      API Gateway       |
                           |     (Port 5000)        |
                           +-----------+------------+
                                       |
       +------------------+------------+------------+------------------+
       |                  |                         |                  |
       v                  v                         v                  v
+--------------+   +--------------+          +--------------+   +--------------+
| Customer Svc |   |  Sales Svc   |          |  Garage Svc  |   |  Parts Svc   |
| (Port 5001)  |   | (Port 5002)  |          | (Port 5003)  |   | (Port 5004)  |
+------+-------+   +------+-------+          +------+-------+   +------+-------+
       |                  |                         |                  |
       +------------------+------------+------------+------------------+
                                       |
                                       v
                           +------------------------+
                           |  SQL Server Container  |
                           |     (Port 1433)        |
                           +------------------------+
```

---

## 🛠️ Microservice Bounded Contexts

| Microservice | Port | Database Domain Tables | Responsibilities |
| :--- | :--- | :--- | :--- |
| **API Gateway** | `5500` | N/A | Reverse proxy, global system health aggregator & route distribution |
| **Customer Service** | `5001` | `Customer` | Customer accounts, profile management, personal information |
| **Sales & Cars Service** | `5002` | `Cars`, `SalesPerson`, `SalesInvoice` | Vehicle inventory, Sales Reps, Car Purchase & Sales Invoices |
| **Garage & Repair Service** | `5003` | `Mechanic`, `Service`, `ServiceTicket`, `ServiceMehanic` | Service appointments, mechanic assignments, labor rates & repair tickets |
| **Parts & Inventory Service** | `5004` | `Parts`, `PartsUsed` | Spare parts catalog, retail/purchase pricing, spare parts consumption |
| **Web Dashboard** | `8088` | N/A | Modern Glassmorphism React UI with live topology health monitoring & CRUD control panel |

---

## 🚀 Quick Start Guide (Docker Compose)

### 1. Build and Launch Containers
Run the following command from the root directory:
```bash
docker compose up --build -d
```

### 2. Service Access Links
- 🌐 **Web Dashboard UI**: [http://localhost:8088](http://localhost:8088)
- 🛡️ **API Gateway Health Check**: [http://localhost:5000/health](http://localhost:5000/health)
- 👤 **Customer Service**: [http://localhost:5000/api/customers](http://localhost:5000/api/customers)
- 🚘 **Sales & Cars Service**: [http://localhost:5000/api/sales/cars](http://localhost:5000/api/sales/cars)
- 🔧 **Garage Service**: [http://localhost:5000/api/garage/tickets](http://localhost:5000/api/garage/tickets)
- ⚙️ **Parts Service**: [http://localhost:5000/api/parts](http://localhost:5000/api/parts)
- 🗄️ **SQL Server Container**: `localhost:1433` (User: `sa`, Pass: `YourStrong@Passw0rd!`)

---

## 🧪 Local Execution (Without Docker)

You can also run any individual microservice locally:

```bash
# Start API Gateway
cd services/api-gateway && npm install && npm start

# Start Customer Service
cd services/customer-service && npm install && npm start

# Start Sales Service
cd services/sales-service && npm install && npm start

# Start Garage Service
cd services/garage-service && npm install && npm start

# Start Parts Service
cd services/parts-service && npm install && npm start
```
