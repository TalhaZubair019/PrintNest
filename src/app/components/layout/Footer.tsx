import Image from "next/image";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
} from "lucide-react";
import db from "@/app/data/db.json";

function Footer() {
  const footerData = db.footer;
  const { newsletter, brand, columns, contact, bottom } = footerData;

  const socialIcons = {
    Facebook: Facebook,
    Twitter: Twitter,
    Instagram: Instagram,
    Linkedin: Linkedin,
  };

  return (
    <footer className="relative bg-[#0a0a0a] mt-32 pl-20 pr-20 pt-90 pb-12 font-sans">
      <div className="absolute left-0 right-0 -top-32 px-4 md:px-6 z-30">
        <div className="max-w-6xl mx-auto">
          <div className="relative bg-linear-to-r from-[#ff6b7a] via-[#c445f5] to-[#4a90f2] rounded-4xl p-8 md:p-12 lg:px-16 lg:py-14 shadow-2xl overflow-visible">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
              <div className="max-w-lg">
                <h2 className="text-3xl md:text-4xl lg:text-[2.5rem] font-bold text-white mb-4 leading-tight">
                  {newsletter.titlePart1}
                  <br />
                  {newsletter.titlePart2}
                </h2>
                <p className="text-white/90 mb-8 text-base md:text-lg">
                  {newsletter.description}
                </p>

                <form className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    placeholder={newsletter.placeholder}
                    className="flex-1 px-6 py-4 rounded-full bg-white/20 border border-white/30 placeholder-white/70 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-md transition-all"
                  />
                  <button className="px-8 py-4 bg-[#ff7a6e] hover:bg-[#ff6b5e] text-white font-bold rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 whitespace-nowrap text-sm cursor-pointer">
                    {newsletter.buttonText}
                  </button>
                </form>
              </div>
            </div>
            <div className="absolute -top-16 right-0 lg:right-12 w-64 h-80 md:w-80 md:h-112 z-20 hidden md:block pointer-events-none">
              <Image
                src={newsletter.modelImage}
                alt="Subscribe Model"
                fill
                className="object-contain object-bottom"
                sizes="(max-width: 768px) 100vw, 320px"
                unoptimized
              />
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 relative z-10 pt-32 lg:pt-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16 border-b border-gray-800 pb-12">
          <div className="lg:col-span-1">
            <div className="mb-6 flex items-center gap-2">
              <Image
                src={brand.logo}
                alt="Brand Logo"
                width={140}
                height={40}
                className="h-8 w-auto brightness-0 invert"
                unoptimized
              />
            </div>
            <p className="text-gray-400 text-sm mb-8 leading-relaxed">
              {brand.description}
            </p>
            <div className="flex gap-3">
              {brand.socials.map((social, idx) => {
                const Icon =
                  socialIcons[social.name as keyof typeof socialIcons];
                return (
                  <a
                    key={idx}
                    href={social.url}
                    className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center text-gray-400 hover:text-white hover:border-white hover:bg-white/10 transition-all"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>
          {columns.map((col, idx) => (
            <FooterLinkColumn key={idx} title={col.title} links={col.links} />
          ))}
          <div className="lg:col-span-1">
            <h4 className="text-white font-bold mb-6">
              {contact.title}
              <span className="block w-8 h-0.5 bg-[#ff5e14] mt-2 rounded-full"></span>
            </h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="leading-relaxed">
                {contact.address.map((line, i) => (
                  <span key={i}>
                    {line}
                    <br />
                  </span>
                ))}
              </li>
              <li className="flex items-center gap-2 group">
                <Mail className="w-4 h-4 text-[#ff5e14]" />
                <a
                  href={`mailto:${contact.email}`}
                  className="hover:text-white transition-colors"
                >
                  {contact.email}
                </a>
              </li>
              <li className="flex items-center gap-2 group">
                <Phone className="w-4 h-4 text-[#ff5e14]" />
                <a
                  href={`tel:${contact.phoneLink}`}
                  className="text-lg text-white font-medium hover:text-[#ff5e14] transition-colors"
                >
                  {contact.phone}
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm font-medium">
            {bottom.copyright}
          </p>

          <div className="flex items-center gap-2">
            {bottom.paymentMethods.map((src, idx) => (
              <div key={idx} className="bg-white rounded px-1.5 py-1">
                <Image
                  src={src}
                  alt={`Payment Method ${idx}`}
                  width={34}
                  height={20}
                  className="h-4 w-auto object-contain"
                  unoptimized
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

const FooterLinkColumn = ({
  title,
  links,
}: {
  title: string;
  links: { label: string; url: string }[];
}) => {
  return (
    <div>
      <h4 className="text-white font-bold mb-6">
        {title}
        <span className="block w-8 h-0.5 bg-[#ff5e14] mt-2 rounded-full"></span>
      </h4>
      <ul className="space-y-3 text-sm text-gray-400">
        {links.map((item) => (
          <li key={item.label}>
            <a
              href={item.url}
              className="hover:text-[#ff5e14] transition-colors inline-block"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Footer;
