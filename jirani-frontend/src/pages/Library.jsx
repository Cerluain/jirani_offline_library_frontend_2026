import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen, Film, Upload, X, Trash2, Loader2,
  Pencil, Check, Search, Plus, Eye, Tag, Filter
} from "lucide-react";

const BOOKS_API = "http://localhost:8000/books";
const VIDEOS_API = "http://localhost:8000/videos";
const TAGS_API = "http://localhost:8000/tags";
const PUBLISHERS_API = "http://localhost:8000/publishers";

// ── UPLOAD MODAL ──────────────────────────────────────────────────────────────
const UploadModal = ({ onClose, onSuccess, type }) => {
  const tab = type;
  const [files, setFiles] = useState([]);
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileSelect = (e) => { setFiles(Array.from(e.target.files)); e.target.value = ""; };
  const removeFile = (i) => setFiles(prev => prev.filter((_, idx) => idx !== i));

  const upload = async () => {
    if (files.length === 0) { setError("No files selected."); return; }
    setLoading(true); setError("");
    try {
      if (tab === "book") {
        for (const file of files) {
          const formData = new FormData();
          formData.append("file", file);
          if (tags.trim()) formData.append("tags", tags.trim());
          const res = await fetch(`${BOOKS_API}/upload`, { method: "POST", body: formData });
          if (!res.ok) {
            const data = await res.json().catch(() => null);
            const msg = data?.detail ?? `HTTP ${res.status}`;
            throw new Error(typeof msg === "string" ? msg : JSON.stringify(msg));
          }
        }
      } else {
        if (files.length === 1) {
          const formData = new FormData();
          formData.append("file", files[0]);
          formData.append("title", files[0].name.replace(/\.[^/.]+$/, ""));
          const res = await fetch(`${VIDEOS_API}/upload`, { method: "POST", body: formData });
          if (!res.ok) { const data = await res.json().catch(() => null); throw new Error(data?.detail ?? `HTTP ${res.status}`); }
        } else {
          const formData = new FormData();
          files.forEach(f => formData.append("files", f));
          const res = await fetch(`${VIDEOS_API}/upload_multiple`, { method: "POST", body: formData });
          if (!res.ok) { const data = await res.json().catch(() => null); throw new Error(data?.detail ?? `HTTP ${res.status}`); }
        }
      }
      onSuccess(); onClose();
    } catch (e) {
      setError(e.message || "Upload failed.");
    } finally { setLoading(false); }
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(28,26,23,0.4)", backdropFilter: "blur(6px)" }}>
      <div style={{ background: "#fff", borderRadius: 20, width: "100%", maxWidth: 440, margin: "0 16px", boxShadow: "0 32px 80px rgba(28,26,23,0.18)", overflow: "hidden" }}>
        <div style={{ padding: "22px 24px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 19, fontWeight: 600, color: "#1C1A17" }}>
            {tab === "book" ? "Add Book" : "Add Video"}
          </span>
          <button onClick={onClose} style={{ width: 34, height: 34, borderRadius: 10, border: "1px solid #E8E4DE", background: "#F7F5F2", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#6B6560" }}>
            <X size={15} />
          </button>
        </div>

        <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ position: "relative", background: "#FAFAF9", border: "2px dashed #D4CFC8", borderRadius: 14, padding: "28px 20px", textAlign: "center", cursor: "pointer" }}>
            <input type="file" accept={tab === "book" ? ".pdf,.epub" : "video/*"} multiple onChange={handleFileSelect}
              style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer", width: "100%", height: "100%" }} />
            <div style={{ width: 44, height: 44, borderRadius: 12, background: "#F5EDD8", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" }}>
              {tab === "book" ? <BookOpen size={18} color="#B8922A" /> : <Film size={18} color="#B8922A" />}
            </div>
            {files.length > 0
              ? <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, color: "#B8922A", fontWeight: 500, margin: 0 }}>{files.length} file{files.length !== 1 ? "s" : ""} selected</p>
              : <>
                  <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, color: "#1C1A17", fontWeight: 500, margin: "0 0 3px" }}>Click to browse</p>
                  <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, color: "#A09890", margin: 0 }}>{tab === "book" ? "PDF or EPUB" : "Video files"}</p>
                </>
            }
          </div>

          {files.length > 0 && (
            <div style={{ border: "1px solid #E8E4DE", borderRadius: 12, overflow: "hidden", maxHeight: 140, overflowY: "auto" }}>
              {files.map((f, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderBottom: i < files.length - 1 ? "1px solid #E8E4DE" : "none" }}>
                  <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: "#1C1A17", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</span>
                  <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "#A09890", flexShrink: 0 }}>{(f.size / (1024 * 1024)).toFixed(1)} MB</span>
                  <button onClick={() => removeFile(i)} style={{ background: "none", border: "none", cursor: "pointer", color: "#A09890", padding: 0, display: "flex" }}><X size={12} /></button>
                </div>
              ))}
            </div>
          )}

          {tab === "book" && (
            <div>
              <label style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, color: "#6B6560", display: "block", marginBottom: 6 }}>Tags (optional, comma separated)</label>
              <input type="text" placeholder="history, science, fiction..." value={tags} onChange={e => setTags(e.target.value)}
                style={{ width: "100%", padding: "10px 14px", border: "1px solid #E8E4DE", borderRadius: 10, fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, color: "#1C1A17", outline: "none", boxSizing: "border-box" }} />
            </div>
          )}

          {error && (
            <div style={{ padding: "10px 14px", background: "#FEF2F0", border: "1px solid #FADADD", borderRadius: 10, fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: "#D94F3D" }}>
              {error}
            </div>
          )}

          <button onClick={upload} disabled={loading || files.length === 0}
            style={{ padding: "13px 0", background: files.length === 0 || loading ? "#E8E4DE" : "#B8922A", color: files.length === 0 || loading ? "#A09890" : "#fff", border: "none", borderRadius: 12, fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14, fontWeight: 600, cursor: files.length === 0 || loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            {loading ? <><Loader2 size={14} className="spin" /> Uploading...</> : <><Upload size={14} /> Upload</>}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── BOOK EDIT MODAL ───────────────────────────────────────────────────────────
const BookEditModal = ({ book, publishers, onClose, onUpdate }) => {
  const [title, setTitle] = useState(book.title || "");
  const [tags, setTags] = useState(book.tags?.map(t => t.name).join(", ") || "");
  const [publisherId, setPublisherId] = useState(book.publisher_id || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const save = async () => {
    setSaving(true); setError("");
    try {
      const formData = new FormData();
      if (title.trim()) formData.append("title", title.trim());
      formData.append("tags", tags.trim());
      if (publisherId) formData.append("publisher_id", publisherId);
      const res = await fetch(`${BOOKS_API}/${book.uid}`, { method: "PUT", body: formData });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.detail ?? `HTTP ${res.status}`);
      }
      const updated = await res.json();
      onUpdate(updated);
      onClose();
    } catch (e) {
      setError(e.message || "Failed to save.");
    } finally { setSaving(false); }
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(28,26,23,0.4)", backdropFilter: "blur(6px)" }}>
      <div style={{ background: "#fff", borderRadius: 20, width: "100%", maxWidth: 420, margin: "0 16px", boxShadow: "0 32px 80px rgba(28,26,23,0.18)", overflow: "hidden" }}>
        <div style={{ padding: "22px 24px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 19, fontWeight: 600, color: "#1C1A17" }}>Edit Book</span>
          <button onClick={onClose} style={{ width: 34, height: 34, borderRadius: 10, border: "1px solid #E8E4DE", background: "#F7F5F2", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#6B6560" }}>
            <X size={15} />
          </button>
        </div>

        <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, color: "#6B6560", display: "block", marginBottom: 6 }}>Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Book title..."
              style={{ width: "100%", padding: "10px 14px", border: "1px solid #E8E4DE", borderRadius: 10, fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, color: "#1C1A17", outline: "none", boxSizing: "border-box" }} />
          </div>

          <div>
            <label style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, color: "#6B6560", display: "block", marginBottom: 6 }}>Tags (comma separated)</label>
            <input value={tags} onChange={e => setTags(e.target.value)} placeholder="history, science, fiction..."
              style={{ width: "100%", padding: "10px 14px", border: "1px solid #E8E4DE", borderRadius: 10, fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, color: "#1C1A17", outline: "none", boxSizing: "border-box" }} />
          </div>

          <div>
            <label style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, color: "#6B6560", display: "block", marginBottom: 6 }}>Publisher</label>
            <select value={publisherId} onChange={e => setPublisherId(e.target.value)}
              style={{ width: "100%", padding: "10px 14px", border: "1px solid #E8E4DE", borderRadius: 10, fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, color: publisherId ? "#1C1A17" : "#A09890", outline: "none", background: "#fff", boxSizing: "border-box" }}>
              <option value="">No publisher</option>
              {publishers.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>

          {error && (
            <div style={{ padding: "10px 14px", background: "#FEF2F0", border: "1px solid #FADADD", borderRadius: 10, fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: "#D94F3D" }}>
              {error}
            </div>
          )}

          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={save} disabled={saving}
              style={{ flex: 1, padding: "12px 0", background: saving ? "#E8E4DE" : "#B8922A", color: saving ? "#A09890" : "#fff", border: "none", borderRadius: 10, fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, fontWeight: 600, cursor: saving ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              {saving ? <><Loader2 size={13} className="spin" /> Saving...</> : <><Check size={13} /> Save</>}
            </button>
            <button onClick={onClose}
              style={{ flex: 1, padding: "12px 0", background: "#F7F5F2", color: "#6B6560", border: "1px solid #E8E4DE", borderRadius: 10, fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, cursor: "pointer" }}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── BOOK CARD ─────────────────────────────────────────────────────────────────
const BookCard = ({ book, onDelete, onEdit }) => {
  const [deleting, setDeleting] = useState(false);
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  const handleDelete = async (e) => {
    e.stopPropagation();
    setDeleting(true);
    try { await fetch(`${BOOKS_API}/${book.uid}`, { method: "DELETE" }); onDelete(book.uid); }
    finally { setDeleting(false); }
  };

  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ background: "#fff", borderRadius: 14, overflow: "hidden", border: "1px solid #E8E4DE", boxShadow: hovered ? "0 10px 36px rgba(28,26,23,0.11)" : "0 1px 4px rgba(28,26,23,0.05)", transform: hovered ? "translateY(-3px)" : "translateY(0)", transition: "all 0.2s ease", display: "flex", flexDirection: "column" }}>
      <div style={{ position: "relative", aspectRatio: "2/3", background: "#F7F5F2", overflow: "hidden" }}>
        {book.cover_url
          ? <img src={`http://localhost:8000${book.cover_url}`} alt={book.title}
              style={{ width: "100%", height: "100%", objectFit: "cover", transform: hovered ? "scale(1.04)" : "scale(1)", transition: "transform 0.3s ease" }} />
          : <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, padding: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "#F5EDD8", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <BookOpen size={20} color="#B8922A" />
              </div>
              <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 11, color: "#A09890", textAlign: "center", lineHeight: 1.4 }}>{book.title}</span>
            </div>
        }
        <div style={{ position: "absolute", top: 8, left: 8 }}>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, fontWeight: 500, padding: "3px 8px", borderRadius: 20, background: book.extension === "epub" ? "#F0FAF4" : "#FEF2F0", color: book.extension === "epub" ? "#2D7A4F" : "#D94F3D", textTransform: "uppercase", letterSpacing: "0.03em" }}>
            {book.extension}
          </span>
        </div>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(28,26,23,0.65) 0%, transparent 55%)", opacity: hovered ? 1 : 0, transition: "opacity 0.2s ease", display: "flex", alignItems: "flex-end", padding: 10, gap: 6, justifyContent: "flex-end" }}>
          <button onClick={(e) => { e.stopPropagation(); navigate(`/read/${book.uid}`); }}
            style={{ width: 34, height: 34, borderRadius: 9, background: "rgba(255,255,255,0.95)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#B8922A" }}>
            <Eye size={14} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); onEdit(book); }}
            style={{ width: 34, height: 34, borderRadius: 9, background: "rgba(255,255,255,0.95)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#6B6560" }}>
            <Pencil size={14} />
          </button>
          <button onClick={handleDelete} disabled={deleting}
            style={{ width: 34, height: 34, borderRadius: 9, background: "rgba(255,255,255,0.95)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#D94F3D", opacity: deleting ? 0.4 : 1 }}>
            {deleting ? <Loader2 size={13} className="spin" /> : <Trash2 size={13} />}
          </button>
        </div>
      </div>
      <div style={{ padding: "12px 13px", flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
        <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, fontWeight: 500, color: "#1C1A17", lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {book.title}
        </span>
        {book.tags?.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {book.tags.slice(0, 3).map(tag => (
              <span key={tag.id || tag.name} style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 10, padding: "2px 8px", borderRadius: 20, background: "#F5EDD8", color: "#B8922A", fontWeight: 500 }}>
                {tag.name}
              </span>
            ))}
            {book.tags.length > 3 && <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 10, color: "#A09890" }}>+{book.tags.length - 3}</span>}
          </div>
        )}
      </div>
    </div>
  );
};

