"use client";

import { useState } from "react";

import Hero from "@/components/layout/Hero";
import Services from "@/components/layout/Services";
import About from "@/components/layout/About";
import StatsSection from "@/components/layout/StatsSection";
import Footer from "@/components/layout/Footer";
import HeroAI from "@/components/layout/HeroSecond";

export default function MecareHealthcare() {
  const [name, setName] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");

  return (
    <div className="w-full">
      {/* Hero Section */}
      <Hero></Hero>

      {/* Stats Section */}
      <StatsSection></StatsSection>

      {/* Second Hero  */}
      <HeroAI></HeroAI>

      {/* Services Section */}
      <Services></Services>

      {/* About Section
      <About></About> */}

      {/* Footer  */}
      <Footer></Footer>
    </div>
  );
}
