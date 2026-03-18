import UploadVideo from "./Video";
import { theme } from "../styles/theme";

export default function UploadAndManagement() {
    return (
        <>
            <style>{theme}</style>
            <div className="page">
                <div className="container">
                    <header className="page-header">
                        <p className="eyebrow">Jirani Offline Library · Media</p>
                        <h1>Upload And <em>Management</em></h1>
                        <p>Upload and manage your videos</p>
                    </header>
                    <UploadVideo />
                </div>
            </div>
        </>
    );
}