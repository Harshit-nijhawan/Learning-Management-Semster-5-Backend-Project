import React, { useState } from "react";
import api from "../utils/api";
import { Plus, Trash, FileText, Video } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function CreateCourse() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [isFree, setIsFree] = useState(false);
  const [chapters, setChapters] = useState([
    { chapterTitle: "", videoLink: "", content: "" }
  ]);

  const handleChapterChange = (index, field, value) => {
    const newChapters = [...chapters];
    newChapters[index][field] = value;
    setChapters(newChapters);
  };

  const addChapter = () => {
    setChapters([...chapters, { chapterTitle: "", videoLink: "", content: "" }]);
  };

  const removeChapter = (index) => {
    const newChapters = [...chapters];
    newChapters.splice(index, 1);
    setChapters(newChapters);
  };

  const handleUpload = (e) => {
    e.preventDefault();
    const formdata = new FormData();
    formdata.append("image", file);
    formdata.append("title", title);
    formdata.append("description", description);
    formdata.append("price", price);
    formdata.append("curriculum", JSON.stringify(chapters));

    api.post("/api/courses", formdata, {
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then(() => {
        alert("Course created successfully!");
        window.location.href = "/dashboard";
      })
      .catch((err) => alert(err.response?.data?.message || "Error creating course"));
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-10 flex justify-center">
        <div className="max-w-4xl w-full bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-blue-800 mb-8 border-b pb-4">Create New Course</h2>
          <form onSubmit={handleUpload} className="space-y-6">

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block font-semibold mb-1">Course Title</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full border p-2 rounded" required />
              </div>
              <div>
                <label className="block font-semibold mb-1">Price (₹)</label>
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    className={`w-full border p-2 rounded ${isFree ? 'bg-gray-100 cursor-not-allowed text-gray-400' : ''}`}
                    disabled={isFree}
                    required={!isFree}
                    min="0"
                  />
                  <div className="flex items-center gap-2 min-w-max">
                    <input
                      type="checkbox"
                      id="isFree"
                      checked={isFree}
                      onChange={(e) => {
                        setIsFree(e.target.checked);
                        if (e.target.checked) setPrice(0);
                      }}
                      className="w-5 h-5 accent-blue-600"
                    />
                    <label htmlFor="isFree" className="cursor-pointer text-sm font-medium">Free Course</label>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1">Description</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full border p-2 rounded h-24" required />
            </div>

            <div>
              <label className="block font-semibold mb-1">Thumbnail Image</label>
              <input type="file" onChange={e => setFile(e.target.files[0])} className="w-full border p-2 rounded" required />
            </div>

            {/* Curriculum Section */}
            <div className="mt-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Curriculum & Content</h3>
              <div className="space-y-6">
                {chapters.map((chapter, index) => (
                  <div key={index} className="bg-blue-50 p-6 rounded-xl border border-blue-100 relative">
                    <div className="absolute top-4 right-4">
                      {chapters.length > 1 && (
                        <button type="button" onClick={() => removeChapter(index)} className="text-red-500 hover:text-red-700">
                          <Trash size={20} />
                        </button>
                      )}
                    </div>
                    <h4 className="font-bold text-blue-600 mb-3">Chapter {index + 1}</h4>

                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Chapter Title (e.g., Introduction to React)"
                        value={chapter.chapterTitle}
                        onChange={(e) => handleChapterChange(index, "chapterTitle", e.target.value)}
                        className="w-full border p-2 rounded"
                        required
                      />
                      <div className="flex gap-2 items-center">
                        <Video size={18} className="text-gray-500" />
                        <input
                          type="text"
                          placeholder="YouTube Embed Link"
                          value={chapter.videoLink}
                          onChange={(e) => handleChapterChange(index, "videoLink", e.target.value)}
                          className="flex-1 border p-2 rounded"
                          required
                        />
                      </div>
                      <div className="flex gap-2 items-start">
                        <FileText size={18} className="text-gray-500 mt-2" />
                        <textarea
                          placeholder="Reading Material / Notes for this chapter..."
                          value={chapter.content}
                          onChange={(e) => handleChapterChange(index, "content", e.target.value)}
                          className="flex-1 border p-2 rounded h-32"
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button type="button" onClick={addChapter} className="mt-4 flex items-center gap-2 text-blue-600 font-bold hover:bg-blue-50 px-4 py-2 rounded transition">
                <Plus size={20} /> Add Another Chapter
              </button>
            </div>

            <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-blue-700 shadow-md transition-all">
              Publish Course
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default CreateCourse;