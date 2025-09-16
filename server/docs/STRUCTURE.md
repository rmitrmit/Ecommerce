# Server Structure Documentation

## 📁 Project Structure

```
server/
├── src/
│   ├── app.js                 # Express app configuration
│   ├── server.js              # Server startup and initialization
│   ├── config/
│   │   ├── database.js        # MongoDB connection configuration
│   │   ├── env.js            # Environment variables configuration
│   │   └── index.js          # Config exports
│   ├── controllers/           # Request handlers
│   │   ├── AuthController.js
│   │   ├── CartController.js
│   │   ├── HubController.js
│   │   ├── OrderController.js
│   │   └── ProductController.js
│   ├── middleware/            # Custom middleware
│   │   ├── auth.js
│   │   ├── upload.js
│   │   └── validation.js
│   ├── models/               # Database models
│   │   ├── DistributionHub.js
│   │   ├── Order.js
│   │   ├── Product.js
│   │   └── User.js
│   ├── routes/               # API routes
│   │   ├── auth.js
│   │   ├── cart.js
│   │   ├── hubs.js
│   │   ├── orders.js
│   │   └── products.js
│   ├── services/             # Business logic layer
│   │   ├── authService.js
│   │   └── productService.js
│   ├── utils/                # Utility functions
│   │   └── seedData.js
│   ├── constants/            # Application constants
│   │   └── index.js
│   └── seed.js              # Database seeding
├── tests/                   # Test files
├── docs/                    # Documentation
├── scripts/                 # Build and deployment scripts
├── uploads/                 # File uploads directory
├── .env                     # Environment variables
├── package.json
└── README.md
```

## 🏗️ Architecture Overview

### 1. **Separation of Concerns**

- **Controllers**: Handle HTTP requests and responses
- **Services**: Contain business logic
- **Models**: Define data structure and database operations
- **Routes**: Define API endpoints
- **Middleware**: Handle cross-cutting concerns

### 2. **Configuration Management**

- **env.js**: Centralized environment configuration
- **database.js**: Database connection setup
- **constants/index.js**: Application constants

### 3. **Service Layer Pattern**

- Business logic is separated from controllers
- Services can be easily tested and reused
- Clear separation between data access and business rules

## 📋 Key Features

### Configuration

- ✅ Centralized environment configuration
- ✅ Type-safe configuration objects
- ✅ Environment validation
- ✅ Default values for all settings

### Error Handling

- ✅ Global error handler
- ✅ Custom error messages
- ✅ Proper HTTP status codes
- ✅ Development vs production error details

### Security

- ✅ Helmet for security headers
- ✅ CORS configuration
- ✅ Rate limiting
- ✅ Input validation
- ✅ JWT authentication

### Database

- ✅ MongoDB connection with Mongoose
- ✅ Connection event handling
- ✅ Proper error handling
- ✅ Environment-based configuration

### Logging

- ✅ Morgan for HTTP request logging
- ✅ Console logging with emojis
- ✅ Error logging
- ✅ Development-friendly output

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Create a `.env` file in the server directory:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=3001
NODE_ENV=development
# ... other environment variables
```

### 3. Start Development Server

```bash
npm run dev
```

### 4. Start Production Server

```bash
npm start
```

## 📚 API Documentation

### Health Check

- **GET** `/api/health` - Server health status

### Authentication

- **POST** `/api/auth/register` - User registration
- **POST** `/api/auth/login` - User login
- **POST** `/api/auth/logout` - User logout
- **GET** `/api/auth/profile` - Get user profile

### Products

- **GET** `/api/products` - Get all products
- **GET** `/api/products/:id` - Get product by ID
- **POST** `/api/products` - Create product (Vendor only)
- **PUT** `/api/products/:id` - Update product (Vendor only)
- **DELETE** `/api/products/:id` - Delete product (Vendor only)

### Cart

- **GET** `/api/cart` - Get user cart
- **POST** `/api/cart/add` - Add item to cart
- **PUT** `/api/cart/update` - Update cart item
- **DELETE** `/api/cart/remove` - Remove item from cart
- **DELETE** `/api/cart/clear` - Clear cart

### Orders

- **GET** `/api/orders` - Get user orders
- **POST** `/api/orders` - Create order
- **GET** `/api/orders/:id` - Get order details
- **PUT** `/api/orders/:id/status` - Update order status

### Distribution Hubs

- **GET** `/api/hubs` - Get all hubs
- **GET** `/api/hubs/:id` - Get hub details

## 🔧 Development Guidelines

### 1. **Adding New Features**

1. Create service in `services/` directory
2. Create controller in `controllers/` directory
3. Add routes in `routes/` directory
4. Update constants if needed

### 2. **Error Handling**

- Use constants for error messages
- Throw descriptive errors in services
- Handle errors in controllers
- Use appropriate HTTP status codes

### 3. **Validation**

- Use express-validator for input validation
- Validate in middleware before reaching controllers
- Return clear validation error messages

### 4. **Testing**

- Write unit tests for services
- Write integration tests for API endpoints
- Use Jest for testing framework

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | Required |
| `PORT` | Server port | 3001 |
| `NODE_ENV` | Environment | development |
| `CORS_ORIGIN` | CORS origin | <http://localhost:3000> |
| `JWT_SECRET` | JWT secret key | Required |
| `JWT_EXPIRE` | JWT expiration | 7d |
| `SESSION_SECRET` | Session secret | Required |
| `SESSION_TTL` | Session TTL | 86400000 |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | 900000 |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | 100 |
| `MAX_FILE_SIZE` | Max file upload size | 10485760 |

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check MONGODB_URI in .env file
   - Ensure MongoDB is running
   - Check network connectivity

2. **Port Already in Use**
   - Change PORT in .env file
   - Kill existing process using the port

3. **Environment Variables Not Loading**
   - Ensure .env file is in server directory
   - Check .env file syntax
   - Restart the server

4. **JWT Token Issues**
   - Check JWT_SECRET in .env file
   - Ensure token is not expired
   - Verify token format

## 📞 Support

For issues and questions:

1. Check this documentation
2. Review error logs
3. Check environment configuration
4. Contact development team
