import { Button } from "../ui/button";
import { FaArrowRight } from "react-icons/fa";
import HeroBgImage from "../../assets/second_texture.png"; // adjust path if needed
import Magnet from "../ui/magnet";

const HeroAI = () => {
  return (
    <section className="relative py-24 w-full text-white flex items-center justify-center px-6 overflow-hidden bg-[#1b133f]">
      {/* Background Gradient */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#1b133f] via-[#201749] to-[#110e1e]" />

      {/* Texture Layer with significantly improved visibility */}
      <div
        className="absolute inset-0 z-1 opacity-60"
        style={{
          backgroundImage: `url('${HeroBgImage}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          mixBlendMode: "overlay",
        }}
      />

      {/* Glow elements - top-left and bottom-right */}
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-purple-600/30 blur-3xl z-1" />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-indigo-500/30 blur-3xl z-1" />

      {/* Main container */}
      <div className="relative z-10 max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        {/* AI Visualization - On the left side */}
        <div className="flex justify-center relative">
          {/* Main AI card with glow */}
          <div className="relative w-[260px] h-[260px] bg-gradient-to-br from-purple-600 to-indigo-500 rounded-2xl flex items-center justify-center text-5xl font-bold">
            {/* Inner subtle pattern */}
            <div
              className="absolute inset-2 rounded-xl opacity-40"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(135deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)",
                backgroundSize: "30px 30px",
              }}
            />

            {/* Outer glow */}
            <div className="absolute inset-0 rounded-2xl shadow-[0_0_80px_rgba(147,51,234,0.7)] -z-10" />

            <span className="relative z-10">AI</span>

            {/* Connection nodes with glows */}
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-6 h-6 bg-purple-500 rounded-md shadow-[0_0_15px_rgba(168,85,247,0.7)]" />
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-6 h-6 bg-purple-500 rounded-md shadow-[0_0_15px_rgba(168,85,247,0.7)]" />
            <div className="absolute left-[-30px] top-1/2 -translate-y-1/2 w-6 h-6 bg-purple-500 rounded-md shadow-[0_0_15px_rgba(168,85,247,0.7)]" />
            <div className="absolute right-[-30px] top-1/2 -translate-y-1/2 w-6 h-6 bg-purple-500 rounded-md shadow-[0_0_15px_rgba(168,85,247,0.7)]" />
          </div>

          {/* Connected elements */}
          <div className="absolute top-12 right-12 w-14 h-14 bg-black/40 backdrop-blur-sm rounded-lg border border-white/10 flex items-center justify-center shadow-lg">
            <div className="w-8 h-5 border-t-2 border-r-2 border-white/40 rounded-tr-md" />
          </div>

          <div className="absolute bottom-16 right-12 w-16 h-16 bg-black/40 backdrop-blur-sm rounded-lg border border-white/10 flex items-center justify-center shadow-lg">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500/50 to-indigo-500/50 rotate-45 rounded-md" />
          </div>

          <div className="absolute left-12 bottom-12 w-16 h-16 bg-black/40 backdrop-blur-sm rounded-lg border border-white/10 flex items-center justify-center shadow-lg">
            <div className="w-8 h-8 rounded-full border-2 border-white/40" />
          </div>

          {/* Connection lines */}
          <div className="absolute top-0 left-1/2 h-full w-px bg-gradient-to-b from-purple-500/0 via-purple-500/50 to-purple-500/0" />
          <div className="absolute top-1/2 left-0 h-px w-full bg-gradient-to-r from-purple-500/0 via-purple-500/50 to-purple-500/0" />
        </div>

        {/* Text Section - On the right side */}
        <div className="space-y-6 text-center md:text-left">
          <div className="bg-[#2a1744] text-xs inline-block text-white px-4 py-1 rounded-full border border-white/10 mb-2">
            <span className="mr-2">⚙️</span> AI + Business
          </div>
          <h1 className="text-5xl font-bold leading-tight">
            Seamlessly
            <br /> AI Integration
            <br /> for Business
          </h1>
          <p className="text-lg text-gray-300">
            We will help integrate AI models into your <br /> application or
            business process
          </p>
          <div className="mt-6 flex items-center gap-4 justify-center md:justify-start">
            <Magnet padding={50} disabled={false} magnetStrength={5}>
              <Button className="bg-white text-[#201749] hover:bg-gray-200 transition-all px-6 py-3 font-medium rounded-lg">
                Get started
              </Button>
            </Magnet>
            <div className="p-4 border border-white/20 rounded-full flex items-center justify-center hover:bg-white/5 transition-all cursor-pointer">
              <Magnet padding={50} disabled={false} magnetStrength={5}>
                <FaArrowRight />
              </Magnet>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroAI;
