import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { MdAccountCircle } from 'react-icons/md';
import { useRouter } from 'next/router';
import jwtDecode from 'jwt-decode';

const Navbar = ({ logout, user }) => {
  const [dropdown, setDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userBlogsLink, setUserBlogsLink] = useState('/userbloglist');
  const router = useRouter();

  useEffect(() => {
    if (user && user.value) {
      try {
        const decodedToken = jwtDecode(user.value);
        const username = decodedToken.name;
        if (username) setUserBlogsLink(`/userbloglist?createdBy=${username}`);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <>
      <header className="bg-gradient-to-r from-indigo-600 via-purple-700 to-pink-600 text-white px-6 py-4 shadow-lg font-inter fixed w-full z-50 top-0">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <div className="cursor-pointer flex items-center space-x-2">
              <Image src="/favicon.svg" alt="OK BLOGS" width={160} height={100} className="rounded-full" />
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-10 font-semibold text-lg">
            {['Home', 'Blogs', 'Editor', 'Contact'].map((label) => {
              let href = '/';
              if (label === 'Blogs') href = userBlogsLink;
              else if (label === 'Editor') href = '/editor';
              else if (label === 'Contact') href = '/contact';

              return (
                <Link key={label} href={href}>
                  <div className="nav-link">{label}</div>
                </Link>
              );
            })}
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Desktop Account Dropdown */}
            {user?.value ? (
              <div className="relative hidden md:block">
                <button
                  onClick={() => setDropdown((prev) => !prev)}
                  className="flex items-center space-x-1 focus:outline-none"
                >
                  <MdAccountCircle className="text-3xl" />
                  <span className="text-sm">▼</span>
                </button>
                {dropdown && (
                  <div className="absolute right-0 mt-2 w-44 bg-white text-black rounded-lg shadow-xl border border-gray-200 z-50">
                    <ul className="py-2">
                      <li>
                        <Link href="/myaccount">
                          <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">My Account</div>
                        </Link>
                      </li>
                      <li
                        onClick={handleLogout}
                        className="px-4 py-2 hover:bg-red-100 text-red-600 cursor-pointer"
                      >
                        Logout
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div
                className="login-btn hidden md:inline-block"
                onClick={() => router.push('/login')}
              >
                Login / Signup
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 space-y-4 font-medium">
            {['Home', 'Blogs', 'Editor', 'Contact'].map((label) => {
              let href = '/';
              if (label === 'Blogs') href = userBlogsLink;
              else if (label === 'Editor') href = '/editor';
              else if (label === 'Contact') href = '/contact';

              return (
                <Link key={label} href={href}>
                  <div className="block px-4 py-2 bg-white/10 rounded hover:bg-white/20">{label}</div>
                </Link>
              );
            })}

            {user?.value ? (
              <>
                <Link href="/myaccount">
                  <div className="block px-4 py-2 bg-white/10 rounded hover:bg-white/20">My Account</div>
                </Link>
                <div
                  onClick={handleLogout}
                  className="block px-4 py-2 bg-red-600/80 text-white rounded hover:bg-red-700 cursor-pointer"
                >
                  Logout
                </div>
              </>
            ) : (
              <div
                className="block px-4 py-2 bg-cyan-600/80 text-white rounded hover:bg-cyan-700 cursor-pointer"
                onClick={() => router.push('/login')}
              >
                Login / Signup
              </div>
            )}
          </div>
        )}
      </header>

      <style jsx>{`
        .nav-link {
          cursor: pointer;
          color: #ffffffdd;
          transition: color 0.3s ease, transform 0.3s ease;
          padding-bottom: 4px;
          border-bottom: 2px solid transparent;
        }
        .nav-link:hover {
          color: #22d3ee;
          border-bottom-color: #22d3ee;
          transform: translateY(-2px);
        }
        .login-btn {
          position: relative;
          padding: 0.6rem 1.8rem;
          border-radius: 9999px;
          font-weight: 700;
          font-size: 1.05rem;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #e0f7fa;
          background: rgba(0, 183, 255, 0.12);
          backdrop-filter: blur(10px);
          border: 1.5px solid rgba(0, 183, 255, 0.5);
          cursor: pointer;
          user-select: none;
          box-shadow: 0 0 15px rgba(0, 183, 255, 0.3);
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .login-btn:hover {
          background: rgba(0, 183, 255, 0.35);
          color: #b2ebf2;
          box-shadow: 0 0 25px rgba(0, 183, 255, 0.75), 0 0 40px rgba(0, 183, 255, 0.5);
          transform: scale(1.05);
          border-color: rgba(0, 183, 255, 0.7);
        }
        .login-btn:active {
          transform: scale(0.98);
          box-shadow: 0 0 15px rgba(0, 183, 255, 0.5);
        }
      `}</style>
    </>
  );
};

export default Navbar;
