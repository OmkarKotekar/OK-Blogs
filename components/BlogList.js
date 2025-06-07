import Link from 'next/link'
import React from 'react'
import Image from 'next/image'

const BlogList = () => {
  return (
    <div>
      <div className='Blogs'>
                    <div className="mt-[50px] w-[177.87px] text-zinc-900 text-xl font-bold uppercase leading-7">India BLOGS</div>
                    {/* card for example */}
                    <div className='blogList'>
                        <Link href={'/blogpost/[slug]'} className={'flex mt-[28px] w-[57vw] pb-20'}>
                            <div className='img'>
                                <Image src={'/Thumbnail.jpg'} alt={'image'} width={204} height={119} /> {/*Thumbnail*/}
                            </div>
                            <div className='ml-10'>
                                <div className="text-zinc-900 text-[20px] font-semibold">Banaras in 2 days</div> {/*Blog Title*/}
                                <div className='text-zinc-600 text-xs font-normal'>December 11, 2023, 2:01 PM IST</div> {/*Date*/}
                                <div className='text-zinc-900 text-sm font-normal'>Discover Varanasi's spiritual allure with a sunrise boat ride on the Ganges and an evening Ganga Aarti, then explore Buddhist history in Sarnath on day two.</div> {/*Blog meta data*/}
                                <div className='text-zinc-900 text-xs font-light'>By Ashish Kapur</div> {/*Blog Author*/}
                            </div>
                        </Link>
                    </div>
                </div>
    </div>
  )
}

export default BlogList