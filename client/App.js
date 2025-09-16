// RMIT University Vietnam
// Course: COSC2769 - Full Stack Development
// Semester: 2025B
// Assessment: Assignment 02
// Author: Do Van Tung, Thieu Gia Huy
// ID: 4053400, 3975542

import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Provider, useDispatch } from "react-redux";
import { store } from "./store/store";
import { loginSuccess } from "./store/slices/authSlice";
import { fetchCart } from "./store/slices/cartSlice";
import { useSmartAuthProfile } from "./hooks/useSmartApi";
import ErrorBoundary from "./components/ErrorBoundary";
import { ToastProvider } from "./contexts/ToastContext";

import Header from "./components/Header";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import RegisterCustomer from "./pages/RegisterCustomer";
import RegisterVendor from "./pages/RegisterVendor";
import RegisterShipper from "./pages/RegisterShipper";
import MyAccount from "./pages/MyAccount";
import AboutUs from './pages/AboutUs';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Help from './pages/Help';
import Terms from './pages/Terms';
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import VendorMyProducts from "./pages/VendorMyProducts";
import VendorAddProduct from "./pages/VendorAddProduct";
import VendorEditProduct from "./pages/VendorEditProduct";
import VendorProfile from "./pages/VendorProfile";
import VendorDashboard from "./pages/VendorDashboard";
import ShipperActiveOrders from "./pages/ShipperActiveOrders";
import ShipperDashboard from "./pages/ShipperDashboard";
import ShipperOrderDetail from "./pages/ShipperOrderDetail";

function AppContent() {
    const dispatch = useDispatch();

    const {
        data: authData,
        loading: authLoading,
        error: authError,
    } = useSmartAuthProfile();

    useEffect(() => {
        if (authData?.user) {
            dispatch(loginSuccess(authData.user));
            dispatch(fetchCart());
        }
    }, [authData, authLoading, authError, dispatch]);

    return (
        <ErrorBoundary>
            <Routes>
                <Route
                    path="/vendor/*"
                    element={
                        <Routes>
                            <Route
                                path="/dashboard"
                                element={<VendorDashboard />}
                            />
                            <Route
                                path="/profile"
                                element={<VendorProfile />}
                            />
                            <Route
                                path="/my-products"
                                element={<VendorMyProducts />}
                            />
                            <Route
                                path="/add-product"
                                element={<VendorAddProduct />}
                            />
                            <Route
                                path="/edit-product/:productId"
                                element={<VendorEditProduct />}
                            />
                            <Route
                                path="*"
                                element={
                                    <Navigate to="/vendor/dashboard" replace />
                                }
                            />
                        </Routes>
                    }
                />

                <Route
                    path="/shipper/*"
                    element={
                        <Routes>
                            <Route
                                path="/dashboard"
                                element={<ShipperDashboard />}
                            />
                            <Route
                                path="/orders"
                                element={<ShipperActiveOrders />}
                            />
                            <Route
                                path="/orders/:id"
                                element={<ShipperOrderDetail />}
                            />
                            <Route
                                path="*"
                                element={
                                    <Navigate to="/shipper/dashboard" replace />
                                }
                            />
                        </Routes>
                    }
                />
                <Route
                    path="/*"
                    element={
                        <div className="App">
                            <Header />
                            <Nav />
                            <main>
                                <Routes>
                                    <Route path="/" element={<Home />} />
                                    <Route
                                        path="/products"
                                        element={<Products />}
                                    />
                                    <Route
                                        path="/products/:id"
                                        element={<ProductDetail />}
                                    />
                                    <Route path="/cart" element={<Cart />} />
                                    <Route
                                        path="/checkout"
                                        element={<Checkout />}
                                    />
                                    <Route path="/login" element={<Login />} />
                                    <Route
                                        path="/register/customer"
                                        element={<RegisterCustomer />}
                                    />
                                    <Route
                                        path="/register/vendor"
                                        element={<RegisterVendor />}
                                    />
                                    <Route
                                        path="/register/shipper"
                                        element={<RegisterShipper />}
                                    />
                                    <Route path="/about-us" element={<AboutUs />} />
                                    <Route path="/contact" element={<Contact />} />
                                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                                    <Route path="/help" element={<Help />} />
                                    <Route path="/terms" element={<Terms />} />
                                    <Route
                                        path="/my-account"
                                        element={<MyAccount />}
                                    />
                                    
                                    <Route
                                        path="*"
                                        element={<Navigate to="/" replace />}
                                    />
                                    
                                </Routes>
                            </main>
                            <Footer />
                        </div>
                    }
                />
            </Routes>
        </ErrorBoundary>
    );
}

function App() {
    return (
        <Provider store={store}>
            <ToastProvider>
                <AppContent />
            </ToastProvider>
        </Provider>
    );
}

export default App;
