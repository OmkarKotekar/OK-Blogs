import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import DOMPurify from 'dompurify';

const BlogPost = ({ blog, isBlogCreator }) => {
  const router = useRouter();
  const [likes, setLikes] = useState(blog.likes || 0);

  // Remove first <h1> from blog content (sanitized)
  const removeFirstH1 = (htmlContent) => {
    if (typeof window !== 'undefined') {
      const cleanHtml = DOMPurify.sanitize(htmlContent);
      const doc = new window.DOMParser().parseFromString(cleanHtml, 'text/html');
      const firstH1 = doc.querySelector('h1');
      if (firstH1) firstH1.remove();
      return new window.XMLSerializer().serializeToString(doc);
    }
    return htmlContent;
  };

  const handleLikeButtonClick = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/blog/${router.query.slug}`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setLikes(data.likes);
      } else {
        console.error('Failed to update likes:', res.statusText);
      }
    } catch (error) {
      console.error('Error updating likes:', error);
    }
  };

  const handleShareButtonClick = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog.title,
          text: blog.title,
          url: `/blog/${blog.slug}`,
        });
        console.log('Sharing successful');
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      alert('Web Share API not supported in this browser.');
    }
  };

  const handleEditButtonClick = () => {
    router.push(`/blogpost/edit/${blog.slug}`);
  };

  if (router.isFallback) {
    return <div className="text-center mt-20 text-xl">Loading blog...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-32 min-h-[100vh]">
      <h1 className="text-5xl font-bold text-center mb-8">{blog.title}</h1>
      <div
        className="prose max-w-none mb-10"
        dangerouslySetInnerHTML={{ __html: removeFirstH1(blog.content) }}
      />

      <div className="flex items-center gap-4">
        <button
          onClick={handleLikeButtonClick}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded transition"
        >
          👍 Like ({likes})
        </button>

        <button
          onClick={handleShareButtonClick}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded transition"
        >
          🔗 Share
        </button>

        {isBlogCreator && (
          <button
            onClick={handleEditButtonClick}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-5 py-2 rounded transition"
          >
            ✏️ Edit
          </button>
        )}
      </div>
    </div>
  );
};

export async function getServerSideProps(context) {
  const { slug } = context.params;
  const token = context.req.cookies.token || '';

  try {
    const baseUrl = process.env.NEXT_PUBLIC_HOST || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/blog/${slug}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) return { notFound: true };

    const data = await res.json();

    // Separate out isBlogCreator, rest goes to blog
    const { isBlogCreator = false, ...blog } = data;

    return {
      props: {
        blog,
        isBlogCreator,
      },
    };
  } catch (error) {
    console.error('Error fetching blog:', error);
    return { notFound: true };
  }
}


export default BlogPost;
