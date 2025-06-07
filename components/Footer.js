import React from 'react';
import { FaGithub, FaLinkedin, FaArrowUp } from 'react-icons/fa';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gradient-to-r from-indigo-600 via-purple-700 to-pink-600 text-white py-10 px-6 md:px-20 relative shadow-inner select-none">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-center">
        <div className="text-sm md:text-base text-white mb-2 md:mb-0">
          Crafted by <span className="font-semibold">Omkar Kotekar</span>
        </div>

        <div className="flex gap-8 text-2xl md:text-3xl">
          <a
            href="https://github.com/omkarkotekar"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/90 hover:text-[#22d3ee] hover:drop-shadow-[0_0_10px_rgba(34,211,238,0.7)] transition duration-300"
            aria-label="GitHub Profile"
          >
            <FaGithub />
          </a>
          <a
            href="https://www.linkedin.com/in/omkar-kotekar-81b620256"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/90 hover:text-[#22d3ee] hover:drop-shadow-[0_0_10px_rgba(34,211,238,0.7)] transition duration-300"
            aria-label="LinkedIn Profile"
          >
            <FaLinkedin />
          </a>
        </div>

        <div className="text-xs md:text-sm tracking-wide text-white/90">
          &copy; {new Date().getFullYear()}{' '}
          <span className="font-semibold">okblogs.com</span>. All rights reserved.
        </div>
      </div>

      {/* Scroll to top */}
      <div className="absolute right-6 bottom-6 md:right-10">
        <button
          onClick={scrollToTop}
          className="login-btn"
          aria-label="Scroll to top"
          type="button"
        >
          <FaArrowUp className="text-xl md:text-2xl" />
        </button>
      </div>

      <style jsx>{`
        .login-btn {
          position: relative;
          padding: 0.6rem 1.2rem;
          border-radius: 9999px;
          font-weight: 700;
          font-size: 1.1rem;
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
    </footer>
  );
};

export default Footer;
