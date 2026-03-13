"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import db from "@data/db.json";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  breadcrumb?: string;
  breadcrumbs?: BreadcrumbItem[];
  backgroundImage?: string;
  unoptimized?: boolean;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  breadcrumb,
  breadcrumbs,
  backgroundImage,
  unoptimized,
}) => {
  const finalBreadcrumbs: BreadcrumbItem[] = breadcrumbs || [
    { label: breadcrumb || title },
  ];

  return (
    <div className="relative w-full h-[300px] sm:h-[450px] lg:h-175 z-0">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute inset-0 bg-linear-to-b from-amber-50/50 via-teal-50/30 to-white z-10 mix-blend-multiply" />
        <Image
          src={backgroundImage || db.shop.backgroundImage}
          alt="Background"
          fill
          className="object-fill opacity-80"
          priority
          unoptimized={unoptimized}
        />
        <div className="absolute bottom-0 w-full h-32 bg-linear-to-t from-white to-transparent z-20" />
      </div>

      <div className="relative z-10 pt-32 sm:pt-60 lg:pt-80 flex flex-col items-center justify-center pb-10">
        <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-slate-900 tracking-tight mb-4 capitalize">
          {title}
        </h1>
        <div className="h-1.5 w-20 bg-linear-to-r from-purple-500 to-teal-400 rounded-full mb-10"></div>
        <div className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 bg-white px-6 py-2.5 rounded-full shadow-sm border border-slate-100">
          <Link href="/" className="hover:text-purple-600 transition-colors">
            Home
          </Link>
          {finalBreadcrumbs.map((item, index) => (
            <React.Fragment key={index}>
              <div className="flex text-purple-400">
                <ChevronRight size={14} strokeWidth={2.5} />
                <ChevronRight size={14} className="-ml-2" strokeWidth={2.5} />
              </div>
              {item.href ? (
                <Link
                  href={item.href}
                  className="hover:text-purple-600 transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-slate-900">{item.label}</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
