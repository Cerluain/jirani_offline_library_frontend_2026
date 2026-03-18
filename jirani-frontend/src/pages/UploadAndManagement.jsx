import UploadVideo from "./Video";

export default function UploadAndManagement() {
    return (
        <div
            className="min-h-screen bg-[#0A0A0A] px-5 py-10 pb-20"
            style={{
                backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(201,168,76,0.03) 39px, rgba(201,168,76,0.03) 40px)",
                fontFamily: "'IBM Plex Sans', sans-serif"
            }}
        >
            <div className="max-w-[900px] mx-auto">

                {/* Page Header */}
                <header className="relative mb-12 pb-6 border-b border-[#2a2a2a]">
                    <div className="absolute bottom-0 left-0 w-20 h-px bg-[#C9A84C]" />
                   
                    <h1
                        className="text-4xl font-bold text-[#F0EAD6] leading-tight"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        Upload And <em className="italic text-[#E2C97E]">Management</em>
                    </h1>
                    <p className="mt-2 text-sm text-[#7a7265] font-light">
                        Upload and manage your videos
                    </p>
                </header>

                {/* Content */}
                <UploadVideo />

            </div>
        </div>
    );
}