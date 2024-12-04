import React, { useState, createContext, useEffect} from "react";
import {gapi} from 'gapi-script';
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";

import AnnouncementBar from "./components/AnnouncementBar";
import Header from "./components/Header";
import CategoryDescription from "./components/product-grid/CategoryDescription";
import ProductGrid from "./components/product-grid/ProductGrid.jsx";
import Footer from "./components/Footer";
import Cart from "./components/cart/Cart";
import Login from "./components/login/Login"
import Register from "./components/register/Register.jsx"
import ProductPage from "./components/product-page/ProductPage";
import Profile from "./components/profile/ProfilePage.jsx"
import Recovery from "./components/login/VerifyOTP.jsx"
import CheckOut from "./components/cart/CheckOut.jsx"
import Admin from "./components/admin/Admin.jsx";

import TableUsers from "./components/admin/Table/TableUsers.jsx";
import ProductTable from "./components/admin/Table/TableProducts.jsx";

export const Context = createContext();

const clientId = "1074315812564-92s9klc0eos45ujtefj613bkualvulq0.apps.googleusercontent.com";

function App() {
    const [cartCounter, setCartCounter] = useState(0);
    const navigationItems = ["For Him", "Unisex", "Body Mist"];
    const location = useLocation();

    const adminRoute = "/admin"
    const shouldHideHeaderFooter = adminRoute.includes(location.pathname);
    useEffect(() => {
      function start(){
        gapi.client.init({
          clientId: clientId,
          scope: ""
        })
      }

      gapi.load('client:auth2', start)
    });

    const tableData = [
      { fullName: "John Doe", phone: "123-456-7890", email: "john@example.com", address: "123 Main St" },
      { fullName: "Jane Smith", phone: "987-654-3210", email: "jane@example.com", address: "456 Oak Ave" },
      { fullName: "Sam Johnson", phone: "555-555-5555", email: "sam@example.com", address: "789 Pine Rd" },
      { fullName: "John Doe", phone: "123-456-7890", email: "john@example.com", address: "123 Main St" },
      { fullName: "Jane Smith", phone: "987-654-3210", email: "jane@example.com", address: "456 Oak Ave" },
      { fullName: "Sam Johnson", phone: "555-555-5555", email: "sam@example.com", address: "789 Pine Rd" },
  ];
  
    const productData = [
      {
        id: 1,
        name: "Perfume Essence No.1",
        quantity: 50,
        star: 4.5,
        description: "A luxurious fragrance with a blend of floral and woody notes.",
        discount: 0,
        image: "https://i.ibb.co/126PHYL/0369446fe4f54cebd4bbb403a111ce9b.jpg",
        category: "For Her",
        variants: [
          { size: "50ml", price: 3520000 },
          { size: "100ml", price: 7520000 },
        ],
      },
      {
        id: 2,
        name: "Mystic Bloom",
        quantity: 30,
        star: 4.2,
        description: "A refreshing scent inspired by blooming gardens.",
        discount: 0,
        image: "https://i.ibb.co/Ntn63s6/0c438b169aac2ca69cbe5df6f69261a2.jpg",
        category: "For Her",
        variants: [
          { size: "50ml", price: 3520000 },
          { size: "100ml", price: 7520000 },
        ],
      },
      {
        id: 3,
        name: "Elegant Whisper",
        quantity: 40,
        star: 4.8,
        description: "Sophisticated and subtle, perfect for evening wear.",
        discount: 0,
        image: "https://i.ibb.co/vwB2rgr/713ff5fccfb22ef0eed5afeb65158041.jpg",
        category: "For Her",
        variants: [
          { size: "50ml", price: 3520000 },
          { size: "100ml", price: 7520000 },
        ],
      },
      {
        id: 4,
        name: "Ocean Breeze",
        quantity: 25,
        star: 4.0,
        description: "A light and breezy fragrance reminiscent of the sea.",
        discount: 0,
        image: "https://i.ibb.co/VH99QKG/e679333e48b1444a87d7fd7c165c0139.jpg",
        category: "For Her",
        variants: [
          { size: "50ml", price: 3520000 },
          { size: "100ml", price: 7520000 },
        ],
      },
    ]

    return (
        <Context.Provider value={[cartCounter, setCartCounter]}>
            {/* <AnnouncementBar title="Free Shipping in Europe" /> */}
            {!shouldHideHeaderFooter && <Header navigationItems={navigationItems} />}
            
          
                <Routes>
                    <Route path="/recovery" element={<Recovery/>}></Route>
                    <Route path="/profile" element={<Profile />}></Route>
                    <Route path="/register" element={<Register />}></Route>
                    <Route path="/login" element={<Login />}></Route>
                    <Route path="/cart" element={<Cart />}></Route>
                    <Route path="/checkout" element={<CheckOut />}></Route>
                    <Route
                        path="/"
                        element={
                          <>
                            <CategoryDescription
                              title="Discover our exquisite perfume collection"
                              desc="Explore our unique, refined perfume collection, perfect for every style and personality. Find your favorite scent today"
                              carouselImages={[
                                "https://i.ibb.co/pv023Dx/6f6d91ceb23f9b46a3183c2ca2e9ff9f.jpg",
                                "https://i.ibb.co/yhQsgDF/6c353a303a9ab73f1cdd010b0555a59e.jpg",
                                "https://i.ibb.co/fCTDdWd/f428a8f8fcda2f0f5247f43acf1dea16.jpg",
                                "https://i.ibb.co/FmbwFqS/da838ba7dac254f4d8581b4b43eea99f.jpg",
                              ]}
                          />

                            <ProductGrid category="For Her"/>
                          </>
                        }
                    />
                    <Route
                        path="/forhim"
                        element={
                          <>
                            <CategoryDescription
                              title="Discover our exquisite perfume collection"
                              desc="Explore our unique, refined perfume collection, perfect for every style and personality. Find your favorite scent today"
                              carouselImages={[
                                "https://i.ibb.co/pv023Dx/6f6d91ceb23f9b46a3183c2ca2e9ff9f.jpg",
                                "https://i.ibb.co/yhQsgDF/6c353a303a9ab73f1cdd010b0555a59e.jpg",
                                "https://i.ibb.co/fCTDdWd/f428a8f8fcda2f0f5247f43acf1dea16.jpg",
                                "https://i.ibb.co/FmbwFqS/da838ba7dac254f4d8581b4b43eea99f.jpg",
                              ]}
                            />
                            <ProductGrid category="For Him"/>
                          </>
                        }
                    />
                    <Route
                        path="/unisex"
                        element={
                          <>
                            <CategoryDescription
                              title="Discover our exquisite perfume collection"
                              desc="Explore our unique, refined perfume collection, perfect for every style and personality. Find your favorite scent today"
                              carouselImages={[
                                "https://i.ibb.co/pv023Dx/6f6d91ceb23f9b46a3183c2ca2e9ff9f.jpg",
                                "https://i.ibb.co/yhQsgDF/6c353a303a9ab73f1cdd010b0555a59e.jpg",
                                "https://i.ibb.co/fCTDdWd/f428a8f8fcda2f0f5247f43acf1dea16.jpg",
                                "https://i.ibb.co/FmbwFqS/da838ba7dac254f4d8581b4b43eea99f.jpg",
                              ]}
                            />
                            <ProductGrid category="Unisex"/>
                          </>
                        }
                    />
                    <Route
                        path="/bodymist"
                        element={
                          <>
                            <CategoryDescription
                              title="Discover our exquisite perfume collection"
                              desc="Explore our unique, refined perfume collection, perfect for every style and personality. Find your favorite scent today"
                              carouselImages={[
                                "https://i.ibb.co/pv023Dx/6f6d91ceb23f9b46a3183c2ca2e9ff9f.jpg",
                                "https://i.ibb.co/yhQsgDF/6c353a303a9ab73f1cdd010b0555a59e.jpg",
                                "https://i.ibb.co/fCTDdWd/f428a8f8fcda2f0f5247f43acf1dea16.jpg",
                                "https://i.ibb.co/FmbwFqS/da838ba7dac254f4d8581b4b43eea99f.jpg",
                              ]}
                            />
                            <ProductGrid category="Body Mist"/>
                          </>
                        }
                    />
                    <Route path="/products/:id" element={<ProductPage />} />
                 
                    {/* Định tuyến tới trang admin */}
                    <Route path="/admin" element={<Admin/>}/>
                      
          

   
                </Routes>
            {!shouldHideHeaderFooter && <Footer />}
        </Context.Provider>

        
    );
}

export default App;