import React from "react";

import Contact from "@/app/components/Contact";

const Footer: React.FC = () => {
  const date = new Date();
  const year = date.getFullYear();

  return (
    <footer className="footer">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="footer-copywright">
            <h3>
              Made with <span className="text-red-500 heart">❤️</span> @{" "}
              <span className="font-serif">Himanshu Raj</span>
            </h3>
          </div>
          <div className="footer-copywright">
            <h3>Copyright © {year}</h3>
          </div>
          <Contact />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
