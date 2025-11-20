import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Plus, Trash, Video, FileText, Save } from "lucide-react";

function UpdateCourse() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [file, setFile] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/courses/${id}`)
      .then((res) => {
        const course = res.data;
        setTitle(course.title);
        setDescription(course.description);
        setPrice(course.price);
        setChapters(course.curriculum || []);
        setLoading(false);
      })
      .catch(() => alert("Failed to fetch course"));
  }, [id]);

  const handleChapterChange = (index, field, value) => {
    const newChapters = [...chapters];
    
    // Smart clean-up: If pasting raw iframe code, extract the src URL
    if (field === "videoLink" && value.includes("<iframe")) {
        const match = value.match(/src="([^"]+)"/);
        if (match && match[1]) {
            newChapters[index][field] = match[1];
        } else {
            newChapters[index][field] = value;
        }
    } else {
        newChapters[index][field] = value;
    }
    
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

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formdata = new FormData();
    formdata.append("title", title);
    formdata.append("description", description);
    formdata.append("price", price);
    formdata.append("curriculum", JSON.stringify(chapters));
    if (file) formdata.append("image", file);

    try {
      await api.put(`/courses/${id}`, formdata, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Course updated successfully!");
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Error updating course");
    }
  };

  if (loading) return <div className="text-center mt-20">Loading Editor...</div>;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-10 flex justify-center">
        <div className="max-w-5xl w-full bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-8 border-b pb-4">
            <h2 className="text-3xl font-bold text-blue-800">Edit Course Content</h2>
            <button onClick={handleUpdate} className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-green-700 cursor-pointer">
              <Save size={20} /> Save Changes
            </button>
          </div>

          <form onSubmit={handleUpdate} className="space-y-8">
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Basic Information</h3>
              <div className="grid gap-6 md:grid-cols-2 mb-4">
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border p-3 rounded bg-white" placeholder="Course Title" required />
                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full border p-3 rounded bg-white" placeholder="Price" required />
              </div>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border p-3 rounded h-24 bg-white" placeholder="Description" required />
              <div className="mt-4">
                <label className="block text-sm font-medium mb-1">Update Thumbnail</label>
                <input type="file" onChange={(e) => setFile(e.target.files[0])} className="w-full border p-2 rounded bg-white" />
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <FileText className="text-blue-600" /> Curriculum & Content
              </h3>

              {chapters.map((chapter, index) => (
                <div key={index} className="bg-white p-6 mb-6 rounded-xl border-2 border-gray-100 shadow-sm relative hover:border-blue-200 transition-all">
                  <div className="absolute top-4 right-4">
                    <button type="button" onClick={() => removeChapter(index)} className="text-red-500 hover:bg-red-50 p-2 rounded-full transition cursor-pointer">
                      <Trash size={20} />
                    </button>
                  </div>

                  <div className="mb-4">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Chapter Title</label>
                    <input type="text" value={chapter.chapterTitle} onChange={(e) => handleChapterChange(index, "chapterTitle", e.target.value)} className="w-full border p-3 rounded-lg font-bold text-lg" placeholder="e.g. Introduction to React Hooks" />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-1">
                        <Video size={14} /> Video Link (YouTube)
                      </label>
                      <input type="text" value={chapter.videoLink} onChange={(e) => handleChapterChange(index, "videoLink", e.target.value)} className="w-full border p-3 rounded-lg text-blue-600" placeholder="Paste YouTube link here..." />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-1">
                        <FileText size={14} /> Reading Content / Notes
                      </label>
                      <textarea value={chapter.content} onChange={(e) => handleChapterChange(index, "content", e.target.value)} className="w-full border p-4 rounded-lg h-40 font-mono text-sm bg-gray-50 focus:bg-white transition-colors" placeholder="Type your article, notes, or code snippets here..." />
                    </div>
                  </div>
                </div>
              ))}

              <button type="button" onClick={addChapter} className="w-full py-4 border-2 border-dashed border-blue-300 text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition flex items-center justify-center gap-2 cursor-pointer">
                <Plus size={24} /> Add New Chapter
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default UpdateCourse;