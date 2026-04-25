// pages/ReadBook.jsx
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

const ReadBook = () => {
  const { uid } = useParams()
  const navigate = useNavigate()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#0e0e0e' }}>
      {/* Back bar */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-[#2a2a2a] bg-[#111111]" style={{ flexShrink: 0 }}>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#7a7265] hover:text-[#F0EAD6] font-mono text-xs tracking-widest uppercase transition-colors"
        >
          <ArrowLeft size={14} /> Back to Library
        </button>
      </div>

      {/* PDF viewer */}
      <iframe
        src={`http://localhost:8000/books/${uid}/read`}
        style={{ flex: 1, width: '100%', border: 'none', display: 'block', minHeight: 0 }}
        title="Book Reader"
      />
    </div>
  )
}

export default ReadBook