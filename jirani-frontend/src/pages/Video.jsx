import React, { useState, useEffect } from "react";

// only styles unique to thiscomponent
const styles = `
  .file-drop { position: relative; background: var(--black); border: 1px dashed var(--border); border-radius: 3px; padding: 1.75rem; text-align: center; cursor: pointer; transition: border-color 0.15s, background 0.15s; }
  .file-drop:hover { border-color: var(--gold-dim); background: #0e0e0e; }
  .file-drop input { position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%; }
  .file-drop .icon { font-size: 1.6rem; margin-bottom: 6px; display: block; }
  .file-drop .hint { font-size: 0.82rem; color: var(--text-muted); font-weight: 300; }
  .file-drop .chosen { font-family: var(--font-mono); font-size: 0.78rem; color: var(--gold-light); margin-top: 5px; }

  .video-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(265px, 1fr)); gap: 1.25rem; }
  .video-card { background: var(--black-card); border: 1px solid var(--border); border-radius: 4px; overflow: hidden; transition: border-color 0.2s, transform 0.2s; }
  .video-card:hover { border-color: var(--gold-dim); transform: translateY(-2px); }
  .video-card video { width: 100%; display: block; background: #000; max-height: 175px; object-fit: cover; }
  .video-footer { padding: 10px 13px; display: flex; align-items: center; justify-content: space-between; gap: 8px; border-top: 1px solid var(--border); }
  .video-title { font-size: 0.85rem; font-weight: 500; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
`;

const TrashIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6M14 11v6"/>
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
);

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
      <style>{styles}</style>

      {/* uploadCard */}
      <div className="card" style={{ marginBottom: "3rem" }}>
        <span className="card-label">New Upload</span>
        <div className="form-row">
          <div className="form-group">
            <label className="label">Title</label>
            <input className="input" type="text" placeholder="Enter video title..." value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="label">Description</label>
            <input className="input" type="text" placeholder="Optional..." value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="form-group full">
            <label className="label">Video File</label>
            <div className="file-drop">
              <input type="file" accept="video/*" onChange={(e) => setFile(e.target.files[0])} />
              <span className="icon">▶</span>
              {file ? <p className="chosen">⬡ {file.name}</p> : <p className="hint">Click or drag a video file here</p>}
            </div>
          </div>
        </div>
        <button className="btn-primary" onClick={upload} disabled={loading}>
          {loading ? <><div className="spinner" /> Uploading...</> : "Upload Video"}
        </button>
        {alert.msg && <div className={`alert ${alert.type}`}>{alert.msg}</div>}
      </div>

      {/* Video Library */}
      <div className="section-header">
        <h2>Library</h2>
        <span className="section-count">{videos.length} video{videos.length !== 1 ? "s" : ""}</span>
      </div>
      <div className="divider" />

      {videos.length === 0 ? (
        <div className="empty-state"><p>// No Videos Yet</p></div>
      ) : (
        <div className="video-grid">
          {videos.map((video) => (
            <div className="video-card fadein" key={video.id}>
              <video controls preload="metadata">
                <source src={`http://localhost:8000/videos/stream/${video.id}`} type="video/mp4" />
              </video>
              <div className="video-footer">
                <span className="video-title">{video.title}</span>
                <button className="btn-icon" title="Delete" disabled={deletingId === video.id} onClick={() => deleteVideo(video.id)}>
                  {deletingId === video.id ? <div className="spinner" style={{ borderTopColor: "#e07070" }} /> : <TrashIcon />}
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