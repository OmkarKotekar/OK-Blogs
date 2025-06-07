import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import '@/styles/globals.css'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import LoadingBar from 'react-top-loading-bar'

export default function App({ Component, pageProps }) {
  const [user, setUser] = useState({value: null})
  const [key, setkey] = useState()
  const [progress, setProgress] = useState(0)
  const router = useRouter();

  
  const logout = ()=> {
    localStorage.removeItem('token')
    setUser({value:null})
    setkey(Math.random())
    toast.success('You have successfully logged out!', {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  }

  useEffect(()=>{
    router.events.on('routeChangeComplete', ()=>{
      setProgress(100)
    })

    router.events.on('routeChangeStart', ()=>{
      setProgress(10)
    })

    const token = localStorage.getItem('token')
    if(token){
      setUser({value:token})
      setkey(Math.random())
    }
  }, [router.query]);

  return (
    <>
      <Head>
      <title>OK BLOGS</title>
      <link rel='icon' href='/favicon.svg' />
    </Head>
    <ToastContainer
      position="top-center"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="colored"
    />
    <LoadingBar color='#f11946' progress={progress} onLoaderFinished={() => setProgress(0)} waitingTime={400} />

    {/* Flex layout for sticky footer */}
    <div className="flex flex-col min-h-screen">
      {key && <Navbar logout={logout} user={user} key={key} />}
      {!key && <Navbar user={user} key={key} />}

      <main className="flex-grow">
        <Component {...pageProps} />
      </main>

      <Footer />
    </div>
  </>
)
}