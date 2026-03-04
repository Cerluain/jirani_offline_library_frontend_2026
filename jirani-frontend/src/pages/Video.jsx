import React, { useState, useEffect} from "react";

const UploadVideo = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState(null);
    const [alert, setAlert] = useState("");
    const [loading, setLoading] = useState(false); // for loading screen
    const [videos, setVideos] = useState([])
    const url = "http://localhost:8000/videos/upload"
    
    const get_videos = async() => {
        const response = await fetch("http://localhost:8000/videos");
        const data = await response.json();
        setVideos(data)
    }

    useEffect(()=> {
        get_videos();
    }, [])



    const upload = async () => {

        if(!title.trim()){
            setAlert("Set title")
            return;
        } 
        // trim to remove whitespace

        if (!file){
            setAlert("Select a video file");
            return;
        }

        setLoading(true)
        const formData = new FormData(); // for multiform/form-data b/c files
        formData.append("title", title); // field name, value
        formData.append("description", description) 
        formData.append("file", file)
        
        try {
            const response = await fetch (url,{
                method: "POST",
                body: formData
            });

            if(!response.ok) throw new Error ("Upload failed");
            const data = await response.json();

            setAlert("Video uploaded");
            get_videos();
            setTitle("");
            setDescription("");
            setFile(null); //clearing  fields
            

        }

        catch (error){
            setAlert("Upload failed")
            console.error(error)

        }
        // regardless of if upload was successful
        finally {
            setLoading(false);
        }
    };

    return (
    <div>
        <h2> Upload Video</h2>

        <input type="text" 
        placeholder="Title" 
        value ={title}
        onChange={(e) => setTitle(e.target.value)}>

        </input>

        <textarea type="text"
        placeholder="Description"
        value = {description}
        onChange = {(e) => setDescription(e.target.value)}>

        </textarea>

        <input 
        type ="file"
        onChange = { (e) => setFile(e.target.files[0])} //single file uploads for now
        />

        <button onClick={upload} disabled={loading}>
    
                {loading ? "Uploading Video" : "Upload Video"}

        </button>
        {alert && <p>{alert}</p>} {/* shows alert if empty */}
        <h2>Videos</h2>
{videos.map((video) => (
    <div key={video.id}>
        <h3>{video.title}</h3>
        <video width="400" controls>
            <source src={`http://localhost:8000/videos/stream/${video.id}`} type="video/mp4" />
        </video>
    </div>
))}

    </div>
    );
};

export default UploadVideo;



