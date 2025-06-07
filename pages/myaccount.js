import React, { useEffect, useState } from 'react';

const MyAccount = () => {
  const [userData, setUserData] = useState(null);
  const [blogCount, setBlogCount] = useState(null);
  const [blogLikes, setBlogLikes] = useState(null);
  const [blogViews, setBlogViews] = useState(null);
  const [topBlogs, setTopBlogs] = useState({
    topLikes: [],
    topViews: [],
    topTrending: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Blog count
        const resCount = await fetch(`/api/blogCount`, {
          method: "GET",
          credentials: "include",
        });
        const countData = await resCount.json();
        if (countData.user) setUserData(countData.user);
        if (countData.blogs !== undefined) setBlogCount(countData.blogs);

        // Likes
        const resLikes = await fetch(`/api/blogLikes`, {
          method: "GET",
          credentials: "include",
        });
        const likesData = await resLikes.json();
        if (likesData.likesCount !== undefined) setBlogLikes(likesData.likesCount);

        // Views
        const resViews = await fetch(`/api/blogViews`, {
          method: "GET",
          credentials: "include",
        });
        const viewsData = await resViews.json();
        if (viewsData.viewsCount !== undefined) setBlogViews(viewsData.viewsCount);

        // Top Blogs
        const resTop = await fetch(`/api/topUserBlogs`, {
          method: "GET",
          credentials: "include",
        });
        const topData = await resTop.json();
        setTopBlogs(topData);
      } catch (error) {
        console.error("Error fetching account data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-white px-4 py-32">
      {userData && (
        <div className="max-w-3xl mx-auto backdrop-blur-md bg-black/10 border border-white/20 rounded-xl shadow-2xl p-8 mb-12">
          <h3 className="text-3xl font-semibold mb-2">👤 My Account</h3>
          <p className="text-black mb-6">Here's your personal information and stats.</p>
          <div className="space-y-4">
            <div className="flex justify-between border-b border-white/20 pb-2">
              <span className="text-black">User name</span>
              <span className="font-medium">{userData.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-black">Email address</span>
              <span className="font-medium">{userData.email}</span>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: 'Subscribers', value: 'Coming Soon' },
          { label: 'Views', value: blogViews ?? 0 },
          { label: 'Likes', value: blogLikes ?? 0 },
          { label: 'Uploads', value: blogCount ?? 0 },
        ].map((item, idx) => (
          <div
            key={idx}
            className="bg-black/10 backdrop-blur-md rounded-xl p-6 text-center hover:scale-105 transition-transform duration-300 border border-white/20 shadow-md"
          >
            <h6 className="text-4xl font-bold text-black">{item.value}</h6>
            <p className="text-sm mt-2 text-black uppercase tracking-wider">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Top Blogs Section */}
      {[
        { label: "Top Trending", blogs: topBlogs.topTrending },
        { label: "Most Viewed", blogs: topBlogs.topViews },
        { label: "Most Liked", blogs: topBlogs.topLikes },
      ].map((section, i) => (
        <div key={i} className="max-w-6xl mx-auto mt-16">
          <h4 className="text-2xl font-bold mb-4 text-black">{section.label}</h4>
          <div className="flex space-x-6 overflow-x-auto scrollbar-hide pb-4">
            {section.blogs.length > 0 ? (
              section.blogs.map((blog) => (
                <div
                  key={blog._id}
                  className="min-w-[240px] bg-black/10 border border-white/20 rounded-xl shadow-lg hover:scale-105 transition-transform duration-300"
                >
                  {blog.thumbnail ? (
    <img
      src={blog.thumbnail}
      alt="Thumbnail"
      className="h-64 w-full object-cover rounded-t-xl"
    />
  ) : (
    <div className="h-64 w-full object-cover rounded-t-xl text-center p-32 border-b-2 border-white">No Thumbnail</div>
  )}
                  <div className="p-4">
                    <h5 className="text-lg font-semibold text-black line-clamp-2">{blog.title}</h5>
                    <p className="text-xs text-gray-600 mt-1">{blog.metadesc?.slice(0, 60)}...</p>
                    <div className="mt-2 text-sm text-gray-500 flex justify-between">
                      <span>👍 {blog.likes || 0}</span>
                      <span>👁️ {blog.views || 0}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No blogs found.</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyAccount;
