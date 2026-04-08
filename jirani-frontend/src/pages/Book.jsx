import React, {useState, useEffect} from "react";
import { Loader2 } from "lucid-react";

const UploadBook = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState(null);

    const upload = async() => {
        
        setLoading(true)
        
    }
}