import { Facebook, Linkedin, Mail, Phone, Twitter } from "lucide-react";

const Topbar = () => {
  return (
    <div className="w-full bg-gradient-to-r from-primary to-cyan-500 text-white py-2 px-4 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1">
          <Mail size={14} />
          <span className="text-sm">info@example.com</span>
        </div>
        <div className="flex items-center space-x-1">
          <Phone size={14} />
          <span className="text-sm">+1 12 3456897</span>
        </div>
      </div>
      <div className="flex space-x-2">
        <Facebook size={16} className="cursor-pointer" />
        <Twitter size={16} className="cursor-pointer" />
        <Linkedin size={16} className="cursor-pointer" />
      </div>
    </div>
  );
};
export default Topbar;
