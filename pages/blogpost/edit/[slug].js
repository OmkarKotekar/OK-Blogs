// pages/blog/edit/[slug].js
import { useState, useEffect } from 'react';
import { useQuill } from 'react-quilljs';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html';
import { toast, ToastContainer } from 'react-toastify';
import { useRouter } from 'next/router';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';

const EditBlog = ({ initialBlogContent, initialCategory }) => {
  const router = useRouter();
  const { quill, quillRef } = useQuill();
  const [category, setCategory] = useState(initialCategory || "");
  const [createdAt, setCreatedAt] = useState(null);
  const [metadesc, setMetadesc] = useState("");

  useEffect(() => {
    if (quill && initialBlogContent) {
      quill.clipboard.dangerouslyPasteHTML(initialBlogContent);
    }
  }, [quill, initialBlogContent]);

  const extractTitleFromHtml = (htmlContent) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");
    const h1Element = doc.querySelector("h1");
    return h1Element ? h1Element.textContent : "No title found";
  };

  const extractFirstParagraph = (htmlContent) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");
    const firstPTag = doc.querySelector("p");
    return firstPTag ? firstPTag.textContent.slice(0, 100) : "";
  };

  const extractImagesFromHtml = (htmlContent) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");
    const imgElements = doc.querySelectorAll("img");
    return Array.from(imgElements).map(img => img.getAttribute("src"));
  };

  const generateSlug = (input) => {
    return input.trim().replace(/\s+/g, "-").toLowerCase();
  };

  const handleSave = async () => {
    if (quill) {
      const delta = quill.getContents();
      const converter = new QuillDeltaToHtmlConverter(delta.ops, {});
      const htmlContent = converter.convert();

      const title = extractTitleFromHtml(htmlContent);
      const imagesArray = extractImagesFromHtml(htmlContent);
      const slug = generateSlug(title);
      const firstParagraphText = extractFirstParagraph(htmlContent);

      // Read token from cookies
      const userToken = Cookies.get('token');
      if (!userToken) {
        toast.error("You must be logged in to edit a blog.", {
          position: "top-center",
          autoClose: 5000,
          theme: "colored",
        });
        return;
      }

      const decodedToken = jwtDecode(userToken);

      setMetadesc(firstParagraphText);
      const currentDate = new Date();
      setCreatedAt(currentDate);

      updateBlog({
        htmlContent,
        imagesArray,
        title,
        slug,
        category,
        createdBy: decodedToken.name,
        createdAt: currentDate,
        metadesc: firstParagraphText,
      });
    }
  };

  const updateBlog = async ({
    htmlContent,
    imagesArray,
    title,
    slug,
    category,
    createdBy,
    createdAt,
    metadesc,
  }) => {
    try {
      const response = await fetch(`/api/blog/${slug}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: htmlContent,
          images: imagesArray,
          title,
          slug,
          category,
          createdBy,
          createdAt,
          metadesc,
        }),
      });

      if (response.ok) {
        toast.success('Blog Updated!', {
          position: "top-center",
          autoClose: 5000,
          theme: "colored",
        });
        setTimeout(() => {
          router.push(`${process.env.NEXT_PUBLIC_HOST}`);
        }, 1000);
      } else {
        toast.error(response.statusText, {
          position: "top-center",
          autoClose: 5000,
          theme: "colored",
        });
      }
    } catch (error) {
      console.error("Error while updating blog:", error.message);
    }
  };

  return (
    <>
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

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e0eafc] to-[#cfdef3] py-22 px-4">
        <div className="w-full max-w-5xl bg-white/60 backdrop-blur-md rounded-2xl shadow-xl p-8 space-y-6 border border-white/20">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-4">✍️ Edit Your Blog</h2>

          <div className="bg-white rounded-md p-4 shadow-inner border border-gray-200">
            <div ref={quillRef} className="min-h-[300px]" />
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <input
              className="w-full md:w-1/2 px-4 py-2 text-lg text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Enter blog category"
            />

            <button
              className="w-full md:w-auto px-6 py-3 text-white font-semibold bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-lg shadow-lg transition-all duration-300"
              onClick={handleSave}
            >
              💾 Save Changes
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps({ params }) {
  const { slug } = params;

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/blog/${slug}`);
    const blog = await response.json();

    if (!response.ok) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        initialBlogContent: blog.content,
        initialCategory: blog.category || "",
      },
    };
  } catch (error) {
    console.error('Error fetching blog:', error);
    return {
      notFound: true,
    };
  }
}

export default EditBlog;
