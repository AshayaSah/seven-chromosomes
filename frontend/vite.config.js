import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    "process.env": {
      IPFS_URL: "http://127.0.0.1:8080/ipfs",
      PATIENT_API:
        "https://normally-poetic-ferret.ngrok-free.app/api/process-content",
      DOCTOR_API:
        "https://normally-poetic-ferret.ngrok-free.app/api/predict-medicine",
    },
  },
});
