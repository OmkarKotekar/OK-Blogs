import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaArrowRight } from 'react-icons/fa';

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (localStorage.getItem('token')) {
      router.push('/');
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') setEmail(value);
    else if (name === 'password') setPassword(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const response = await res.json();
    setEmail('');
    setPassword('');

    if (response.success) {
      // Store token in localStorage (optional)
      localStorage.setItem('token', response.token);

      // Also set token as a cookie for SSR access
      document.cookie = `token=${response.token}; path=/; max-age=${60 * 60 * 24}; SameSite=Lax`;

      toast.success('Logged in successfully!');
      setTimeout(() => router.push('/'), 1000);
    } else {
      toast.error(response.error);
    }
  };

  return (
    <>
      <ToastContainer position="top-center" theme="colored" autoClose={5000} />

      <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 text-white shadow-lg">
          <div className="text-center">
            <img src="/logo.png" alt="Logo" className="w-14 h-14 mx-auto rounded-full" />
            <h2 className="mt-4 text-3xl font-bold tracking-wide">Welcome Back</h2>
            <p className="text-sm text-white/80 mt-1">Login to continue your journey</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {/* Email */}
            <div className="relative z-0">
              <input
                type="email"
                name="email"
                value={email}
                onChange={handleChange}
                required
                className="peer w-full px-4 pt-4 pb-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-transparent focus:outline-none focus:border-indigo-400 focus:shadow-indigo-500/50 focus:shadow-lg transition-all"
                placeholder="Email"
              />
              <label
                htmlFor="email"
                className="absolute left-4 top-2 text-white/80 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-white/60 peer-focus:top-2 peer-focus:text-sm peer-focus:text-indigo-300"
              >
                Email address
              </label>
            </div>

            {/* Password */}
            <div className="relative z-0">
              <input
                type="password"
                name="password"
                value={password}
                onChange={handleChange}
                required
                className="peer w-full px-4 pt-4 pb-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-transparent focus:outline-none focus:border-indigo-400 focus:shadow-indigo-500/50 focus:shadow-lg transition-all"
                placeholder="Password"
              />
              <label
                htmlFor="password"
                className="absolute left-4 top-2 text-white/80 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-white/60 peer-focus:top-2 peer-focus:text-sm peer-focus:text-indigo-300"
              >
                Password
              </label>
            </div>

            <div className="text-right text-sm">
              <Link href="/forgot" className="text-indigo-300 hover:underline">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-500/50 hover:shadow-lg transition-all flex items-center justify-center gap-2 py-2 rounded-md font-semibold text-white shadow-md"
            >
              Login <FaArrowRight />
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-white/70">
            Not a member?{' '}
            <Link href="/signup" className="text-indigo-300 font-medium hover:underline">
              Signup
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
