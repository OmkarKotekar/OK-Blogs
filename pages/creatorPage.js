import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Blog from '../models/Blog';
import User from '../models/User'; // Assuming you have a User model
import mongoose from 'mongoose';
import LazyLoad from 'react-lazyload';
import Cookies from 'js-cookie';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Blogs = ({ initialBlogs, category, createdBy, subscriberCount }) => {
  const [selectedCategory, setSelectedCategory] = useState(category || '');
  const [categories, setCategories] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState(initialBlogs);
  const [blogsToShow, setBlogsToShow] = useState(5);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
    checkSubscriptionStatus();
  }, [createdBy]);

  const formatNumber = (num) => {
  if (num >= 1e6) return (num / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(1).replace(/\.0$/, '') + 'k';
  return num.toString();
};

  const fetchCategories = async () => {
    try {
      const url = createdBy
        ? `/api/categoriesCreator?createdBy=${encodeURIComponent(createdBy)}`
        : '/api/categoriesCreator';
      const res = await fetch(url);
      const data = await res.json();
      setCategories(data.categories);
    } catch (err) {
      console.error('Failed to fetch categories', err);
    }
  };

  const checkSubscriptionStatus = async () => {
    try {
      const token = Cookies.get('token');
      if (!token) return;

      const res = await fetch('/api/checkSubscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, creatorUsername: createdBy }),
      });

      const data = await res.json();
      if (res.ok) setIsSubscribed(data.isSubscribed);
    } catch (err) {
      console.error('Failed to check subscription', err);
    }
  };

  const handleSubscribeToggle = async () => {
    const token = Cookies.get('token');
    if (!token) {
      toast.warn('You need to log in first.');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, creatorUsername: createdBy }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setIsSubscribed(data.isSubscribed);
      toast.success(data.message);
    } catch (err) {
      toast.error(err.message || 'Subscription failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => setBlogsToShow((prev) => prev + 5);

  const handleCategoryChange = async (e) => {
    const newCategory = e.target.value;
    setSelectedCategory(newCategory);

    try {
      let url = '/api/getBlogs';
      if (newCategory) url += `?category=${encodeURIComponent(newCategory)}`;
      const res = await fetch(url);
      const data = await res.json();
      setFilteredBlogs(data.blogs);
    } catch (err) {
      console.error('Error fetching blogs by category:', err);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" />
      <div className="w-full relative mb-12">
        <div className="w-full h-48 md:h-64 bg-gradient-to-r from-blue-700 to-purple-800 rounded-xl shadow-lg" />
        <div className="flex flex-col sm:flex-row items-center justify-between px-6 -mt-14 sm:-mt-20 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 bg-gray-300 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-3xl font-bold text-white">
              {(createdBy || category || 'C')[0].toUpperCase()}
            </div>
            <div>
              <h2 className="text-3xl font-semibold text-white capitalize">{createdBy || category || 'Creator'}</h2>
              <p className="text-gray-300 text-sm mt-1">
  {formatNumber(subscriberCount)} subscribers
</p>

            </div>
          </div>
          <button
            onClick={handleSubscribeToggle}
            className={`mt-4 sm:mt-0 px-6 py-2 font-semibold rounded-full shadow-lg transition duration-300 
              ${isSubscribed ? 'bg-gray-300 text-black hover:bg-gray-400' : 'bg-red-600 text-white hover:bg-red-700'}
              ${loading ? 'opacity-60 cursor-not-allowed' : ''}
            `}
            disabled={loading}
          >
            {loading ? 'Processing...' : isSubscribed ? 'Subscribed' : 'Subscribe'}
          </button>
        </div>
      </div>

      <div className="mb-8 px-6">
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="p-2 rounded border border-gray-400"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6 px-8">
        <div className="Blogs">
          <div className="text-3xl font-bold uppercase text-center mb-6">
            {selectedCategory ? `${selectedCategory} Blogs` : 'All Blogs'}
          </div>

          <div className="flex flex-col gap-6">
            {filteredBlogs.slice(0, blogsToShow).map((item) => (
              <LazyLoad key={item._id} height={200} offset={5}>
                <Link
                  href={`/blogpost/${item.slug}`}
                  className="flex items-start gap-6 p-4 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-200 backdrop-blur border border-white/20 shadow-md"
                >
                  <div className="w-[300px] h-[180px] bg-gray-700 rounded-lg overflow-hidden flex items-center justify-center">
  {item.thumbnail ? (
    <img
      src={item.thumbnail}
      alt="Thumbnail"
      className="w-full h-full object-cover"
    />
  ) : (
    <div className="text-white text-sm">No Thumbnail</div>
  )}
</div>

                  <div className="flex flex-col justify-start max-w-[65%]">
                    <div className="text-xl font-semibold line-clamp-2">{item.title}</div>
                    <div className="text-sm opacity-60 mt-1">{new Date(item.createdAt).toDateString()}</div>
                    <div className="text-base opacity-80 mt-2 line-clamp-2">{item.metadesc}</div>
                    <div className="text-xs mt-2 opacity-50">By {item.createdBy}</div>
                  </div>
                </Link>
              </LazyLoad>
            ))}
          </div>

          <div className="flex justify-center mt-8">
            {blogsToShow < filteredBlogs.length && (
              <button
                onClick={handleLoadMore}
                className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded"
              >
                Load More
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps(context) {

  const { createdBy = '', category = '' } = context.query;

  if (!mongoose.connections[0].readyState) {
    await mongoose.connect(process.env.MONGO_URI);
  }
  let subscriberCount = 0;

if (createdBy) {
  const user = await User.findOne({ username: createdBy }).select('subscribers');
  subscriberCount = user?.subscribers || 0;
}


  let blogs;

  if (createdBy) {
    blogs = await Blog.find({ createdBy }).select('title slug metadesc createdAt createdBy images thumbnail');
  } else if (category) {
    blogs = await Blog.find({ category }).select('title slug metadesc createdAt createdBy images thumbnail');
  } else {
    blogs = await Blog.find().select('title slug metadesc createdAt createdBy images thumbnail');
  }

  return {
    props: {
      initialBlogs: JSON.parse(JSON.stringify(blogs)),
      category,
      createdBy,
      subscriberCount
    },
  };
}

export default Blogs;
