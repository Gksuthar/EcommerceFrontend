import React from "react";
import { FaShippingFast, FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import { GiReturnArrow } from "react-icons/gi";
import { MdPayment } from "react-icons/md";
import { IoGiftSharp, IoChatboxEllipsesOutline } from "react-icons/io5";
import { BiSupport } from "react-icons/bi";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { BsFillThreadsFill } from "react-icons/bs";

const Footer = () => {
  return (
    <>
      <footer className="py-6 bg-white border-t-2 border-[rgba(0,0,0,0.1)]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 py-8">
            {[
              { icon: <FaShippingFast className="text-[60px] transition-all duration-300 group-hover:-translate-y-1 group-hover:text-primary" />, title: "Free shipping", description: "For all Order Over $100" },
              { icon: <GiReturnArrow className="text-[60px] transition-all duration-300 group-hover:-translate-y-1 group-hover:text-primary" />, title: "30 Days Returns", description: "For an Exchange Product" },
              { icon: <MdPayment className="text-[60px] transition-all duration-300 group-hover:-translate-y-1 group-hover:text-primary" />, title: "Secured Payment", description: "Payment Cards Accepted" },
              { icon: <IoGiftSharp className="text-[60px] transition-all duration-300 group-hover:-translate-y-1 group-hover:text-primary" />, title: "Special Gifts", description: "Our First Product Order" },
              { icon: <BiSupport className="text-[60px] transition-all duration-300 group-hover:-translate-y-1 group-hover:text-primary" />, title: "Support 24/7", description: "Contact us Anytime" }
            ].map((item, index) => (
              <div key={index} className="flex flex-col items-center justify-center text-center group">
                {item.icon}
                <h3 className="text-lg font-semibold mt-3">{item.title}</h3>
                <p className="text-sm font-medium">{item.description}</p>
              </div>
            ))}
          </div>
          <hr />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8">
            {/* Contact Us */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Contact Us</h2>
              <p className="text-sm">
                Classyshop - Mega Super Store <br /> 507-Union Trade Centre, Franc
              </p>
              <Link className="text-sm text-blue-600 hover:text-blue-800" to="mailto:sales@yourcompany.com">
                sales@yourcompany.com
              </Link>
              <span className="text-xl font-semibold text-primary block mt-4">
                (+91) 123456789
              </span>
              <div className="flex items-center gap-2">
                <IoChatboxEllipsesOutline className="text-3xl text-primary" />
                <span className="text-sm font-semibold">
                  Online Chat <br />
                  Get Expert Help
                </span>
              </div>
            </div>

            {/* Products & Company Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h2 className="text-lg font-semibold mb-4">Products</h2>
                <ul className="space-y-2">
                  {["Prices drop", "New products", "Best sales", "Contact us", "Sitemap", "Stores"].map((item, index) => (
                    <li key={index}>
                      <Link className="text-sm text-gray-500 hover:text-gray-700">{item}</Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="text-lg font-semibold mb-4">Our Company</h2>
                <ul className="space-y-2">
                  {["Delivery", "Legal Notice", "Terms and Conditions", "About Us", "Secure Payment", "Login"].map((item, index) => (
                    <li key={index}>
                      <Link className="text-sm text-gray-500 hover:text-gray-700">{item}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Newsletter */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Subscribe to Newsletter</h2>
              <p className="text-sm text-gray-500">
                Subscribe to our latest newsletter to get news about special discounts.
              </p>
              <form className="space-y-4">
                <input
                  type="text"
                  placeholder="Your email address"
                  className="w-full h-10 border rounded-md px-4 focus:border-black"
                />
                <Button className="w-full bg-primary text-white hover:bg-primary-dark btn-org">SUBMIT</Button>
                <FormControlLabel
                  control={<Checkbox size="small" />}
                  label="I agree to the terms and conditions and the privacy policy"
                  className="text-xs text-gray-500"
                />
              </form>
            </div>
          </div>
        </div>
      </footer>

      <div className="bg-white border-t border-black py-3">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <ul className="flex space-x-2">
            {[FaFacebookF, FaInstagram, FaYoutube, BsFillThreadsFill].map((Icon, index) => (
              <li key={index}>
                <Link to="/" target="_blank" className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                  <Icon className="text-lg" />
                </Link>
              </li>
            ))}
          </ul>
          <p className="text-sm text-center">© 2025 - Ecommerce software by PrestaShop™</p>
          <div className="flex space-x-2">
            {["carte_bleue", "visa", "master_card", "american_express", "paypal"].map((logo, index) => (
              <img key={index} src={`https://demos.codezeel.com/prestashop/PRS21/PRS210502/modules/cz_blockpaymentlogo/views/img/${logo}.png`} alt={logo} className="h-6" />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;