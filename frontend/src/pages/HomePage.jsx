"use client";

import { useState } from "react";
import {
  ChevronRight,
  Mail,
  Phone,
  Facebook,
  Twitter,
  Linkedin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Topbar from "@/components/layout/Topbar";
import Navbar from "@/components/Navbar";
import Hero from "@/components/layout/Hero";
import Services from "@/components/layout/Services";
import About from "@/components/layout/About";
import StatsSection from "@/components/layout/StatsSection";
import Footer from "@/components/layout/Footer";

export default function MecareHealthcare() {
  const [name, setName] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");

  return (
    <div className="w-full">
      {/* Hero Section */}
      <Hero></Hero>

      {/* Services Section */}
      <Services></Services>

      {/* About Section */}
      <About></About>

      {/* Stats Section */}
      <StatsSection></StatsSection>

      {/* Footer  */}
      <Footer></Footer>
    </div>
  );
}
