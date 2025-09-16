/**
 * RMIT University Vietnam
 * Course: COSC2769 - Full Stack Development
 * Semester: 2025B
 * Assessment: Assignment 02
 * Author: Do Van Tung, Thieu Gia Huy, Nguyen Phi Long
 * ID: 4053400, 3975542, 3988413
 */

import { Product, Vendor } from "../models/index.js";

// Lấy tất cả sản phẩm (với filtering/search)
export const getProducts = async (req, res) => {
    try {
        const { search, minPrice, maxPrice, vendorId, category } = req.query;

        let query = {};

        // Tìm kiếm theo tên và mô tả
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
            ];
        }

        // Lọc theo danh mục
        if (category) {
            query.category = category;
        }

        // Lọc theo giá
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = parseFloat(minPrice);
            if (maxPrice) query.price.$lte = parseFloat(maxPrice);
        }

        // Lọc theo vendor
        if (vendorId) {
            query.vendor = vendorId;
        }

        const products = await Product.find(query)
            .populate("vendor", "username businessName")
            .sort({ createdAt: -1 });

        res.json({
            products,
            total: products.length,
        });
    } catch (error) {
        res.status(500).json({
            error: "Lỗi server nội bộ",
        });
    }
};

// Lấy chi tiết sản phẩm
export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findById(id).populate(
            "vendor",
            "username businessName businessAddress"
        );

        if (!product) {
            return res.status(404).json({
                error: "Không tìm thấy sản phẩm",
            });
        }

        res.json({
            product,
        });
    } catch (error) {
        res.status(500).json({
            error: "Lỗi server nội bộ",
        });
    }
};

// Lấy sản phẩm của vendor
export const getVendorProducts = async (req, res) => {
    try {
        const vendorId = req.user.userId;

        const products = await Product.find({ vendor: vendorId }).sort({
            createdAt: -1,
        });

        res.json({
            products,
            total: products.length,
        });
    } catch (error) {
        res.status(500).json({
            error: "Lỗi server nội bộ",
        });
    }
};

// Lấy danh sách danh mục (unique)
export const getProductCategories = async (_req, res) => {
    try {
        const categories = await Product.distinct("category");
        res.json({ categories });
    } catch (error) {
        res.status(500).json({ error: "Lỗi server nội bộ" });
    }
};

// Thêm sản phẩm mới
export const addProduct = async (req, res) => {
    try {
        const { name, price, description, category, stock } = req.body;
        const vendorId = req.user.userId;

        // Kiểm tra vendor có tồn tại không
        const vendor = await Vendor.findById(vendorId);
        if (!vendor) {
            return res.status(403).json({
                error: "Chỉ vendor mới có thể thêm sản phẩm",
            });
        }

        // Tạo sản phẩm mới
        const product = new Product({
            name,
            price,
            description,
            category,
            stock: parseInt(stock),
            vendor: vendorId,
            images: req.file ? [req.file.filename] : [],
        });

        await product.save();

        res.status(201).json({
            message: "Thêm sản phẩm thành công",
            product: {
                id: product._id,
                name: product.name,
                price: product.price,
                description: product.description,
                category: product.category,
                stock: product.stock,
                images: product.images,
                vendor: product.vendor,
                createdAt: product.createdAt,
            },
        });
    } catch (error) {
        res.status(500).json({
            error: "Lỗi server nội bộ",
        });
    }
};

// Cập nhật sản phẩm
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, description } = req.body;
        const vendorId = req.user.userId;

        // Tìm sản phẩm
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({
                error: "Không tìm thấy sản phẩm",
            });
        }

        // Kiểm tra quyền sở hữu
        if (product.vendor.toString() !== vendorId) {
            return res.status(403).json({
                error: "Không có quyền cập nhật sản phẩm này",
            });
        }

        // Cập nhật sản phẩm
        product.name = name || product.name;
        product.price = price || product.price;
        product.description = description || product.description;
        if (req.file) {
            product.images = [req.file.filename];
        }

        await product.save();

        res.json({
            message: "Cập nhật sản phẩm thành công",
            product: {
                id: product._id,
                name: product.name,
                price: product.price,
                description: product.description,
                images: product.images,
                vendor: product.vendor,
                updatedAt: product.updatedAt,
            },
        });
    } catch (error) {
        res.status(500).json({
            error: "Lỗi server nội bộ",
        });
    }
};

// Xóa sản phẩm
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const vendorId = req.user.userId;

        // Tìm sản phẩm
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({
                error: "Không tìm thấy sản phẩm",
            });
        }

        // Kiểm tra quyền sở hữu
        if (product.vendor.toString() !== vendorId) {
            return res.status(403).json({
                error: "Không có quyền xóa sản phẩm này",
            });
        }

        await Product.findByIdAndDelete(id);

        res.json({
            message: "Xóa sản phẩm thành công",
        });
    } catch (error) {
        res.status(500).json({
            error: "Lỗi server nội bộ",
        });
    }
};
