import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Blog from '../models/Blog';
import mongoose from 'mongoose';
import { useRouter } from 'next/router';
import LazyLoad from 'react-lazyload';

const Blogs = ({ initialBlogs }) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState(initialBlogs);
  const [blogsToShow, setBlogsToShow] = useState(10);

  const router = useRouter();
  const { category: queryCategory } = router.query;

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

    fetchCategories();
    setSelectedCategory(queryCategory || '');
  }, [queryCategory]);

  const handleLoadMore = () => {
    setBlogsToShow(blogsToShow + 10);
  };

  const handleCategoryChange = async (event) => {
    const newCategory = event.target.value;
    setSelectedCategory(newCategory);

    try {
      const url =
        newCategory === ''
          ? '/api/getBlogs?category'
          : `/api/getBlogs?category=${encodeURIComponent(newCategory)}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      setFilteredBlogs(data.blogs);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };

  return (
    <div className="max-w-[1024px] mx-auto px-6 mt-28">
      {/* Header with category select and title */}
      <div className="flex justify-between items-center mb-8">
        <select
          className="bg-white text-gray-800 px-4 py-2 rounded-md shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          <option value="" key="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        <h2 className="text-3xl font-semibold text-gray-900 uppercase tracking-wide flex-grow text-center">
          {selectedCategory ? `${selectedCategory} Blogs` : 'All Blogs'}
        </h2>
        <div style={{ width: 150 }} /> {/* spacer */}
      </div>

      {/* Blog list */}
      <div className="flex flex-col gap-6">
        {filteredBlogs.slice(0, blogsToShow).map((item) => (
          <LazyLoad key={item._id} height={100} offset={150} once>
            <Link
              href={`/blogpost/${item.slug}`}
              className="flex items-center gap-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer p-4"
              aria-label={`Read blog post titled ${item.title}`}
            >
              {/* Thumbnail */}
              <div className="flex-shrink-0 w-[168px] h-[94px] rounded-md bg-gray-200 overflow-hidden relative">
  {item.thumbnail ? (
    <img
      src={item.thumbnail}
      alt={`Thumbnail for ${item.title}`}
      className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
      loading="lazy"
      width={168}
      height={94}
    />
  ) : (
    <div className="flex flex-col items-center justify-center h-full text-green-600 opacity-70 select-none">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-10 w-10 mb-1"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-9 4v8"
        />
      </svg>
      <span className="text-sm font-medium">No Thumbnail</span>
    </div>
  )}
</div>


              {/* Text content */}
              <div className="flex flex-col justify-between flex-grow overflow-hidden">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{item.title}</h3>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.metadesc}</p>
                <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                  <span>By {item.createdBy}</span>
                  <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </Link>
          </LazyLoad>
        ))}
      </div>

      {/* Load more button */}
      {blogsToShow < filteredBlogs.length && (
        <div className="flex justify-center mt-10">
          <button
            onClick={handleLoadMore}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-colors"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export async function getServerSideProps(context) {
  if (!mongoose.connections[0].readyState) {
    await mongoose.connect(process.env.MONGO_URI);
  }

  const { category } = context.query;
  let blogs;

  if (category == '') {
    blogs = await Blog.find();
  } else {
    blogs = await Blog.find({ category });
  }

  return {
    props: { initialBlogs: JSON.parse(JSON.stringify(blogs)) },
  };
}

export default Blogs;
