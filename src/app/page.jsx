'use client'

import ToolCardsPage from "@/components/cards/toolCards";
import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/navbar";
import Image from "next/image";

export default function Home() {
  return (
  <div>
    <Navbar/>
    <ToolCardsPage/>
    <Footer/>
  </div>
  );
}
