# Server Architecture Documentation

## 🏗️ Kiến trúc tổng quan

Dự án được xây dựng theo kiến trúc **Layered Architecture** với nguyên tắc **Separation of Concerns** rõ ràng:

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Routes    │  │ Controllers │  │     Middleware      │  │
│  │             │  │             │  │                     │  │
│  │ - auth.js   │  │ AuthCtrl    │  │ - auth.js           │  │
│  │ - products  │  │ ProductCtrl │  │ - validation.js     │  │
│  │ - orders    │  │ OrderCtrl   │  │ - upload.js         │  │
│  │ - cart      │  │ CartCtrl    │  │                     │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                    BUSINESS LAYER                          │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │                    Services                            │  │
│  │                                                         │  │
│  │ - authService.js    (Authentication logic)             │  │
│  │ - userService.js    (User management)                  │  │
│  │ - productService.js (Product operations)               │  │
│  │ - orderService.js   (Order processing)                 │  │
│  │ - cartService.js    (Cart management)                  │  │
│  └─────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                     DATA LAYER                             │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │                    Models                              │  │
│  │                                                         │  │
│  │ - User.js          (User schema & validation)          │  │
│  │ - Product.js       (Product schema & validation)       │  │
│  │ - Order.js         (Order schema & validation)         │  │
│  │ - DistributionHub  (Hub schema & validation)           │  │
│  └─────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## 📋 Nguyên tắc thiết kế

### 1. **Model Layer (Data Layer)**

**Chỉ chứa:**

- ✅ Schema definition
- ✅ Validation rules
- ✅ Virtual fields
- ✅ Indexes
- ✅ Pre/post hooks cơ bản

**KHÔNG chứa:**

- ❌ Business logic phức tạp
- ❌ API calls
- ❌ Authentication logic
- ❌ Complex calculations

**Ví dụ Model chuẩn:**

```javascript
// ✅ ĐÚNG - Chỉ schema và validation
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 8,
        maxlength: 15
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
    }
});

// Virtual field
userSchema.virtual('fullName').get(function() {
    return this.name || this.businessName || this.username;
});

// ❌ SAI - Không nên có business logic trong Model
userSchema.methods.hashPassword = async function() {
    // Business logic này nên ở Service
};
```

### 2. **Service Layer (Business Layer)**

**Chứa:**

- ✅ Business logic
- ✅ Data processing
- ✅ Complex calculations
- ✅ External API calls
- ✅ Database operations phức tạp
- ✅ Validation logic

**Ví dụ Service chuẩn:**

```javascript
// ✅ ĐÚNG - Business logic trong Service
class UserService {
    async createUser(userData) {
        // Validate password strength
        authService.validatePassword(userData.password);
        
        // Hash password
        const hashedPassword = await authService.hashPassword(userData.password);
        
        // Create user
        const user = new User({
            ...userData,
            password: hashedPassword
        });
        
        return await user.save();
    }
    
    async verifyCredentials(email, password) {
        const user = await User.findOne({ email });
        if (!user) throw new Error('User not found');
        
        const isValid = await authService.comparePassword(password, user.password);
        if (!isValid) throw new Error('Invalid credentials');
        
        return user;
    }
}
```

### 3. **Controller Layer (Presentation Layer)**

**Chứa:**

- ✅ HTTP request/response handling
- ✅ Input validation
- ✅ Error handling
- ✅ Response formatting
- ✅ Authentication checks

**Ví dụ Controller chuẩn:**

```javascript
// ✅ ĐÚNG - Controller chỉ xử lý HTTP
class AuthController {
    async login(req, res) {
        try {
            const { email, password } = req.body;
            
            // Validate input
            if (!email || !password) {
                return res.status(400).json({
                    error: 'Email and password are required'
                });
            }
            
            // Call service
            const user = await userService.verifyCredentials(email, password);
            const token = authService.generateToken({ userId: user._id });
            
            // Return response
            res.json({
                success: true,
                token,
                user: {
                    id: user._id,
                    email: user.email,
                    role: user.role
                }
            });
        } catch (error) {
            res.status(401).json({
                error: error.message
            });
        }
    }
}
```

## 🔄 Luồng xử lý request

