import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { MdAccountCircle } from 'react-icons/md';
import { useRouter } from 'next/router';
import jwtDecode from 'jwt-decode';

const Navbar = ({ logout, user }) => {
  const [dropdown, setDropdown] = useState(false);
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
      <header className="bg-gradient-to-r from-indigo-600 via-purple-700 to-pink-600 text-white flex items-center justify-between px-12 py-4 select-none shadow-lg font-inter fixed w-full z-50 top-0">
        <div className="flex items-center space-x-6">
          <Link href="/">
            <div className="cursor-pointer">
              <Image
                src="/favicon.svg"
                alt="OK BLOGS"
                width={220}
                height={170}
                className="rounded-full"
              />
            </div>
          </Link>
          <nav className="hidden md:flex space-x-14 font-semibold text-lg">
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
        </div>

        <div className="relative">
          {user?.value ? (
            <div
              onMouseEnter={() => setDropdown(true)}
              onMouseLeave={() => setDropdown(false)}
              className="cursor-pointer"
            >
              <MdAccountCircle className="text-3xl md:text-5xl" />
              {dropdown && (
                <div className="absolute right-0 mt-3 bg-purple-800 rounded-md px-5 py-3 w-44 shadow-lg text-white font-medium z-50">
                  <ul>
                    <Link href="/myaccount">
                      <li className="py-2 hover:text-cyan-400 cursor-pointer transition-colors duration-200">
                        My Account
                      </li>
                    </Link>
                    <li
                      onClick={handleLogout}
                      className="py-2 hover:text-red-500 cursor-pointer transition-colors duration-200"
                    >
                      Logout
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div
              className="login-btn"
              role="button"
              tabIndex={0}
              onClick={() => router.push('/login')}
              onKeyDown={(e) => {
                if (e.key === 'Enter') router.push('/login');
              }}
            >
              Login / Signup
            </div>
          )}
        </div>
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
          color: #22d3ee; /* cyan-400 */
          border-bottom-color: #22d3ee;
          transform: translateY(-3px);
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
          -webkit-backdrop-filter: blur(10px);
          border: 1.5px solid rgba(0, 183, 255, 0.5);
          cursor: pointer;
          user-select: none;
          box-shadow: 0 0 15px rgba(0, 183, 255, 0.3);
          transition:
            background-color 0.3s ease,
            box-shadow 0.4s ease,
            transform 0.3s ease,
            color 0.3s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .login-btn:hover {
          background: rgba(0, 183, 255, 0.35);
          color: #b2ebf2;
          box-shadow:
            0 0 25px rgba(0, 183, 255, 0.75),
            0 0 40px rgba(0, 183, 255, 0.5);
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
