/**
 * RMIT University Vietnam
 * Course: COSC2769 - Full Stack Development
 * Semester: 2025B
 * Assessment: Assignment 02
 * Author: Do Van Tung, Thieu Gia Huy, Nguyen Phi Long
 * ID: 4053400, 3975542, 3988413
 */

import { DistributionHub, BaseUser, Product } from "../models/index.js";

// Creat sample data for distribution hubs
export const seedHubs = async () => {
    try {
        const hubs = [
            {
                name: "Ho Chi Minh",
                address: "123 Nguyễn Huệ, Quận 1, TP.HCM",
            },
            {
                name: "Da Nang",
                address: "456 Lê Duẩn, Hải Châu, Đà Nẵng",
            },
            {
                name: "Hanoi",
                address: "789 Hoàn Kiếm, Quận Hoàn Kiếm, Hà Nội",
            },
        ];

        for (const hubData of hubs) {
            const existingHub = await DistributionHub.findOne({
                name: hubData.name,
            });
            if (!existingHub) {
                const hub = new DistributionHub(hubData);
                await hub.save();
            }
        }
    } catch (error) {}
};

// Create sample data for admin user
export const seedAdmin = async () => {
    try {
        const existingAdmin = await BaseUser.findOne({ username: "admin123" });
        if (!existingAdmin) {
            const admin = new BaseUser({
                username: "admin123",
                email: "admin@ecommerce.com",
                password: "Admin123!",
                role: "vendor",
                businessName: "Admin Store",
                businessAddress:
                    "123 Admin Street, District 1, Ho Chi Minh City",
                businessLicense: "ADMIN001",
                taxCode: "ADMIN123456",
                contactPerson: {
                    name: "Admin User",
                    position: "Administrator",
                },
                businessType: "company",
                categories: ["electronics", "clothing", "books"],
                bankAccount: {
                    bankName: "Vietcombank",
                    accountNumber: "1234567890",
                    accountHolder: "Admin Store",
                },
                profilePicture: "uploads/profiles/default-avatar.png",
            });
            await admin.save();
        }
    } catch (error) {}
};

// Sample data for products
export const seedProducts = async () => {
    try {
        const admin = await BaseUser.findOne({ username: "admin123" });
        if (!admin) {
            return;
        }

        const products = [
            {
                name: "iPhone 15 Pro Max",
                price: 29990000,
                description:
                    "iPhone 15 Pro Max với camera 48MP, chip A17 Pro, màn hình 6.7 inch Super Retina XDR",
                vendor: admin._id,
                images: ["product01.png"],
                category: "Phone",
                stock: 50,
                status: "active",
            },
            {
                name: "Samsung Galaxy S24",
                price: 24990000,
                description:
                    "Samsung Galaxy S24 với camera 200MP, chip Snapdragon 8 Gen 3, màn hình 6.2 inch Dynamic AMOLED 2X",
                vendor: admin._id,
                images: ["product02.png"],
                category: "Phone",
                stock: 30,
                status: "active",
            },
            {
                name: "MacBook Pro M3",
                price: 45990000,
                description:
                    "MacBook Pro 14 inch với chip M3, 16GB RAM, 512GB SSD, màn hình Liquid Retina XDR",
                vendor: admin._id,
                images: ["product03.png"],
                category: "Laptop",
                stock: 25,
                status: "active",
            },
            {
                name: "Dell XPS 13",
                price: 32990000,
                description:
                    "Dell XPS 13 với Intel Core i7, 16GB RAM, 512GB SSD, màn hình 13.4 inch 4K",
                vendor: admin._id,
                images: ["product04.png"],
                category: "Laptop",
                stock: 40,
                status: "active",
            },
            {
                name: "AirPods Pro 2",
                price: 5990000,
                description:
                    "AirPods Pro 2 với chip H2, chống ồi chủ động, thời lượng pin 6 giờ",
                vendor: admin._id,
                images: ["product05.png"],
                category: "Headphones",
                stock: 100,
                status: "active",
            },
            {
                name: "Sony WH-1000XM5",
                price: 8990000,
                description:
                    "Tai nghe chống ồi Sony WH-1000XM5 với chất lượng âm thanh cao cấp và chống ồi chủ động",
                vendor: admin._id,
                images: ["product06.png"],
                category: "Headphones",
                stock: 60,
                status: "active",
            },
            {
                name: "iPad Pro 12.9 inch",
                price: 22990000,
                description:
                    "iPad Pro 12.9 inch với chip M2, màn hình Liquid Retina XDR, hỗ trợ Apple Pencil",
                vendor: admin._id,
                images: ["product07.png"],
                category: "electronics",
                stock: 35,
                status: "active",
            },
            {
                name: "Nintendo Switch OLED",
                price: 8990000,
                description:
                    "Nintendo Switch OLED với màn hình OLED 7 inch, Joy-Con controllers, chơi game mọi lúc mọi nơi",
                vendor: admin._id,
                images: ["product08.png"],
                category: "electronics",
                stock: 45,
                status: "active",
            },
            {
                name: "Samsung 4K Smart TV",
                price: 15990000,
                description:
                    "Samsung 4K Smart TV 55 inch với công nghệ QLED, HDR10+, tích hợp Tizen OS",
                vendor: admin._id,
                images: ["product09.png"],
                category: "TV",
                stock: 20,
                status: "active",
            },
        ];

        for (const productData of products) {
            // Bỏ qua các sản phẩm có giá = 0 (shop images)
            if (productData.price === 0) {
                continue;
            }

            const existingProduct = await Product.findOne({
                name: productData.name,
            });
            if (!existingProduct) {
                // Chuyển đổi images thành full path
                const productWithImages = {
                    ...productData,
                    images: productData.images.map(
                        (img) => `uploads/products/${img}`
                    ),
                };

                const product = new Product(productWithImages);
                await product.save();
            }
        }
    } catch (error) {}
};

export const seedDatabase = async () => {
    try {
        await seedHubs();
        await seedAdmin();
        await seedProducts();
    } catch (error) {}
};
