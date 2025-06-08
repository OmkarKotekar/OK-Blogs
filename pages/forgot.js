import React, { useState } from 'react'
import Link from 'next/link'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';
import { FaArrowRight } from 'react-icons/fa';

const Forgot = () => {
  const router = useRouter()
  const [email, setemail] = useState('')
  const [otp, setotp] = useState(null)
  const [otpForm, setotpForm] = useState(false)
  const [emailForm, setemailForm] = useState(true)
  const [password, setpassword] = useState('')
  const [passwordForm, setpasswordForm] = useState(false)
  const [cpassword, setcpassword] = useState('')

  const handleChange = async (e) => {
    const { name, value } = e.target
    if (name === 'email') setemail(value)
    else if (name === 'password') setpassword(value)
    else if (name === 'cpassword') setcpassword(value)
    else if (name === 'otp') setotp(value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (emailForm) {
      const data = { email, sent: true }
      const res = await fetch(`/api/forgot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const response = await res.json()
      localStorage.setItem('otp', response.otp)
      toast.success('OTP has been sent to your email')
      setTimeout(() => {
        setotpForm(true)
        setemailForm(false)
      }, 1000)
    }

    else if (otpForm) {
      if (otp == localStorage.getItem('otp')) {
        toast.success('OTP verified')
        setTimeout(() => {
          setotpForm(false)
          setpasswordForm(true)
        }, 1000)
      } else {
        toast.error('Invalid OTP')
      }
    }

    else if (passwordForm && localStorage.getItem('otp')) {
      if (cpassword === password) {
        const data = { email, password }
        const res = await fetch(`/api/updatePass`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        localStorage.removeItem('otp')
        toast.success('Password updated successfully')
        setTimeout(() => {
          router.push(`/login`)
        }, 1000)
      } else {
        toast.error('Passwords do not match')
      }
    } else {
      toast.error('Invalid request')
    }
  }

  return (
    <>
      <ToastContainer theme="colored" />
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center p-4">
        <div className="w-full max-w-md backdrop-blur-md bg-white/10 border border-white/20 shadow-xl rounded-xl p-8">
          <div className="text-center">
            <img src="/logo.png" alt="Logo" className="mx-auto h-12 w-12 rounded-full" />
            <h2 className="mt-6 text-2xl font-bold text-white">Reset Your Password</h2>
            <p className="mt-2 text-sm text-white/80">We’ll send you an OTP to reset it.</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {emailForm && (
              <>
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
              </>
            )}

            {otpForm && (
              <>
                <div className="relative z-0">
                  <input
                    type="text"
                    name="otp"
                    value={otp}
                    onChange={handleChange}
                    required
                    className="peer w-full px-4 pt-4 pb-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-transparent focus:outline-none focus:border-indigo-400 focus:shadow-indigo-500/50 focus:shadow-lg transition-all"
                    placeholder="OTP"
                  />
                  <label
                    htmlFor="otp"
                    className="absolute left-4 top-2 text-white/80 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-white/60 peer-focus:top-2 peer-focus:text-sm peer-focus:text-indigo-300"
                  >
                    OTP
                  </label>
                </div>
              </>
            )}

            {passwordForm && (
              <>
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
                    New Password
                  </label>
                </div>
                <div className="relative z-0">
                  <input
                    type="password"
                    name="cpassword"
                    value={password}
                    onChange={handleChange}
                    required
                    className="peer w-full px-4 pt-4 pb-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-transparent focus:outline-none focus:border-indigo-400 focus:shadow-indigo-500/50 focus:shadow-lg transition-all"
                    placeholder="Password"
                  />
                  <label
                    htmlFor="cpassword"
                    className="absolute left-4 top-2 text-white/80 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-white/60 peer-focus:top-2 peer-focus:text-sm peer-focus:text-indigo-300"
                  >
                    Confirm Password
                  </label>
                </div>
                {password !== cpassword && (
                  <p className="text-red-300 text-sm">Passwords do not match</p>
                )}
              </>
            )}

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-500/50 hover:shadow-lg transition-all flex items-center justify-center gap-2 py-2 rounded-md font-semibold text-white shadow-md"
            >
              Continue <FaArrowRight />
            </button>
          </form>

          <p className="mt-6 text-center text-white/80 text-sm">
            Know your password?{' '}
            <Link href="/login" className="underline hover:text-white">
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  )
}

export default Forgot
