// src/components/Navbar.js
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useWeb3 } from "../contexts/Web3Context";
import { ChevronRight } from "lucide-react"; // Install if not already: npm install lucide-react
import { Button } from "@/components/ui/button"; // Adjust this path based on your button component location
import { ModeToggle } from "./ui/ModeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";

const Navbar = () => {
  const { isAdmin, currentAccount, connectWallet, isDoctor, isPatient } =
    useWeb3();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path
      ? "text-primary font-semibold"
      : "text-gray-700";
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto py-4 px-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <Link
            to="/"
            className="text-primary font-bold text-2xl flex items-center"
          >
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mr-2">
              <span className="text-primary-foreground text-xl">+</span>
            </div>
            MedChain
          </Link>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-6 items-center">
          <Link to="/" className={`${isActive("/")}`}>
            Home
          </Link>

          {isAdmin && (
            <Link
              to="/register-doctor"
              className={`${isActive("/register-doctor")}`}
            >
              Register Doctor
            </Link>
          )}

          {isPatient && (
            <Link to="/records" className={`${isActive("/records")}`}>
              My Records
            </Link>
          )}

          {isDoctor && (
            <Link
              to="/add-patient-record"
              className={`${isActive("/add-patient-record")}`}
            >
              Add Record
            </Link>
          )}

          {isDoctor && (
            <Link
              to="/view-patients-records"
              className={`${isActive("/view-patients-records")}`}
            >
              View Patients Records
            </Link>
          )}

          {!isPatient && !isDoctor && !isAdmin && currentAccount && (
            <Link to="/register" className={`${isActive("/register")}`}>
              Register as Patient
            </Link>
          )}

          <Link to="/about" className={`${isActive("/about")}`}>
            About
          </Link>
        </div>

        {/* Right Button / Wallet */}
        <div className="flex items-center space-x-4">
          {/* <ModeToggle></ModeToggle> */}
          {!currentAccount ? (
            <Button
              variant="default"
              onClick={connectWallet}
              className="flex items-center"
            >
              Connect Wallet <ChevronRight size={16} className="ml-1" />
            </Button>
          ) : (
            <div className="text-sm text-gray-700 font-medium truncate max-w-[200px]">
              <HoverCard>
                <HoverCardTrigger>
                  {" "}
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </HoverCardTrigger>
                <HoverCardContent>
                  {currentAccount.substring(0, 6)}...
                  {currentAccount.substring(currentAccount.length - 4)}
                </HoverCardContent>
              </HoverCard>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden px-4 py-2">
        <div className="flex flex-col space-y-2">
          <Link to="/" className={isActive("/")}>
            Home
          </Link>

          {isAdmin && (
            <Link
              to="/register-doctor"
              className={isActive("/register-doctor")}
            >
              Register Doctor
            </Link>
          )}

          {isPatient && (
            <Link to="/records" className={isActive("/records")}>
              My Records
            </Link>
          )}

          {isDoctor && (
            <Link
              to="/add-patient-record"
              className={isActive("/add-patient-record")}
            >
              Add Record
            </Link>
          )}

          {!isPatient && !isDoctor && !isAdmin && currentAccount && (
            <Link to="/register" className={isActive("/register")}>
              Register as Patient
            </Link>
          )}

          <Link to="/about" className={isActive("/about")}>
            About
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
