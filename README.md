 * RMIT University Vietnam
 * Course: COSC2769 - Full Stack Development
 * Semester: 2025B
 * Assessment: Assignment 02
 * Author: Do Van Tung, Thieu Gia Huy, Nguyen Phi Long
 * ID: 4053400, 3975542, 3988413
 * Demo recording link: https://rmiteduau-my.sharepoint.com/:v:/g/personal/s4053400_rmit_edu_vn/EcAT5eslIm5ArLZdf5iiyfABbabxufQ5uNPUUauqAuESAw?nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJPbmVEcml2ZUZvckJ1c2luZXNzIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXciLCJyZWZlcnJhbFZpZXciOiJNeUZpbGVzTGlua0NvcHkifX0&e=2XiLVR
 * Demo recording link extra: https://rmiteduau-my.sharepoint.com/:v:/g/personal/s4053400_rmit_edu_vn/EVkBHfI8iFBFivjKRyc2dT8BRrF2WaTMTrMyid3s7rawLw?nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJPbmVEcml2ZUZvckJ1c2luZXNzIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXciLCJyZWZlcnJhbFZpZXciOiJNeUZpbGVzTGlua0NvcHkifX0&e=kxgQhY
 * Github link: 
 * Contributions: Do Van Tung - 33% / Thieu Gia Huy - 33% / Nguyen Phi Long - 33%

# E-commerce Platform

A complete e-commerce platform with a React frontend and Node.js backend.

## Key Features

### 👥 User Management

  - **Customer**: Register, log in, manage account
  - **Vendor**: Manage products, orders, statistics
  - **Shipper**: Manage orders, update delivery status

### 🛍️ Product Management

  - Add, edit, delete products
  - Upload product images
  - Categorize products
  - Inventory management

### 🛒 Cart & Orders

  - Add products to cart
  - Checkout and create orders
  - Track order status
  - Distribute orders to hubs

### 🏢 Distribution Hub Management

  - Create and manage distribution hubs
  - Assign orders randomly to hubs
  - Track orders by hub

-----

## 🛠️ Technologies Used

### Frontend (Client)

  - **React 18** - UI framework
  - **Redux Toolkit** - State management
  - **React Router** - Routing
  - **Bootstrap** - CSS framework
  - **Axios** - HTTP client

### Backend (Server)

  - **Node.js** - Runtime environment
  - **Express.js** - Web framework
  - **MongoDB** - Database
  - **Mongoose** - ODM
  - **Multer** - File upload
  - **Express-session** - Session management

-----

## 📁 Project Structure

```
Ecommerce/
├── client/                 # React frontend
│   ├── public/            # Static files
│   ├── src/               # Source code
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom hooks
│   │   ├── store/         # Redux store
│   │   ├── utils/         # Utility functions
│   │   └── contexts/      # React contexts
│   └── package.json
├── server/                # Node.js backend
│   ├── src/               # Source code
│   │   ├── controllers/   # Route controllers
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   ├── middleware/    # Custom middleware
│   │   └── utils/         # Utility functions
│   ├── uploads/           # Uploaded files
│   └── package.json
└── .gitignore            # Git ignore rules
```

-----

## 🚀 Installation and Running

### System Requirements

  - Node.js \>= 16.0.0
  - MongoDB \>= 4.0
  - npm or yarn

### Installation

1.  **Clone repository**

<!-- end list -->

```bash
git clone <repository-url>
cd Ecommerce
```

2.  **Install dependencies for client**

<!-- end list -->

```bash
cd client
npm install
```

3.  **Install dependencies for server**

<!-- end list -->

```bash
cd ../server
npm install
```

4.  **Configure environment**

<!-- end list -->

```bash
# Create .env file in the server directory
cp .env.example .env
# Edit necessary environment variables
```

5.  **Run the application**

**Terminal 1 - Server:**

```bash
cd server
npm run dev
```

**Terminal 2 - Client:**

```bash
cd client
npm start
```

6.  **Login credentials**
    For Customer
  - Username: fullstackCust
  - Password: Test@1234
    For Vendor
  - Username: fullstackVendor
  - Password: Test@1234
    For Shipper
  - Username: fullstackCust
  - Password: Test@1234
-----

## 🔧 Available Scripts

### Client

  - `npm start` - Run development server
  - `npm run build` - Build for production
  - `npm test` - Run tests
  - `npm run eject` - Eject CRA

### Server

  - `npm run dev` - Run development server with nodemon
  - `npm start` - Run production server
  - `npm run seed` - Seed database with sample data

-----

## 📊 API Endpoints

### Authentication

  - `POST /api/auth/register/customer` - Register customer
  - `POST /api/auth/register/vendor` - Register vendor
  - `POST /api/auth/register/shipper` - Register shipper
  - `POST /api/auth/login` - Log in
  - `POST /api/auth/logout` - Log out
  - `GET /api/auth/profile` - Get profile information

### Products

  - `GET /api/products` - Get list of products
  - `GET /api/products/:id` - Get product details
  - `POST /api/products` - Create new product
  - `PUT /api/products/:id` - Update product
  - `DELETE /api/products/:id` - Delete product

### Cart & Orders

  - `GET /api/cart` - Get cart
  - `POST /api/cart/add` - Add product to cart
  - `POST /api/orders` - Create an order
  - `GET /api/orders/shipper` - Get shipper's orders
  - `PUT /api/orders/:id/status` - Update order status

### Hubs

  - `GET /api/hubs` - Get list of hubs
  - `POST /api/hubs` - Create new hub
  - `PUT /api/hubs/:id` - Update hub
  - `DELETE /api/hubs/:id` - Delete hub

-----

## 🔐 Security

  - Session-based authentication
  - Password hashing with bcrypt
  - File upload validation
  - CORS configuration
  - Input validation and sanitization

-----

## 📝 Notes

  - The database will be automatically seeded with sample data on server startup
  - Uploaded files are stored in `server/uploads/`
  - Sessions are stored in MongoDB
  - CORS is configured to allow the client to run on port 3000

-----

## 🤝 Contributing

1.  Fork the repository
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

-----


## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.