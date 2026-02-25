"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import db from "@/data/db.json";

interface BlogPost {
  id: number;
  title: string;
  image: string;
  author: {
    name: string;
    avatar: string;
  };
  date: string;
  readTime: string;
}

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        const response = await fetch("/api/public/content?section=blog");
        const data = await response.json();

        const foundPost = data.posts.find(
          (p: BlogPost) => p.title.toLowerCase().replace(/\s+/g, "-") === slug,
        );

        setPost(foundPost || null);
      } catch (error) {
        console.error("Failed to fetch blog post:", error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchBlogPost();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-slate-400">Loading...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Post not found</h1>
          <Link href="/" className="text-purple-600 hover:underline">
            Return to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <article className="relative min-h-screen bg-white font-sans text-slate-800">
      <div className="absolute top-0 left-0 w-full h-175 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-linear-to-b from-amber-50/50 via-teal-50/30 to-white z-10 mix-blend-multiply" />
        <Image
          src={db.shop.backgroundImage}
          alt="Background"
          fill
          className="object-fill opacity-80"
          priority
        />
        <div className="absolute bottom-0 w-full h-32 bg-linear-to-t from-white to-transparent z-20" />
      </div>

      <div className="relative z-10 pt-80">
        <div className="w-full pb-10 flex flex-col items-center justify-center px-4 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight mb-4 max-w-4xl">
            {post.title}
          </h1>
          <div className="h-1.5 w-20 bg-linear-to-r from-purple-500 to-teal-400 rounded-full mb-10"></div>
          <div className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 bg-white px-6 py-2.5 rounded-full shadow-sm border border-slate-100">
            <Link href="/" className="hover:text-purple-600 transition-colors">
              Home
            </Link>
            <div className="flex text-purple-400">
              <ChevronRight size={14} strokeWidth={2.5} />
              <ChevronRight size={14} className="-ml-2" strokeWidth={2.5} />
            </div>
            <Link
              href="/#blog"
              className="hover:text-purple-600 transition-colors"
            >
              Blog
            </Link>
            <div className="flex text-purple-400">
              <ChevronRight size={14} strokeWidth={2.5} />
              <ChevronRight size={14} className="-ml-2" strokeWidth={2.5} />
            </div>
            <span className="text-slate-900 truncate max-w-[150px]">
              {post.title}
            </span>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-4 pb-32 mt-12">
          <div className="relative w-auto h-96 rounded-2xl overflow-hidden mb-12 shadow-lg">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-contain"
              priority
            />
          </div>

          <div className="flex items-center gap-4 text-gray-600 mb-8 pb-8 border-b border-slate-100">
            <Image
              src={post.author.avatar}
              alt={post.author.name}
              width={50}
              height={50}
              className="rounded-full border border-slate-200"
            />
            <div>
              <p className="font-bold text-slate-900">{post.author.name}</p>
              <p className="text-sm text-slate-500">
                {post.date} • {post.readTime}
              </p>
            </div>
          </div>

          <div className="prose prose-lg prose-slate max-w-none">
            <p className="text-slate-600 leading-relaxed mb-6">
              This is an exciting article about print design and customization
              trends. Our team of experts shares insights on how to choose the
              right materials and techniques for your printing projects.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">
              Key Takeaways
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-slate-600 marker:text-purple-500">
              <li>Quality materials make a difference in print longevity</li>
              <li>Personalization increases customer engagement</li>
              <li>Modern printing techniques offer endless possibilities</li>
              <li>Brand consistency is crucial for professional appearance</li>
            </ul>

            <p className="text-slate-600 leading-relaxed mt-6">
              Whether you're starting a business or enhancing your brand,
              understanding these principles will help you make informed
              decisions about your printing needs.
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
