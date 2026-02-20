"use client";

import db from "@/app/data/db.json";
import {
  Play,
  MousePointer2,
  PencilLine,
  Printer,
  HelpCircle,
} from "lucide-react";
import { motion } from "framer-motion";

function HowItWorks() {
  const howItWorksData = db.howitworks;
  const {
    sectionLabel,
    headingMain,
    headingHighlight,
    assets,
    steps,
    footerContent,
  } = howItWorksData;

  return (
    <section className="py-20 lg:py-32 bg-[#F8FAFC] overflow-hidden font-sans">
      <div className="container mx-auto px-4 max-w-7xl relative">
        <div className="max-w-3xl mb-16 lg:mb-24 relative z-10">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-base text-blue-900 uppercase mb-3"
          >
            {sectionLabel}
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-2xl lg:text-5xl font-medium text-slate-900 leading-[1.15]"
          >
            {headingMain} <br />
            <span className="relative inline-block text-[#FF7F7F] mt-2 pb-2 border-b-4 border-[#FF7F7F] rounded-sm">
              {headingHighlight}
            </span>
          </motion.h2>
        </div>

        <div className="relative lg:h-200 w-full flex flex-col gap-10 lg:block">
          <div className="hidden lg:block absolute top-[5%] left-[22%] w-[20%] z-0 pointer-events-none select-none">
            <img
              src={assets.arrowOne}
              alt=""
              className="w-full h-auto object-contain opacity-80"
            />
          </div>
          <div className="hidden lg:block absolute top-[36%] left-[24%] w-[18%] z-0 pointer-events-none select-none">
            <img
              src={assets.arrowTwo}
              alt=""
              className="w-full h-auto object-contain opacity-80"
            />
          </div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 20,
              ease: "linear",
            }}
            className="hidden lg:block absolute top-[40%] right-[8%] w-[10%] z-0 pointer-events-none select-none"
          >
            <img
              src="https://themexriver.com/wp/printnest/wp-content/uploads/2025/12/p1-bg-illus-1.webp"
              alt="Background decoration"
              className="w-full h-auto object-contain"
            />
          </motion.div>
          {steps.map((step) => (
            <StepCard key={step.id} data={step} />
          ))}

          <div className="lg:absolute lg:top-145 lg:right-[5%] lg:max-w-112.5 text-center lg:text-left z-20 mt-10 lg:mt-0">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-slate-500 text-lg leading-relaxed mb-8"
            >
              {footerContent.text}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.8,
                delay: 0.6,
                type: "spring",
                bounce: 0.4,
              }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6"
            >
              <motion.button
                className="relative group cursor-pointer outline-none border-none bg-transparent p-0"
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, type: "spring" }}
              >
                <span
                  className="absolute inset-0 rounded-full border-2 border-transparent translate-x-1.5 translate-y-1.5 transition-transform duration-200 ease-in-out group-hover:translate-x-0 group-hover:translate-y-0 [background:linear-gradient(white,white)_padding-box,linear-gradient(to_right,#7f22fe,#26C6DA)_border-box] mask[linear-gradient(#fff_0_0)_padding-box,linear-gradient(#fff_0_0)] mask-exclude"
                  style={{
                    background:
                      "linear-gradient(to right, #7f22fe, #26C6DA) border-box",
                    WebkitMask:
                      "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "destination-out",
                    maskComposite: "exclude",
                  }}
                  aria-hidden="true"
                />
                <span className="relative block px-10 py-4 rounded-full bg-linear-to-r from-[#7f22fe] to-[#26C6DA] text-lg font-bold text-white transition-transform duration-200 ease-in-out group-active:scale-95">
                  {footerContent.btnText}
                </span>
              </motion.button>

              <button className="flex items-center gap-3 group cursor-pointer">
                <div className="w-14 h-14 flex items-center justify-center relative">
                  <div className="w-full h-full rounded-full border border-red-300 absolute"></div>
                  <div className="w-10 h-10 bg-[#FF6B6B] rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform z-10">
                    <Play
                      size={16}
                      fill="white"
                      className="text-white ml-0.5"
                    />
                  </div>
                </div>
                <span className="font-bold text-lg text-slate-800 group-hover:text-blue-600 transition-colors">
                  {footerContent.videoText}
                </span>
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

const iconMap: Record<string, any> = {
  MousePointer2,
  PencilLine,
  Printer,
};

const resolveIcon = (icon: any) => {
  if (!icon) return HelpCircle;
  if (typeof icon === "string") {
    return (iconMap as any)[icon] ?? HelpCircle;
  }
  return icon;
};

const StepCard = ({ data }: { data: any }) => {
  const Icon = resolveIcon(data.icon);
  const { bg, hoverBorder, hoverShadow, iconBg, iconShadow } = data.theme;
  const iconBounceVariant: any = {
    rest: { y: 0 },
    hover: {
      y: [0, -20, 0, -10, 0, -5, 0],
      transition: {
        duration: 1.5,
        ease: "easeInOut",
        times: [0, 0.2, 0.5, 0.7, 0.85, 0.95, 1],
      },
    },
  };

  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      animate="rest"
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      style={{ opacity: 0, scale: 0.9 }}
      className={`
        lg:absolute w-full lg:w-[320px] p-10 rounded-4xl border border-transparent transition-all duration-300 text-center z-10 group cursor-pointer
        ${data.positionClass} 
        ${bg} ${hoverBorder} ${hoverShadow}
      `}
    >
      <div
        className={`
        w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center text-white shadow-lg border-8 border-white ${iconBg} ${iconShadow} group-hover:scale-110 transition-transform duration-300`}
      >
        <motion.div variants={iconBounceVariant}>
          <Icon size={36} strokeWidth={1.5} />
        </motion.div>
      </div>

      <h3 className="text-xl font-bold text-slate-900 mb-4">{data.title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">
        {data.description}
      </p>
    </motion.div>
  );
};

export default HowItWorks;
