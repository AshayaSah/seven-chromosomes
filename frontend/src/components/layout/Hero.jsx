import { ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { useWeb3 } from "@/contexts/Web3Context";
import { Link } from "react-router-dom";

const Hero = () => {
  const { currentAccount, connectWallet, isDoctor, isPatient } = useWeb3();

  return (
    <div className="w-full bg-muted py-16 relative overflow-hidden">
      <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
        {/* Left Content */}
        <div className="z-10 md:ml-12 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Secure Medical Records <br />
            <span className="text-primary">on the Blockchain</span>
          </h1>
          <p className="mt-4 text-muted-foreground w-full md:w-md">
            MedChain provides a secure, transparent, and patient-controlled
            platform for managing medical records using blockchain technology.
          </p>

          <div className="mt-6 flex justify-center md:justify-start">
            {!currentAccount ? (
              <Button
                onClick={connectWallet}
                className="px-6 py-3  flex items-center "
              >
                Connect Wallet to Get Started
              </Button>
            ) : isDoctor ? (
              <Link
                to="/add-patient-record"
                className="py-3  flex items-center "
              >
                <Button>Add Patient Record</Button>
              </Link>
            ) : isPatient ? (
              <Link to="/records" className="py-3  flex items-center ">
                <Button>View Your Medical Records</Button>
              </Link>
            ) : !isPatient && !isDoctor ? (
              <Link to="/register-patient" className="py-3  flex items-center ">
                <Button>Register as Patient</Button>
              </Link>
            ) : null}
          </div>
        </div>

        {/* Right Image */}
        <div className="relative">
          <div className="w-[350px] h-[350px] md:w-[450px] md:h-[450px] rounded-full overflow-hidden border-8 border-background shadow-lg mx-auto">
            <img
              src="/placeholder.svg?height=450&width=450"
              alt="Blockchain Healthcare"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Hero;
