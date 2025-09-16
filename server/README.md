 * RMIT University Vietnam
 * Course: COSC2769 - Full Stack Development
 * Semester: 2025B
 * Assessment: Assignment 02
 * Author: Do Van Tung, Thieu Gia Huy, Nguyen Phi Long
 * ID: 4053400, 3975542, 3988413

# E-commerce Backend API

Backend API for the e-commerce application using Node.js, Express.js, and MongoDB Atlas.

## 🚀 Technologies used

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB Atlas** - Cloud database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-session** - Session management
- **multer** - File upload
- **express-validator** - Input validation
- **helmet** - Security headers
- **cors** - Cross-origin resource sharing
- **express-rate-limit** - Rate limiting

## 📁 Folder Structure

```
server/
├── src/
│   ├── config/
│   │   └── database.js          # MongoDB connection configuration
│   ├── controllers/
│   │   ├── AuthController.js    # Authentication handling
│   │   ├── ProductController.js # Product handling
│   │   ├── CartController.js    # Cart handling
│   │   ├── OrderController.js   # Order handling
│   │   └── HubController.js     # Distribution hubs handling
│   ├── middleware/
│   │   ├── auth.js              # Authentication middleware
│   │   ├── validation.js        # Validation middleware
│   │   └── upload.js            # File upload middleware
│   ├── models/
│   │   ├── User.js              # User model
│   │   ├── Product.js           # Product model
│   │   ├── Order.js             # Order model
│   │   └── DistributionHub.js   # Distribution hub model
│   ├── routes/
│   │   ├── auth.js              # Authentication routes
│   │   ├── products.js          # Product routes
│   │   ├── cart.js              # Cart routes
│   │   ├── orders.js            # Order routes
│   │   └── hubs.js              # Distribution hubs routes
│   ├── utils/
│   │   └── seedData.js          # Sample data
│   ├── server.js                # Main server file
│   └── seed.js                  # Data seeding script
├── uploads/                     # Folder for uploaded files
├── package.json
├── env.example                  # Sample environment configuration file
└── README.md
```

## 🛠️ Installation

1. **Clone the repository and move into the server directory:**

   ```bash
   cd server
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure environment variables:**

   ```bash
   cp env.example .env
   ```

   Chỉnh sửa file `.env` với thông tin MongoDB Atlas của bạn:

   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-jwt-key-here
   SESSION_SECRET=your-super-secret-session-key-here
   ```

4. **Run the server:**

   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 📊 Database Schema

### Users Collection

```javascript
{
  username: String (unique, 8-15 characters),
  password: String (hashed),
  profilePicture: String,
  userType: String (vendor/customer/shipper),
  // For vendor only
  businessName: String (unique),
  businessAddress: String (unique),
  // For customer only
  name: String,
  address: String,
  // For shipper only
  assignedHub: ObjectId (reference to DistributionHub),
  isActive: Boolean,
  createdAt: Date
}
```

### Products Collection

```javascript
{
  name: String (10-20 characters),
  price: Number (positive),
  image: String,
  description: String (maximum 500 characters),
  vendorId: ObjectId (reference to User),
  createdAt: Date
}
```

### Distribution Hubs Collection

```javascript
{
  name: String (unique),
  address: String,
  createdAt: Date
}
```

### Orders Collection

```javascript
{
  customerId: ObjectId (reference to User),
  products: Array of {productId, quantity, price},
  totalAmount: Number,
  customerAddress: String,
  assignedHub: ObjectId (reference to DistributionHub),
  status: String (active/delivered/canceled),
  createdAt: Date,
  updatedAt: Date
}
```

## 🔗 API Endpoints

### Authentication

- `POST /api/auth/register/customer` - Register customer
- `POST /api/auth/register/vendor` - Register vendor
- `POST /api/auth/register/shipper` - Register shipper
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/profile` - Get user information
- `PUT /api/auth/profile/picture` - Update profile picture

### Products

  - `GET /api/products` - Get list of products
  - `GET /api/products/:id` - Get product details
  - `GET /api/products/vendor/products` - Get vendor's products
  - `POST /api/products/vendor/products` - Add new product
  - `PUT /api/products/vendor/products/:id` - Update product
  - `DELETE /api/products/vendor/products/:id` - Delete product

### Cart

  - `POST /api/cart/add` - Add to cart
  - `DELETE /api/cart/remove/:productId` - Remove from cart
  - `GET /api/cart` - Get cart items

### Orders

  - `POST /api/orders` - Create an order
  - `GET /api/orders/shipper/orders` - Get shipper's orders
  - `PUT /api/orders/:id/status` - Update order status
  - `GET /api/orders` - Get all orders

### Distribution Hubs

  - `GET /api/hubs` - Get list of hubs
  - `POST /api/hubs` - Create new hub
  - `PUT /api/hubs/:id` - Update hub
  - `DELETE /api/hubs/:id` - Delete hub

-----

## 🔒 Security Features

  - **Password Encryption** - Use bcryptjs
  - **JWT Authentication** - Token-based authentication
  - **Session Management** - MongoDB session store
  - **Input Validation** - Server-side validation
  - **Rate Limiting** - Limit number of requests
  - **CORS** - Cross-origin resource sharing
  - **Helmet** - Security headers
  - **Secure File Upload** - Allow image files only

-----

## 🚀 Scripts

```bash
npm start          # Run production server
npm run dev        # Run development server with nodemon
npm run seed       # Seed sample data
npm test           # Run tests
```

-----

## 📝 Environment Variables

| Variable | Description | Default |
|---|---|---|
| `MONGODB_URI` | MongoDB Atlas connection string | - |
| `PORT` | Server port | 3001 |
| `NODE_ENV` | Environment | development |
| `JWT_SECRET` | JWT secret key | - |
| `SESSION_SECRET` | Session secret key | - |
| `CORS_ORIGIN` | CORS origin | [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | 900000 |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | 100 |
| `UPLOAD_PATH` | Upload directory | ./uploads |
| `MAX_FILE_SIZE` | Max file size | 5242880 |

-----

## 🧪 Testing

```bash
npm test
```

-----

## 📄 License

MIT
