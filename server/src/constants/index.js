/**
 * RMIT University Vietnam
 * Course: COSC2769 - Full Stack Development
 * Semester: 2025B
 * Assessment: Assignment 02
 * Author: Do Van Tung, Thieu Gia Huy, Nguyen Phi Long
 * ID: 4053400, 3975542, 3988413
 */

export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500,
};

// Vai trò người dùng
export const USER_ROLES = {
    CUSTOMER: "Customer",
    VENDOR: "Vendor",
    SHIPPER: "Shipper",
};

// Trạng thái đơn hàng
export const ORDER_STATUS = {
    PENDING: "pending",
    CONFIRMED: "confirmed",
    PROCESSING: "processing",
    SHIPPED: "shipped",
    DELIVERED: "delivered",
    CANCELLED: "cancelled",
    RETURNED: "returned",
};

// Trạng thái thanh toán
export const PAYMENT_STATUS = {
    PENDING: "pending",
    PAID: "paid",
    FAILED: "failed",
    REFUNDED: "refunded",
};

// Trạng thái sản phẩm
export const PRODUCT_STATUS = {
    ACTIVE: "active",
    INACTIVE: "inactive",
    OUT_OF_STOCK: "out_of_stock",
    DISCONTINUED: "discontinued",
};

// Thông báo lỗi
export const ERROR_MESSAGES = {
    VALIDATION_ERROR: "Dữ liệu không hợp lệ",
    UNAUTHORIZED: "Không có quyền truy cập",
    FORBIDDEN: "Bị cấm truy cập",
    NOT_FOUND: "Không tìm thấy",
    CONFLICT: "Xung đột dữ liệu",
    INTERNAL_ERROR: "Lỗi server nội bộ",
    INVALID_CREDENTIALS: "Thông tin đăng nhập không chính xác",
    TOKEN_EXPIRED: "Token đã hết hạn",
    TOKEN_INVALID: "Token không hợp lệ",
    USER_NOT_FOUND: "Không tìm thấy người dùng",
    PRODUCT_NOT_FOUND: "Không tìm thấy sản phẩm",
    ORDER_NOT_FOUND: "Không tìm thấy đơn hàng",
    CART_EMPTY: "Giỏ hàng trống",
    INSUFFICIENT_STOCK: "Không đủ hàng trong kho",
};

// Thông báo thành công
export const SUCCESS_MESSAGES = {
    LOGIN_SUCCESS: "Đăng nhập thành công",
    LOGOUT_SUCCESS: "Đăng xuất thành công",
    REGISTER_SUCCESS: "Đăng ký thành công",
    UPDATE_SUCCESS: "Cập nhật thành công",
    DELETE_SUCCESS: "Xóa thành công",
    CREATE_SUCCESS: "Tạo thành công",
    ORDER_CREATED: "Đơn hàng đã được tạo",
    ORDER_UPDATED: "Đơn hàng đã được cập nhật",
    PRODUCT_ADDED: "Sản phẩm đã được thêm",
    PRODUCT_UPDATED: "Sản phẩm đã được cập nhật",
    CART_UPDATED: "Giỏ hàng đã được cập nhật",
};

// Quy tắc xác thực
export const VALIDATION_RULES = {
    PASSWORD_MIN_LENGTH: 6,
    PASSWORD_MAX_LENGTH: 128,
    NAME_MIN_LENGTH: 2,
    NAME_MAX_LENGTH: 50,
    EMAIL_MAX_LENGTH: 100,
    PHONE_MAX_LENGTH: 20,
    ADDRESS_MAX_LENGTH: 200,
    DESCRIPTION_MAX_LENGTH: 1000,
    PRICE_MIN: 0,
    STOCK_MIN: 0,
};

// Upload file
export const UPLOAD_CONFIG = {
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/gif", "image/webp"],
    UPLOAD_PATH: "uploads/",
    PRODUCT_IMAGES_PATH: "uploads/products/",
    USER_AVATARS_PATH: "uploads/avatars/",
};

// Phân trang
export const PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100,
};

// Khóa cache
export const CACHE_KEYS = {
    PRODUCTS: "products",
    CATEGORIES: "categories",
    USERS: "users",
    ORDERS: "orders",
    STATS: "stats",
};

// Điểm cuối API
export const API_ENDPOINTS = {
    AUTH: "/api/auth",
    PRODUCTS: "/api/products",
    CART: "/api/cart",
    ORDERS: "/api/orders",
    HUBS: "/api/hubs",
    HEALTH: "/api/health",
};
