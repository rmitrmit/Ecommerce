# User Models Architecture

## 🎯 **Vấn đề đã được giải quyết**

Thay vì sử dụng một model User duy nhất cho tất cả các role, chúng ta đã tách riêng thành các model chuyên biệt:

## 🏗️ **Kiến trúc mới**

### **BaseUser (Abstract Model)**

- Chứa các field chung cho tất cả user types
- Sử dụng Mongoose Discriminator Pattern
- Có `discriminatorKey: "role"` để phân biệt các loại user

### **Customer Model**

- Kế thừa từ BaseUser
- Chứa thông tin khách hàng: name, address, preferences
- Có loyalty system: points, level, stats
- Virtual fields: loyaltyLevel, averageOrderValue

### **Vendor Model**

- Kế thừa từ BaseUser
- Chứa thông tin doanh nghiệp: businessName, license, taxCode
- Có verification system và business stats
- Virtual fields: businessLevel, averageOrderValue

### **Shipper Model**

- Kế thừa từ BaseUser
- Chứa thông tin giao hàng: vehicle, location, performance
- Có work status và verification system
- Virtual fields: shipperLevel, successRate

## 📋 **Lợi ích của kiến trúc mới**

### 1. **Single Responsibility Principle**

- Mỗi model có trách nhiệm riêng biệt
- Dễ maintain và extend
- Code rõ ràng và dễ hiểu

### 2. **Performance Optimization**

- Query chỉ lấy data cần thiết
- Index tối ưu cho từng loại user
- Giảm memory usage

### 3. **Type Safety**

- Schema validation chính xác
- Field requirements rõ ràng
- Virtual fields phù hợp với từng role

### 4. **Scalability**

- Dễ thêm tính năng mới cho từng role
- Không ảnh hưởng đến các role khác
- Flexible và extensible

## 🔧 **Cách sử dụng**

### **Import Models**

```javascript
import { Customer, Vendor, Shipper } from "../models/index.js";
```

### **Create User**

```javascript
// Create customer
const customer = new Customer({
    username: "john_doe",
    email: "john@example.com",
    password: "password123",
    name: "John Doe",
    address: "123 Main St",
    role: "customer"
});

// Create vendor
const vendor = new Vendor({
    username: "tech_store",
    email: "store@example.com",
    password: "password123",
    businessName: "Tech Store",
    businessLicense: "BL123456",
    role: "vendor"
});

// Create shipper
const shipper = new Shipper({
    username: "shipper_01",
    email: "shipper@example.com",
    password: "password123",
    name: "Nguyen Van A",
    idCard: "123456789",
    assignedHub: hubId,
    role: "shipper"
});
```

### **Query Users**

```javascript
// Get all customers
const customers = await Customer.find({});

// Get all vendors
const vendors = await Vendor.find({});

// Get all shippers
const shippers = await Shipper.find({});

// Get all users (any role)
const allUsers = await BaseUser.find({});
```

### **Use Services**

```javascript
import { customerService, vendorService, shipperService } from "../services/index.js";

// Create customer
const customer = await customerService.createCustomer(customerData);

// Create vendor
const vendor = await vendorService.createVendor(vendorData);

// Create shipper
const shipper = await shipperService.createShipper(shipperData);

// Get vendor stats
const stats = await vendorService.getVendorStats();
```

## 📊 **Schema Comparison**

### **Old User Model**

```javascript
// ❌ Phức tạp và khó maintain
const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    userType: { enum: ["vendor", "customer", "shipper"] },
    // Conditional fields based on userType
    businessName: { required: function() { return this.userType === "vendor" } },
    name: { required: function() { return this.userType === "customer" } },
    assignedHub: { required: function() { return this.userType === "shipper" } },
    // ... many more conditional fields
});
```

### **New Architecture**

```javascript
// ✅ Rõ ràng và dễ maintain
const baseUserSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    role: String,
    // Common fields only
});

const customerSchema = new mongoose.Schema({
    name: { required: true },
    address: { required: true },
    loyaltyPoints: { default: 0 },
    // Customer-specific fields
});

const vendorSchema = new mongoose.Schema({
    businessName: { required: true },
    businessLicense: { required: true },
    verificationStatus: { type: Object },
    // Vendor-specific fields
});

const shipperSchema = new mongoose.Schema({
    name: { required: true },
    idCard: { required: true },
    assignedHub: { required: true },
    // Shipper-specific fields
});
```

## 🚀 **Migration Strategy**

### **1. Gradual Migration**

- Giữ User model cũ để backward compatibility
- Tạo các model mới song song
- Migrate data dần dần

### **2. Data Migration Script**

```javascript
// Example migration script
async function migrateUsers() {
    const oldUsers = await User.find({});
    
    for (const user of oldUsers) {
        if (user.userType === "customer") {
            await Customer.create({
                ...user.toObject(),
                role: "customer"
            });
        } else if (user.userType === "vendor") {
            await Vendor.create({
                ...user.toObject(),
                role: "vendor"
            });
        } else if (user.userType === "shipper") {
            await Shipper.create({
                ...user.toObject(),
                role: "shipper"
            });
        }
    }
}
```

### **3. Update Services**

- Tạo service mới cho từng role
- Update controllers để sử dụng service mới
- Deprecate old User model

## 📝 **Best Practices**

### **1. Model Design**

- Mỗi model chỉ chứa fields cần thiết
- Sử dụng virtual fields cho computed properties
- Index tối ưu cho queries thường dùng

### **2. Service Layer**

- Tạo service riêng cho từng role
- Business logic tách biệt khỏi model
- Error handling consistent

### **3. Controller Layer**

- Sử dụng service phù hợp với role
- Validation riêng cho từng role
- Response format consistent

## 🔍 **Example Usage**

### **Customer Registration**

```javascript
// Controller
app.post("/api/auth/register/customer", async (req, res) => {
    try {
        const customer = await customerService.createCustomer(req.body);
        res.json({ success: true, customer });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});
```

### **Vendor Verification**

```javascript
// Controller
app.post("/api/vendor/verify/:id", async (req, res) => {
    try {
        const vendor = await vendorService.verifyVendor(req.params.id, req.user.id);
        res.json({ success: true, vendor });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});
```

### **Shipper Location Update**

```javascript
// Controller
app.put("/api/shipper/location", async (req, res) => {
    try {
        const shipper = await shipperService.updateLocation(req.user.id, req.body);
        res.json({ success: true, shipper });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});
```

## 🎉 **Kết luận**

Kiến trúc mới này:

- ✅ **Tuân thủ SOLID principles**
- ✅ **Dễ maintain và extend**
- ✅ **Performance tốt hơn**
- ✅ **Type safety cao**
- ✅ **Code rõ ràng và dễ hiểu**
- ✅ **Scalable và flexible**

Mỗi role giờ đây có model và service riêng biệt, giúp code dễ đọc, dễ maintain và dễ phát triển thêm tính năng mới.
