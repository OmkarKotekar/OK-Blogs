import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import LazyLoad from 'react-lazyload';
import Cookies from 'js-cookie';

const UserBlogList = () => {
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [blogsToShow, setBlogsToShow] = useState(5);
  const [user, setUser] = useState(null);
  const [sortBy, setSortBy] = useState('createdAt');

  useEffect(() => {
    const fetchUserBlogs = async () => {
      const token = Cookies.get('token');
      if (!token) return;
      console.log('Fetching user blogs with token:', token);

      try {
        const res = await fetch(`/api/getUserBlogs?sortBy=${sortBy}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();
        if (res.ok) {
          setUser(data.user);
          setFilteredBlogs(data.blogs);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Error fetching user blogs:', err);
      }
    };

    fetchUserBlogs();
  }, [sortBy]);

  const handleLoadMore = () => setBlogsToShow((prev) => prev + 5);

  return (
    <>
      {!user ? (
        <div className="text-center text-lg mt-32 text-gray-700">Login First</div>
      ) : (
        <div className="mt-32 px-6 md:px-20">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-3xl font-bold">My Blogs</h2>
            <select
              className="border px-4 py-2 rounded-md text-gray-700"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="createdAt">Newest</option>
              <option value="views">Most Viewed</option>
              <option value="likes">Most Liked</option>
              <option value="trending">Top Trending</option>
            </select>
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

          {blogsToShow < filteredBlogs.length && (
            <div className="flex justify-center mt-8">
              <button
                onClick={handleLoadMore}
                className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded"
              >
                Load More
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default UserBlogList;
