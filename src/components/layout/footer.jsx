const Footer = () => {
    return (
      <footer className="flex justify-end bg-black text-white p-4 h-50 ">
        <div className="container mx-auto text-center md:mt-15 mt-10">
          <p className="text-sm">
            &copy; 2025 Beginner Platform. All rights reserved.
          </p>
          <div className="flex justify-center space-x-4 mt-2">
            <a
              href="/about"
              className="hover:text-gray-400"
            >
              About
            </a>
            <a
              href="/tools"
              className="hover:text-gray-400"
            >
              Tools
            </a>
            <a
              href="/contact"
              className="hover:text-gray-400"
            >
              Contact
            </a>
            <a
              href="/privacy"
              className="hover:text-gray-400"
            >
              Privacy Policy
            </a>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            This platform provides basic SEO and web security analysis tools. Results are for guidance only.
          </p>
        </div>
      </footer>
    );
  };
  
  export default Footer;
