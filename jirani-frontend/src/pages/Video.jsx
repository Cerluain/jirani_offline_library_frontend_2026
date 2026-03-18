import React, { useState, useEffect } from "react";
import { Trash2, Loader2, UploadCloud, Film } from "lucide-react";

const UploadVideo = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [alert, setAlert] = useState({ msg: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [videos, setVideos] = useState([]);
  const [deletingId, setDeletingId] = useState(null);

  const getVideos = async () => {
    const res = await fetch("http://localhost:8000/videos");
    setVideos(await res.json());
  };

  useEffect(() => { getVideos(); }, []);

  const upload = async () => {
    if (!title.trim()) { setAlert({ msg: "// title is required", type: "error" }); return; }
    if (!file)         { setAlert({ msg: "// no file selected",  type: "error" }); return; }

    setLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:8000/videos/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error();
      setAlert({ msg: "// upload successful", type: "success" });
      getVideos();
      setTitle(""); setDescription(""); setFile(null);
    } catch {
      setAlert({ msg: "// upload failed — try again", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const deleteVideo = async (id) => {
    setDeletingId(id);
    try {
      const res = await fetch(`http://localhost:8000/videos/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setVideos((prev) => prev.filter((v) => v.id !== id));
    } catch {
      setAlert({ msg: "// delete failed", type: "error" });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      {/* Upload Card */}
      <div className="relative bg-[#111111] border border-[#2a2a2a] border-t-2 border-t-[#C9A84C] rounded p-8 mb-12">
        <span className="absolute -top-2.5 left-6 bg-[#111111] px-2 font-mono text-[0.6rem] tracking-widest text-[#C9A84C] uppercase">
          New Upload
        </span>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[0.62rem] tracking-widest text-[#7a7265] uppercase">Title</label>
            <input
              type="text"
              placeholder="Enter video title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-[#0A0A0A] border border-[#2a2a2a] rounded-sm px-3 py-2.5 text-[#F0EAD6] text-sm placeholder-[#4a4540] outline-none focus:border-[#7a5e20] transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[0.62rem] tracking-widest text-[#7a7265] uppercase">Description</label>
            <input
              type="text"
              placeholder="Optional..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-[#0A0A0A] border border-[#2a2a2a] rounded-sm px-3 py-2.5 text-[#F0EAD6] text-sm placeholder-[#4a4540] outline-none focus:border-[#7a5e20] transition-colors"
            />
          </div>

          <div className="col-span-2 flex flex-col gap-1.5">
            <label className="font-mono text-[0.62rem] tracking-widest text-[#7a7265] uppercase">Video File</label>
            <div className="relative bg-[#0A0A0A] border border-dashed border-[#2a2a2a] rounded-sm p-7 text-center cursor-pointer hover:border-[#7a5e20] hover:bg-[#0e0e0e] transition-colors">
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setFile(e.target.files[0])}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <Film className="mx-auto mb-2 text-[#4a4540]" size={24} />
              {file
                ? <p className="font-mono text-xs text-[#E2C97E]">⬡ {file.name}</p>
                : <p className="text-sm text-[#7a7265] font-light">Click or drag a video file here</p>
              }
            </div>
          </div>
        </div>

        <button
          onClick={upload}
          disabled={loading}
          className="mt-2 w-full py-3 bg-[#C9A84C] text-[#0A0A0A] font-mono font-medium text-xs tracking-widest uppercase rounded-sm hover:bg-[#E2C97E] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {loading
            ? <><Loader2 size={14} className="animate-spin" /> Uploading...</>
            : <><UploadCloud size={14} /> Upload Video</>
          }
        </button>

        {alert.msg && (
          <div className={`mt-3 px-3 py-2.5 rounded-sm font-mono text-xs border ${
            alert.type === "success"
              ? "bg-[#0d1a0d] text-[#7ec87e] border-[#1e4020]"
              : "bg-[#2a1210] text-[#e07070] border-[#4a1a18]"
          }`}>
            {alert.msg}
          </div>
        )}
      </div>

      {/* Library Header */}
      <div className="flex items-baseline gap-3 mb-4">
        <h2 className="font-serif text-xl font-semibold text-[#F0EAD6]">Library</h2>
        <span className="font-mono text-xs text-[#C9A84C]">
          {videos.length} video{videos.length !== 1 ? "s" : ""}
        </span>
      </div>
      <div className="relative h-px bg-[#2a2a2a] mb-6">
        <div className="absolute left-0 top-0 w-10 h-px bg-[#C9A84C]" />
      </div>

      {videos.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-[#2a2a2a] rounded">
          <p className="font-mono text-xs text-[#4a4540]">// no videos in the archive yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(265px,1fr))] gap-5">
          {videos.map((video) => (
            <div
              key={video.id}
              className="bg-[#111111] border border-[#2a2a2a] rounded overflow-hidden hover:border-[#7a5e20] hover:-translate-y-0.5 transition-all duration-200"
            >
              <video controls preload="metadata" className="w-full block bg-black max-h-44 object-cover">
                <source src={`http://localhost:8000/videos/stream/${video.id}`} type="video/mp4" />
              </video>
              <div className="px-3 py-2.5 flex items-center justify-between gap-2 border-t border-[#2a2a2a]">
                <span className="text-sm font-medium text-[#F0EAD6] truncate">{video.title}</span>
                <button
                  title="Delete"
                  disabled={deletingId === video.id}
                  onClick={() => deleteVideo(video.id)}
                  className="flex-shrink-0 w-8 h-8 flex items-center justify-center border border-[#2a2a2a] rounded-sm text-[#4a4540] hover:bg-[#2a1210] hover:border-[#c0392b] hover:text-[#e07070] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  {deletingId === video.id
                    ? <Loader2 size={13} className="animate-spin text-[#e07070]" />
                    : <Trash2 size={13} />
                  }
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default UploadVideo;