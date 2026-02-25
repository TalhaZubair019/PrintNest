"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import db from "@/data/db.json";
import { motion } from "framer-motion";

function Testimonials() {
  const testimonialsData = db.testimonials;
  const { header, testimonials } = testimonialsData;
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsToShow = 3;
  const totalItems = testimonials.length;
  const maxIndex = totalItems - itemsToShow;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  const progressPercentage = ((currentIndex + itemsToShow) / totalItems) * 100;

  return (
    <section
      id="testimonials"
      className="scroll-mt-24 py-24 px-6 pl-20 pr-20 bg-[#f8fbff] overflow-hidden font-sans"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-[#3b82f6] font-bold tracking-[0.2em] text-xs uppercase mb-4 block"
          >
            {header.label}
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="text-5xl font-extrabold text-[#111827]"
          >
            {header.titleMain} <br />
            <span className="text-[#ff6b6b] relative inline-block mt-2">
              {header.titleHighlight}
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#ff6b6b]"></span>
            </span>
          </motion.h2>
        </div>

        <div className="relative mb-16 overflow-hidden">
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / totalItems)}%)`,
              width: `${(totalItems / itemsToShow) * 100}%`,
            }}
          >
            {testimonials.map((item, index) => (
              <div
                key={index}
                className="px-3"
                style={{ width: `${100 / totalItems}%` }}
              >
                <TestimonialCard item={item} />
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex gap-4">
            <NavButton onClick={prevSlide} icon={<ChevronLeft size={20} />} />
            <NavButton onClick={nextSlide} icon={<ChevronRight size={20} />} />
          </div>

          <div className="grow w-full h-0.5 bg-gray-200 relative overflow-hidden rounded-full">
            <div
              className="absolute left-0 top-0 h-full bg-[#1e1b4b] transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

const TestimonialCard = ({ item }: { item: any }) => {
  return (
    <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-xl transition-all duration-300 group">
      <div className="flex items-center gap-4 mb-8">
        <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h4 className="font-bold text-[#111827] leading-none">{item.name}</h4>
          <p className="text-gray-400 text-sm mt-1">{item.role}</p>
        </div>
      </div>
      <p className="text-gray-600 leading-relaxed mb-10 grow">
        "{item.content}"
      </p>
      <div className="flex justify-between items-center mt-auto">
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={18} fill="#FFB800" className="text-[#FFB800]" />
          ))}
        </div>
        <Quote
          size={32}
          className="text-[#111827] rotate-180 opacity-80 group-hover:text-[#3b82f6] transition-colors"
        />
      </div>
    </div>
  );
};

const NavButton = ({
  onClick,
  icon,
}: {
  onClick: () => void;
  icon: React.ReactNode;
}) => {
  return (
    <button
      onClick={onClick}
      className="w-12 h-12 rounded-full border border-[#1e1b4b] flex items-center justify-center text-[#1e1b4b] hover:bg-[#1e1b4b] hover:text-white transition-all active:scale-95 cursor-pointer"
    >
      {icon}
    </button>
  );
};

export default Testimonials;

