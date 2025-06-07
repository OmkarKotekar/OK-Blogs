import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function Home({ initialBlogs }) {
  const [categories, setCategories] = useState([]);
  const [creators, setCreators] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        const data = await response.json();
        setCategories(data.categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    const fetchCreators = async () => {
      try {
        const response = await fetch('/api/creators');
        const data = await response.json();
        setCreators(data.creators);
      } catch (error) {
        console.error('Error fetching creators:', error);
      }
    };

    fetchCategories();
    fetchCreators();
  }, []);

  return (
    <main
      className={`${inter.className} bg-gradient-to-b from-indigo-600 via-purple-700 to-pink-600 min-h-screen pt-36 px-8 md:px-20 pb-20 text-white`}
    >
      {/* Categories Section */}
      <section>
        <h1 className="text-4xl md:text-5xl font-bold mb-12 select-none">Explore Categories</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <Link href={`/bloglist?category`}>
            <div className="modern-card">All</div>
          </Link>
          {categories.map((category) => (
            <Link key={category} href={`/bloglist?category=${category}`}>
              <div className="modern-card capitalize">{category}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Creators Section */}
      <section className="mt-24">
        <h1 className="text-4xl md:text-5xl font-bold mb-12 select-none">Popular Creators</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {creators.map((creator) => (
            <Link key={creator} href={`/creatorPage?createdBy=${creator}`}>
              <div className="modern-card capitalize">{creator}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Styles */}
      <style jsx>{`
        .modern-card {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 1rem;
          padding: 2rem 1.5rem;
          text-align: center;
          font-weight: 600;
          font-size: 1.1rem;
          color: #ffffff;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(8px);
          transition: all 0.3s ease-in-out;
          cursor: pointer;
        }

        .modern-card:hover {
          transform: translateY(-6px) scale(1.05);
          box-shadow: 0 16px 28px rgba(0, 0, 0, 0.2);
          background-color: rgba(255, 255, 255, 0.2);
          color: #22d3ee;
        }
      `}</style>
    </main>
  );
}
