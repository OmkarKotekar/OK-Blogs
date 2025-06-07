import React, { useEffect, useState } from "react";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import { jwtDecode } from "jwt-decode";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/router";

export default function IndexPage() {
  const router = useRouter();
  const { quill, quillRef } = useQuill();
  const [category, setCategory] = useState("");
  const [createdAt, setCreatedAt] = useState(null);
  const [thumbnail, setThumbnail] = useState("");

  const user =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (quill) quill.setText("");
  }, [quill]);

  const extractTitleFromHtml = (htmlContent) => {
    const doc = new DOMParser().parseFromString(htmlContent, "text/html");
    return doc.querySelector("h1")?.textContent || "No title found";
  };

  const extractFirstParagraph = (htmlContent) => {
    const doc = new DOMParser().parseFromString(htmlContent, "text/html");
    return doc.querySelector("p")?.textContent.slice(0, 50) || "";
  };

  const extractImagesFromHtml = (htmlContent) => {
    const doc = new DOMParser().parseFromString(htmlContent, "text/html");
    return Array.from(doc.querySelectorAll("img")).map((img) =>
      img.getAttribute("src")
    );
  };

  const handleThumbnailUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onloadend = () => {
    setThumbnail(reader.result); // Base64 string
  };
  reader.readAsDataURL(file);
};


  const generateSlug = (input) =>
    input.trim().replace(/\s+/g, "-").toLowerCase();

  const handleSave = async () => {
    if (!quill) return;

    const delta = quill.getContents();
    const htmlContent = new QuillDeltaToHtmlConverter(delta.ops, {}).convert();
    const title = extractTitleFromHtml(htmlContent);
    const slug = generateSlug(title);
    const metadesc = extractFirstParagraph(htmlContent);
    const imagesArray = extractImagesFromHtml(htmlContent);
    const decodedToken = jwtDecode(user);
    const createdBy = decodedToken.name;

    try {
      const response = await fetch("/api/addBlog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: htmlContent,
          images: imagesArray,
          title,
          slug,
          category,
          createdBy,
          createdAt: new Date(),
          metadesc,
          thumbnail: thumbnail || thumbnailImage, // If user uploads manually, use it. Else use auto one from editor.
        }),
      });

      if (response.ok) {
        toast.success("Blog Added!", { position: "top-center", theme: "colored" });
        setTimeout(() => router.push("/"), 1000);
      } else {
        toast.error(response.statusText, { position: "top-center", theme: "colored" });
      }
    } catch (error) {
      console.error("Error adding blog:", error.message);
    }
  };

  return (
    <>
      <ToastContainer />
      {!user ? (
        <div className="text-center text-gray-600 text-xl mt-32">
          Please login first to write a blog.
        </div>
      ) : (
        <div className="pt-32 px-4 md:px-16 pb-20 bg-gradient-to-b from-[#f7f9fb] to-[#ecf0f3] min-h-screen">
          <div className="bg-white/60 backdrop-blur-lg border border-white/30 shadow-xl rounded-3xl p-6 md:p-10 max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-[#2c3e50] mb-8">Write a Blog</h2>

            {/* Quill Editor */}
            <div
              ref={quillRef}
              className="bg-white min-h-[70vh] text-black rounded-xl shadow-inner overflow-y-auto"
            />

            {/* Category input */}
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Enter category"
              className="mt-8 w-full px-5 py-3 text-lg border border-gray-300 rounded-xl bg-white/70 backdrop-blur focus:ring-2 focus:ring-cyan-500 focus:outline-none transition"
            />

            <div className="mt-6">
  <label className="block mb-2 text-gray-700 font-medium">Select Thumbnail</label>
  <input
    type="file"
    accept="image/*"
    onChange={handleThumbnailUpload}
    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full
           file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
  />

  {thumbnail && (
    <div className="mt-4">
      <p className="text-sm text-gray-600 mb-2">Thumbnail Preview:</p>
      <img src={thumbnail} alt="Thumbnail" className="w-64 h-40 object-cover rounded-lg border" />
    </div>
  )}
</div>


            {/* Save button */}
            <button
              onClick={handleSave}
              className="mt-6 bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white font-bold px-8 py-3 rounded-full hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Save Blog
            </button>
          </div>
        </div>
      )}
    </>
  );
}
