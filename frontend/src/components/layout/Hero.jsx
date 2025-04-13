import { ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { useWeb3 } from "@/contexts/Web3Context";
import { Link } from "react-router-dom";
import Orb from "../ui/orb";
import HeroImage from "../../assets/hero_image.jpg";
import HeroBgImage from "../../assets/grey-texture-background.jpg";
import Magnet from "../ui/magnet";

const Hero = () => {
  const { currentAccount, connectWallet, isDoctor, isPatient, isAdmin } =
    useWeb3();

  return (
    <div className="w-full py-16 relative overflow-hidden">
      {/* Background Layer */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
        linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(6, 182, 212, 0.3)),
        url('${HeroBgImage}')
      `,
          backgroundSize: "cover, cover",
          backgroundRepeat: "no-repeat, no-repeat",
          backgroundPosition: "top left, top left",
          maskImage: "linear-gradient(135deg, black 30%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(135deg, black 30%, transparent 100%)",
        }}
      />

      {/* Foreground Content */}
      <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8 items-center relative z-10">
        {/* Left Content */}
        <div className="z-10 md:ml-12 text-center md:text-left">
          <h1 className="text-4xl text-white md:text-5xl font-bold leading-tight">
            Secure Medical Records <br />
            <span className="text-primary">on the Blockchain</span>
          </h1>
          <p className="mt-4 text-white w-full md:w-md">
            MedChain provides a secure, transparent, and patient-controlled
            platform for managing medical records using blockchain technology.
          </p>

          <div className="mt-6 flex justify-center md:justify-start">
            {!currentAccount ? (
              <Magnet padding={50} disabled={false} magnetStrength={5}>
                <Button
                  onClick={connectWallet}
                  className="px-6 py-3  flex items-center "
                >
                  Connect Wallet to Get Started
                </Button>
              </Magnet>
            ) : isDoctor ? (
              <div className="flex gap-6">
                <Link
                  to="/add-patient-record"
                  className="py-3  flex items-center "
                >
                  <Magnet padding={50} disabled={false} magnetStrength={5}>
                    <Button>Add Patient Record</Button>
                  </Magnet>
                </Link>
                <Link
                  to="/view-patients-records"
                  className="py-3  flex items-center "
                >
                  <Magnet padding={50} disabled={false} magnetStrength={5}>
                    <Button>View Patients Records</Button>
                  </Magnet>
                </Link>
              </div>
            ) : isAdmin ? (
              <Link to="/register-doctor" className="py-3  flex items-center ">
                <Magnet padding={50} disabled={false} magnetStrength={5}>
                  <Button>Register Doctor</Button>
                </Magnet>
              </Link>
            ) : isPatient ? (
              <Link to="/records" className="py-3  flex items-center ">
                <Magnet padding={50} disabled={false} magnetStrength={5}>
                  <Button>View Your Medical Records</Button>
                </Magnet>
              </Link>
            ) : !isPatient && !isDoctor ? (
              <Link to="/register-patient" className="py-3  flex items-center ">
                <Magnet padding={50} disabled={false} magnetStrength={5}>
                  <Button>Register as Patient</Button>
                </Magnet>
              </Link>
            ) : null}
          </div>
        </div>

        <div className="relative w-full h-[600px] flex items-center justify-center">
          {/* Orb background */}
          <div className="absolute inset-0 z-0">
            <Orb
              hoverIntensity={0.2}
              rotateOnHover={true}
              hue={27}
              forceHoverState={true}
            />
          </div>

          {/* Image on top of orb */}
          <div className="relative z-10">
            <div className="w-[350px] h-[350px] md:w-[450px] md:h-[450px] rounded-full overflow-hidden border-[10px] border-white shadow-2xl">
              <img
                src={HeroImage}
                alt="Blockchain Healthcare"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Hero;