// ── VIDEO CARD ────────────────────────────────────────────────────────────────
const VideoCard = ({ video, onDelete, onUpdate }) => {
  const [deleting, setDeleting] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(video.title);
  const [editDesc, setEditDesc] = useState(video.description || "");

  const handleDelete = async () => {
    setDeleting(true);
    try { await fetch(`${VIDEOS_API}/${video.id}`, { method: "DELETE" }); onDelete(video.id); }
    finally { setDeleting(false); }
  };

  const saveEdit = async () => {
    const params = new URLSearchParams();
    if (editTitle.trim()) params.append("title", editTitle.trim());
    params.append("description", editDesc);
    const res = await fetch(`${VIDEOS_API}/${video.id}?${params}`, { method: "PATCH" });
    if (res.ok) { const updated = await res.json(); onUpdate(updated); setEditing(false); }
  };

  return (
    <div style={{ background: "#fff", borderRadius: 14, overflow: "hidden", border: "1px solid #E8E4DE", boxShadow: "0 1px 4px rgba(28,26,23,0.05)" }}>
      <video controls preload="metadata" style={{ width: "100%", display: "block", background: "#000", maxHeight: 160, objectFit: "cover" }}>
        <source src={`${VIDEOS_API}/stream/${video.id}`} type="video/mp4" />
      </video>
      {editing ? (
        <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 8, borderTop: "1px solid #E8E4DE" }}>
          <input autoFocus value={editTitle} onChange={e => setEditTitle(e.target.value)} placeholder="Title..."
            style={{ padding: "9px 12px", border: "1.5px solid #B8922A", borderRadius: 9, fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, color: "#1C1A17", outline: "none" }} />
          <input value={editDesc} onChange={e => setEditDesc(e.target.value)} placeholder="Description (optional)..."
            style={{ padding: "9px 12px", border: "1px solid #E8E4DE", borderRadius: 9, fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, color: "#6B6560", outline: "none" }} />
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={saveEdit} style={{ flex: 1, padding: "9px 0", background: "#B8922A", color: "#fff", border: "none", borderRadius: 9, fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <Check size={12} /> Save
            </button>
            <button onClick={() => setEditing(false)} style={{ flex: 1, padding: "9px 0", background: "#F7F5F2", color: "#6B6560", border: "1px solid #E8E4DE", borderRadius: 9, fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <X size={12} /> Cancel
            </button>
          </div>
        </div>
      ) : (
        <div style={{ padding: "12px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, borderTop: "1px solid #E8E4DE" }}>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, fontWeight: 500, color: "#1C1A17", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", margin: 0 }}>{video.title}</p>
            {video.description && <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 11, color: "#A09890", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", margin: "2px 0 0" }}>{video.description}</p>}
          </div>
          <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
            <button onClick={() => setEditing(true)} style={{ width: 30, height: 30, borderRadius: 8, border: "1px solid #E8E4DE", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#6B6560" }}>
              <Pencil size={12} />
            </button>
            <button onClick={handleDelete} disabled={deleting} style={{ width: 30, height: 30, borderRadius: 8, border: "1px solid #FADADD", background: "#FEF2F0", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#D94F3D", opacity: deleting ? 0.4 : 1 }}>
              {deleting ? <Loader2 size={12} className="spin" /> : <Trash2 size={12} />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ── EMPTY STATE ───────────────────────────────────────────────────────────────
const EmptyState = ({ tab, onUpload }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 16, textAlign: "center" }}>
    <div style={{ width: 68, height: 68, borderRadius: 20, background: "#F5EDD8", display: "flex", alignItems: "center", justifyContent: "center" }}>
      {tab === "books" ? <BookOpen size={28} color="#B8922A" /> : <Film size={28} color="#B8922A" />}
    </div>
    <div>
      <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 600, color: "#1C1A17", margin: "0 0 6px" }}>No {tab} yet</p>
      <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, color: "#A09890", margin: 0 }}>Upload some {tab} to get started</p>
    </div>
    <button onClick={onUpload} style={{ padding: "11px 22px", background: "#B8922A", color: "#fff", border: "none", borderRadius: 10, fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
      <Plus size={14} /> Add {tab === "books" ? "Books" : "Videos"}
    </button>
  </div>
);

// ── MAIN APP ──────────────────────────────────────────────────────────────────
const Library = () => {
  const [activeTab, setActiveTab] = useState("books");
  const [books, setBooks] = useState([]);
  const [videos, setVideos] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [search, setSearch] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBooks = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedTags.length > 0) params.set("tags", selectedTags.join(","));
      if (search.trim()) params.set("title", search.trim());
      const res = await fetch(`${BOOKS_API}/search/?${params}`);
      if (res.ok) setBooks(await res.json());
    } catch {}
  };

  const fetchVideos = async () => {
    try { const res = await fetch(`${VIDEOS_API}/`); if (res.ok) setVideos(await res.json()); } catch {}
  };

  const fetchTags = async () => {
    try { const res = await fetch(TAGS_API); if (res.ok) setAllTags(await res.json()); } catch {}
  };

  const fetchPublishers = async () => {
    try { const res = await fetch(PUBLISHERS_API); if (res.ok) setPublishers(await res.json()); } catch {}
  };

  useEffect(() => {
    Promise.all([fetchBooks(), fetchVideos(), fetchTags(), fetchPublishers()]).finally(() => setLoading(false));
  }, []);

  // Re-fetch books when tag filter or search changes
  useEffect(() => {
    if (!loading) fetchBooks();
  }, [selectedTags, search]);

  const toggleTag = (tagName) => {
    setSelectedTags(prev =>
      prev.includes(tagName) ? prev.filter(t => t !== tagName) : [...prev, tagName]
    );
  };

  const filteredVideos = videos.filter(v => v.title.toLowerCase().includes(search.toLowerCase()));

  const tabs = [
    { id: "books", label: "Books", icon: BookOpen, count: books.length },
    { id: "videos", label: "Videos", icon: Film, count: videos.length },
  ];

  return (
    <div style={{ display: "flex", height: "100vh", background: "#fff", fontFamily: "'IBM Plex Sans', sans-serif", overflow: "hidden" }}>

      {/* ── SIDEBAR ── */}
      <aside style={{ width: 220, flexShrink: 0, background: "#fff", borderRight: "1px solid #E8E4DE", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid #E8E4DE" }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 21, fontWeight: 700, color: "#1C1A17", margin: 0, letterSpacing: "-0.01em" }}>Jirani</h1>
          <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "#A09890", margin: "4px 0 0", textTransform: "uppercase", letterSpacing: "0.08em" }}>Offline Library</p>
        </div>

        <nav style={{ padding: "12px 10px" }}>
          {tabs.map(({ id, label, icon: Icon, count }) => (
            <button key={id} onClick={() => { setActiveTab(id); setSelectedTags([]); setSearch(""); }}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, border: "none", background: activeTab === id ? "#F5EDD8" : "transparent", color: activeTab === id ? "#B8922A" : "#6B6560", cursor: "pointer", marginBottom: 2, textAlign: "left", fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, fontWeight: activeTab === id ? 600 : 400, transition: "all 0.15s" }}>
              <Icon size={15} />
              <span style={{ flex: 1 }}>{label}</span>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, padding: "1px 8px", borderRadius: 20, background: activeTab === id ? "#B8922A" : "#F0EDE8", color: activeTab === id ? "#fff" : "#A09890" }}>
                {count}
              </span>
            </button>
          ))}
        </nav>

        {/* Tag filter — only show on books tab */}
        {activeTab === "books" && allTags.length > 0 && (
          <div style={{ padding: "0 10px 12px", flex: 1, overflowY: "auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 4px 8px", marginBottom: 4 }}>
              <Filter size={11} color="#A09890" />
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "#A09890", textTransform: "uppercase", letterSpacing: "0.08em" }}>Filter by tag</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {allTags.map(tag => (
                <button key={tag.id} onClick={() => toggleTag(tag.name)}
                  style={{ width: "100%", textAlign: "left", padding: "7px 10px", borderRadius: 8, border: "none", background: selectedTags.includes(tag.name) ? "#F5EDD8" : "transparent", color: selectedTags.includes(tag.name) ? "#B8922A" : "#6B6560", cursor: "pointer", fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, fontWeight: selectedTags.includes(tag.name) ? 600 : 400, transition: "all 0.15s", display: "flex", alignItems: "center", gap: 7 }}>
                  <Tag size={10} />
                  {tag.name}
                </button>
              ))}
            </div>
            {selectedTags.length > 0 && (
              <button onClick={() => setSelectedTags([])}
                style={{ width: "100%", marginTop: 8, padding: "7px 10px", borderRadius: 8, border: "1px solid #E8E4DE", background: "#fff", color: "#A09890", cursor: "pointer", fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
                <X size={10} /> Clear filters
              </button>
            )}
          </div>
        )}
      </aside>

      {/* ── MAIN ── */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, background: "#FAFAF9" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 28px", background: "#fff", borderBottom: "1px solid #E8E4DE" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 600, color: "#1C1A17", margin: 0, letterSpacing: "-0.01em" }}>
            {activeTab === "books" ? "Books" : "Videos"}
          </h2>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, padding: "2px 9px", borderRadius: 20, background: "#F5EDD8", color: "#B8922A" }}>
            {activeTab === "books" ? books.length : filteredVideos.length}
          </span>

          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#F7F5F2", border: "1px solid #E8E4DE", borderRadius: 10, padding: "9px 14px", width: 230 }}>
              <Search size={14} color="#A09890" style={{ flexShrink: 0 }} />
              <input type="text" placeholder={`Search ${activeTab}...`} value={search} onChange={e => setSearch(e.target.value)}
                style={{ background: "transparent", border: "none", outline: "none", fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, color: "#1C1A17", width: "100%" }} />
            </div>
            <button onClick={() => setShowUpload(true)}
              onMouseEnter={e => e.currentTarget.style.background = "#F5EDD8"}
              onMouseLeave={e => e.currentTarget.style.background = "#fff"}
              style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 16px", background: "#fff", border: "1.5px solid #B8922A", borderRadius: 10, fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, fontWeight: 500, color: "#B8922A", cursor: "pointer", transition: "background 0.15s", whiteSpace: "nowrap" }}>
              <Upload size={13} />
              Upload {activeTab === "books" ? "Book" : "Video"}
            </button>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
          {loading ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
              <Loader2 size={26} color="#B8922A" className="spin" />
            </div>
          ) : activeTab === "books" ? (
            books.length === 0
              ? <EmptyState tab="books" onUpload={() => setShowUpload(true)} />
              : <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(148px, 1fr))", gap: 16 }}>
                  {books.map(book => (
                    <BookCard key={book.uid} book={book}
                      onDelete={uid => setBooks(prev => prev.filter(b => b.uid !== uid))}
                      onEdit={setEditingBook}
                    />
                  ))}
                </div>
          ) : (
            filteredVideos.length === 0
              ? <EmptyState tab="videos" onUpload={() => setShowUpload(true)} />
              : <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
                  {filteredVideos.map(video => (
                    <VideoCard key={video.id} video={video}
                      onDelete={id => setVideos(prev => prev.filter(v => v.id !== id))}
                      onUpdate={updated => setVideos(prev => prev.map(v => v.id === updated.id ? updated : v))} />
                  ))}
                </div>
          )}
        </div>
      </main>

      {showUpload && (
        <UploadModal
          onClose={() => setShowUpload(false)}
          onSuccess={() => { fetchBooks(); fetchVideos(); fetchTags(); }}
          type={activeTab === "books" ? "book" : "video"}
        />
      )}

      {editingBook && (
        <BookEditModal
          book={editingBook}
          publishers={publishers}
          onClose={() => setEditingBook(null)}
          onUpdate={updated => {
            setBooks(prev => prev.map(b => b.uid === updated.uid ? updated : b));
            setEditingBook(null);
            fetchTags();
          }}
        />
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }
        * { box-sizing: border-box; }
        input::placeholder { color: #A09890; }
        button { transition: all 0.15s ease; }
      `}</style>
    </div>
  );
};

//comment
export default Library;