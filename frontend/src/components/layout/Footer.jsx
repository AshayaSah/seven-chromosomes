const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-primary to-cyan-500 text-secondary py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <p className=" font-bold text-xl">MedChain</p>
          <p className=" text-sm">Secure medical records on the blockchain</p>
        </div>
        <div className="flex space-x-6">
          <a href="#" className="">
            Privacy Policy
          </a>
          <a href="#" className="">
            Terms of Service
          </a>
          <a href="#" className="">
            Contact Us
          </a>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-8 pt-8 border-t ">
        <p className=" text-sm text-center">
          &copy; {new Date().getFullYear()} MedChain. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
export default Footer;
