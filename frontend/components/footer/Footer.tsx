import Image from "next/image";
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";
import { MapPin, Phone, Mail, ArrowRight } from "lucide-react";
import logoImg from "../../public/images/logo-2.png"; 

export default function Footer() {
  return (
    <footer className="bg-[#ffffff] text-[#4a2c2a] pt-16 font-sans border-t-2 border-gray-300">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        
        {/* TOP SECTION: Info & Map */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16 items-stretch border-t border-b border-gray-200 py-10">
          
          {/* Left Side: Brand & Contact */}
          <div className="flex flex-col pr-8">
            <div className="mb-6">
              <Image
                src={logoImg}
                alt="Logo"
                className="w-auto h-[65px] object-contain" 
              />
            </div>
            <p className="text-[16px] text-[#4a2c2a]/80 mb-8 max-w-[400px] font-bold leading-relaxed">
              Factory-price tiles for floors, walls and outdoor spaces, delivered across the UK.
            </p>

            <div className="flex flex-col space-y-4 mb-8">
              <div className="flex items-start gap-4">
                <MapPin className="text-[#ea7d32] mt-0.5" size={18} />
                <p className="text-[14px] font-bold text-[#4a2c2a] leading-relaxed">
                  Unit 10, Slough Interchange Industrial Estate,<br />
                  Whittenham Close, Slough SL2 5EP
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Phone className="text-[#ea7d32]" size={18} />
                <p className="text-[14px] font-bold text-[#4a2c2a]">
                  +44 7424 252426
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Mail className="text-[#ea7d32]" size={18} />
                <p className="text-[14px] font-bold text-[#4a2c2a]">
                  info@tilebazaar.co.uk
                </p>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex gap-4">
              <Link href="https://www.facebook.com/profile.php?id=61583916478359" target="_blank" className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-[#4a2c2a] hover:bg-gray-100 hover:border-gray-400 transition-all">
                <FaFacebookF size={16} />
              </Link>
              <Link href="https://www.instagram.com/tile_bazaar?igsh=dHF5YW16MTg2Y2k2&utm_source=qr" target="_blank" className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-[#4a2c2a] hover:bg-gray-100 hover:border-gray-400 transition-all">
                <FaInstagram size={16} />
              </Link>
              <Link href="https://www.tiktok.com/@tile.bazaar?_r=1&_t=ZN-950WtUKmfqQ" target="_blank" className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-[#4a2c2a] hover:bg-gray-100 hover:border-gray-400 transition-all">
                <FaTiktok size={16} />
              </Link>
            </div>
          </div>

          {/* Right Side: Actual Google Map */}
          <div className="bg-gray-100 rounded-sm overflow-hidden relative min-h-[300px] border border-gray-200">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2483.5682855581134!2d-0.5898083!3d51.5120359!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487664db8b8e0001%3A0x7d6f582f3775f78a!2sWhittenham%20Cl%2C%20Slough%20SL2%205EG%2C%20UK!5e0!3m2!1sen!2sin!4v1711200000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

        {/* MIDDLE SECTION: Navigation Links */}
        <div className="border-t border-gray-200 pt-12 pb-12">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            
            {/* Column 1: Application */}
            <div>
              <h4 className="text-[12px] font-black tracking-widest text-[#ea7d32] mb-6 uppercase">Application</h4>
              <ul className="space-y-4">
                <li><Link href="/products?placement=floor" className="text-[14px] font-bold text-[#4a2c2a]/80 hover:text-[#ea7d32] transition-colors">Floor tiles</Link></li>
                <li><Link href="/products?placement=wall" className="text-[14px] font-bold text-[#4a2c2a]/80 hover:text-[#ea7d32] transition-colors">Wall tiles</Link></li>
                <li><Link href="/products?placement=bathroom" className="text-[14px] font-bold text-[#4a2c2a]/80 hover:text-[#ea7d32] transition-colors">Bathroom</Link></li>
                <li><Link href="/products?placement=kitchen" className="text-[14px] font-bold text-[#4a2c2a]/80 hover:text-[#ea7d32] transition-colors">Kitchen</Link></li>
                <li><Link href="/products?placement=outdoor" className="text-[14px] font-bold text-[#4a2c2a]/80 hover:text-[#ea7d32] transition-colors">Outdoor</Link></li>
                <li><Link href="/products?placement=poster" className="text-[14px] font-bold text-[#4a2c2a]/80 hover:text-[#ea7d32] transition-colors">Poster tiles</Link></li>
              </ul>
            </div>

            {/* Column 2: Size */}
            <div>
              <h4 className="text-[12px] font-black tracking-widest text-[#ea7d32] mb-6 uppercase">Size</h4>
              <ul className="space-y-4">
                <li><Link href="/products" className="text-[14px] font-bold text-[#4a2c2a]/80 hover:text-[#ea7d32] transition-colors">All sizes</Link></li>
                <li><Link href="/products?size=300x600" className="text-[14px] font-bold text-[#4a2c2a]/80 hover:text-[#ea7d32] transition-colors">300x600</Link></li>
                <li><Link href="/products?size=600x600" className="text-[14px] font-bold text-[#4a2c2a]/80 hover:text-[#ea7d32] transition-colors">600x600</Link></li>
                <li><Link href="/products?size=600x1200" className="text-[14px] font-bold text-[#4a2c2a]/80 hover:text-[#ea7d32] transition-colors">600x1200</Link></li>
                <li><Link href="/products?size=1200x1200" className="text-[14px] font-bold text-[#4a2c2a]/80 hover:text-[#ea7d32] transition-colors">1200x1200</Link></li>
              </ul>
            </div>

            {/* Column 3: Finish */}
            <div>
              <h4 className="text-[12px] font-black tracking-widest text-[#ea7d32] mb-6 uppercase">Finish</h4>
              <ul className="space-y-4">
                <li><Link href="/products" className="text-[14px] font-bold text-[#4a2c2a]/80 hover:text-[#ea7d32] transition-colors">All finishes</Link></li>
                <li><Link href="/products?finish=glossy" className="text-[14px] font-bold text-[#4a2c2a]/80 hover:text-[#ea7d32] transition-colors">Glossy</Link></li>
                <li><Link href="/products?finish=high-gloss" className="text-[14px] font-bold text-[#4a2c2a]/80 hover:text-[#ea7d32] transition-colors">High gloss</Link></li>
                <li><Link href="/products?finish=matt" className="text-[14px] font-bold text-[#4a2c2a]/80 hover:text-[#ea7d32] transition-colors">Matt</Link></li>
                <li><Link href="/products?finish=carving" className="text-[14px] font-bold text-[#4a2c2a]/80 hover:text-[#ea7d32] transition-colors">Carving</Link></li>
                <li><Link href="/products?finish=new" className="text-[14px] font-bold text-[#4a2c2a] transition-colors">New arrivals</Link></li>
                <li><Link href="/products?finish=soon" className="text-[14px] font-bold text-[#4a2c2a]/80 hover:text-[#ea7d32] transition-colors">Coming soon</Link></li>
              </ul>
            </div>

            {/* Column 4: Accessories */}
            <div>
              <h4 className="text-[12px] font-black tracking-widest text-[#ea7d32] mb-6 uppercase">Accessories</h4>
              <ul className="space-y-4">
                <li><Link href="/products?size=accessories" className="text-[14px] font-bold text-[#4a2c2a]/80 hover:text-[#ea7d32] transition-colors">All types</Link></li>
                <li><Link href="/products?size=accessories" className="text-[14px] font-bold text-[#4a2c2a]/80 hover:text-[#ea7d32] transition-colors">Tile trims</Link></li>
                <li><Link href="/products?size=accessories" className="text-[14px] font-bold text-[#4a2c2a]/80 hover:text-[#ea7d32] transition-colors">Spacers</Link></li>
                <li><Link href="/products?size=accessories" className="text-[14px] font-bold text-[#4a2c2a]/80 hover:text-[#ea7d32] transition-colors">Wedges</Link></li>
                <li><Link href="/products?size=accessories" className="text-[14px] font-bold text-[#4a2c2a]/80 hover:text-[#ea7d32] transition-colors">Adhesive bags</Link></li>
                <li><Link href="/products?size=accessories" className="text-[14px] font-bold text-[#4a2c2a]/80 hover:text-[#ea7d32] transition-colors">Dura elite matting</Link></li>
              </ul>
            </div>

            {/* Column 5: Pages */}
            <div className="lg:border-l lg:border-gray-300 lg:pl-8">
              <h4 className="text-[12px] font-black tracking-widest text-[#ea7d32] mb-6 uppercase">Pages</h4>
              <ul className="space-y-4">
                <li><Link href="/" className="text-[14px] font-bold text-[#4a2c2a]/80 hover:text-[#ea7d32] transition-colors">Home</Link></li>
                <li><Link href="/about" className="text-[14px] font-bold text-[#4a2c2a]/80 hover:text-[#ea7d32] transition-colors">About us</Link></li>
                <li><Link href="/products" className="text-[14px] font-bold text-[#4a2c2a]/80 hover:text-[#ea7d32] transition-colors">Products</Link></li>
              </ul>
            </div>

            {/* Column 6: Policies */}
            <div>
              <h4 className="text-[12px] font-black tracking-widest text-[#ea7d32] mb-6 uppercase">Policies</h4>
              <ul className="space-y-4">
                <li><Link href="/policies/privacy-policy" className="text-[14px] font-bold text-[#4a2c2a]/80 hover:text-[#ea7d32] transition-colors">Privacy</Link></li>
                <li><Link href="/policies/refund-policy" className="text-[14px] font-bold text-[#4a2c2a]/80 hover:text-[#ea7d32] transition-colors">Refunds</Link></li>
                <li><Link href="/policies/terms-of-service" className="text-[14px] font-bold text-[#4a2c2a]/80 hover:text-[#ea7d32] transition-colors">Terms</Link></li>
                <li><Link href="/policies/contact-information" className="text-[14px] font-bold text-[#4a2c2a]/80 hover:text-[#ea7d32] transition-colors">Contact info</Link></li>
                <li><Link href="/policies/shipping-policy" className="text-[14px] font-bold text-[#4a2c2a]/80 hover:text-[#ea7d32] transition-colors">Shipping</Link></li>
              </ul>
            </div>

          </div>
          
          {/* Browse all tiles button */}
          <div className="flex justify-center mt-12">
            <Link href="/products" className="flex items-center gap-3 bg-[#4a2c2a] text-white px-8 py-3.5 rounded-sm font-bold text-[13px] hover:bg-[#3d2422] transition-colors shadow-md">
              Browse all tiles <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* BOTTOM SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-center border-t border-gray-200 py-8">
          
          {/* Newsletter */}
          <div className="flex w-full md:max-w-[400px] rounded-sm overflow-hidden mb-6 md:mb-0 border border-gray-300 shadow-sm">
            <input
              type="email"
              placeholder="name@company.com"
              className="bg-white text-[#4a2c2a] flex-grow px-4 py-3 outline-none text-[13px] placeholder:text-gray-400 border-r border-gray-300 focus:bg-gray-50 transition-colors"
            />
            <button className="bg-[#ea7d32] text-white px-6 py-3 text-[13px] font-bold hover:bg-[#d56b27] transition-colors">
              Subscribe
            </button>
          </div>

          <div className="text-[12px] font-bold text-[#4a2c2a]/70">
            © 2026 Tile Bazaar. All rights reserved.
          </div>
          
        </div>
      </div>
    </footer>
  );
}
