import React from "react";
import { Routes, Route } from "react-router-dom";
import SideBar from "./SideBar/SideBar";
import HeaderAdmin from "./HeaderAdmin/HeaderAdmin";
import AnalyticsSession from "./Analytics/AnalyticsSession";
import TableUsers from "./Table/TableUsers";
import TableProducts from "./Table/TableProducts"
export default function Admin() {
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
    <div className="bg-[#f5f8fe]">
      <div className="h-full w-full ">
        <SideBar></SideBar>
        <main className="mx-[12px] h-full flex-none transition-all md:pr-2 xl:ml-[313px] ">
          <div className="h-full ">
            <HeaderAdmin></HeaderAdmin>
            <div className="pt-5s mx-auto mb-auto h-full min-h-[84vh] ml-10  md:pr-2">
              <AnalyticsSession></AnalyticsSession>
              <TableUsers tableData={tableData} />
              <TableProducts productData={productData} />
              
            </div>
            
            
          </div>
        </main>
      </div>
    </div>
  );
}