```
1. Request → Routes
2. Routes → Middleware (auth, validation)
3. Middleware → Controller
4. Controller → Service
5. Service → Model
6. Model → Database
7. Database → Model
8. Model → Service
9. Service → Controller
10. Controller → Response
```

## 📁 Cấu trúc thư mục chi tiết

```
src/
├── app.js                 # Express app configuration
├── server.js              # Server startup
├── config/                # Configuration files
│   ├── database.js        # Database connection
│   ├── env.js            # Environment variables
│   └── index.js          # Config exports
├── controllers/           # HTTP request handlers
│   ├── AuthController.js
│   ├── ProductController.js
│   ├── OrderController.js
│   └── CartController.js
├── services/              # Business logic layer
│   ├── authService.js
│   ├── userService.js
│   ├── productService.js
│   ├── orderService.js
│   └── cartService.js
├── models/                # Database schemas
│   ├── User.js
│   ├── Product.js
│   ├── Order.js
│   └── DistributionHub.js
├── middleware/            # Custom middleware
│   ├── auth.js
│   ├── validation.js
│   └── upload.js
├── routes/                # API routes
│   ├── auth.js
│   ├── products.js
│   ├── orders.js
│   └── cart.js
├── constants/             # Application constants
│   └── index.js
└── utils/                 # Utility functions
    └── seedData.js
```

## 🎯 Lợi ích của kiến trúc này

### 1. **Separation of Concerns**

- Mỗi layer có trách nhiệm riêng biệt
- Dễ maintain và debug
- Code dễ đọc và hiểu

### 2. **Testability**

- Service layer dễ test unit
- Controller layer dễ test integration
- Model layer đơn giản, ít bug

### 3. **Scalability**

- Dễ thêm tính năng mới
- Dễ thay đổi business logic
- Dễ thay đổi database

### 4. **Reusability**

- Service có thể được sử dụng ở nhiều nơi
- Logic tách biệt khỏi HTTP layer
- Dễ tạo API khác (GraphQL, gRPC)

## 📝 Quy tắc coding

### 1. **Model Rules**

```javascript
// ✅ DO
- Chỉ định nghĩa schema
- Validation rules
- Virtual fields
- Indexes
- Pre/post hooks đơn giản

// ❌ DON'T
- Business logic phức tạp
- API calls
- Authentication logic
- Complex calculations
```

### 2. **Service Rules**

```javascript
// ✅ DO
- Business logic
- Data processing
- Complex calculations
- External integrations
- Error handling

// ❌ DON'T
- HTTP request/response
- Express-specific code
- Direct database queries (dùng Model)
```

### 3. **Controller Rules**

```javascript
// ✅ DO
- HTTP handling
- Input validation
- Response formatting
- Error responses
- Authentication checks

// ❌ DON'T
- Business logic
- Database operations trực tiếp
- Complex calculations
```

## 🔧 Best Practices

### 1. **Error Handling**

```javascript
// Service layer
try {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    return user;
} catch (error) {
    throw new Error(`Error fetching user: ${error.message}`);
}

// Controller layer
try {
    const user = await userService.getUserById(req.params.id);
    res.json({ success: true, data: user });
} catch (error) {
    res.status(404).json({ error: error.message });
}
```

### 2. **Validation**

```javascript
// Model validation
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
    }
});

// Service validation
async createUser(userData) {
    if (!userData.email) {
        throw new Error('Email is required');
    }
    // ... business logic
}
```

### 3. **Constants Usage**

```javascript
// constants/index.js
export const USER_ROLES = {
    CUSTOMER: 'customer',
    VENDOR: 'vendor',
    SHIPPER: 'shipper'
};

// Service
import { USER_ROLES } from '../constants/index.js';

if (user.role !== USER_ROLES.ADMIN) {
    throw new Error('Access denied');
}
```

## 🚀 Kết luận

Kiến trúc này đảm bảo:

- **Code sạch và dễ maintain**
- **Dễ test và debug**
- **Scalable và flexible**
- **Tuân thủ best practices**
- **Separation of concerns rõ ràng**

Mỗi layer có trách nhiệm riêng biệt, giúp code dễ đọc, dễ hiểu và dễ phát triển.
