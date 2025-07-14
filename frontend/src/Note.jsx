import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import axios from 'axios';
import { useEffect } from "react";

export default function Note() {
  const navigate = useNavigate();
  const [isClicked, setIsClicked] = useState(false);
  const [notes, setNotes] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [editNoteId, setEditNoteId] = useState(null);
  const apiUrl = "https://notesapp-qobz.onrender.com";

  const { email, profilePic, logOut } = useContext(UserContext);

  const [userData, setUserData] = useState({
    userTitle: "",
    userNote: "",
    userTags: [],
  });

  const userName = email.split("@")[0];

  const getFun = () => {
    setIsClicked(!isClicked);
  };

  const changeNoteData = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const saveData = async (e) => {
    e.preventDefault();
    
    try{
          if(editNoteId){
            //edit existing note
            await axios.put(`${apiUrl}/api/notes/update/${editNoteId}`,{
                title : userData.userTitle,
                content : userData.userNote,
                tag : userData.userTags
            });
            await fetchNotes();
            setEditNoteId(null);
          }
          else{
                 //Creating new note
                  const res = await axios.post(`${apiUrl}/api/notes/create`,{
             title : userData.userTitle,
             content : userData.userNote,
             tag : userData.userTags
          });
        
            setNotes((prevNote) => [...prevNote, res.data]);
          }
         setUserData({
      userTitle: "",
      userNote: "",
      userTags: [],
    });
    setNewTag("");
    setIsClicked(false);
    }
    catch(err){
       console.log("failed to fetch data");
    }

    // setSaveNote((prevNote) => [...prevNote, userData]);
  };

  const handleLogout = () => {
    logOut();
    navigate("/login");
  };

  const addTag = () =>{
     if(newTag.trim() !== ""){
        setUserData((prevData)=> ({
            ...prevData,
            userTags : [...prevData.userTags, newTag.trim()]
        }));
        setNewTag("");
     }
  }

  useEffect(()=>{
     fetchNotes();
  },[]);

  const fetchNotes = async () =>{
        try{
            const res = await axios.get(`${apiUrl}/api/notes/all`);
            setNotes(res.data);
        }
        catch(err){
           console.log("Failed to fetch notes");
        }
  }

  const deleteNote = async (id) =>{
    console.log("trying to delete id : ", id);
    if(!window.confirm("Are you sure you want to delete this note?")) return;
      try{
           await axios.delete(`${apiUrl}/api/notes/delete/${id}`);
      setNotes((prevId) => prevId.filter((note) => note._id !== id));
      }
      catch(err){
          console.log("Failed to Delete Notes");
      }
  }

  const editingNotes = (note) =>{
     setUserData({
         userTitle : note.title,
         userNote : note.content,
         userTags : Array.isArray(note.tag)?note.tag:[]
     });
     setEditNoteId(note._id);
     setIsClicked(true);
  }

console.log(notes);

  return (
    <div className="note-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo">
          <h2>NOTES APP</h2>
        </div>

        {/* http://localhost:4000/ */}
        {profilePic ? (
          <img
            src={`${apiUrl}/${profilePic}`}
            alt="Profile"
            style={{
              height: "100px",
              width: "100px",
              borderRadius: "50%",
              objectFit: "cover",
              marginBottom: "10px",
            }}
          />
        ) : (
          <div
            style={{
              height: "100px",
              width: "100px",
              borderRadius: "50%",
              backgroundColor: "#ccc",
              marginBottom: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              color: "#555",
            }}
          >
            No Image
          </div>
        )}

        <p className="username">
          <b>👤 @{userName || "User"}</b>
        </p>
        <button onClick={getFun} className="add-btn">
          {isClicked ? "× Close Note" : "+ Add Note"}
        </button>
        <button
          onClick={handleLogout}
          className="add-btn"
          style={{ marginTop: "10px", backgroundColor: "#ef4444" }}
        >
          🚪 Logout
        </button>
        <div className="footer">© 2025 NotesApp</div>
      </div>

      {/* Content area */}
      <div className="content">
        <h1>Welcome to your notes <span className="userName">@{userName}</span></h1>

        {/* Toggle Note Form */}
        {isClicked && (
          <div className="note-box">
            <div className="note-head">
              <input
                type="text"
                name="userTitle"
                placeholder="Enter note title"
                className="note-title"
                value={userData.userTitle}
                onChange={changeNoteData}
              />
              <textarea
                name="userNote"
                placeholder="Write your content..."
                className="note-textarea"
                value={userData.userNote}
                onChange={changeNoteData}
              ></textarea>
    {/* Tags data */}
              <input
                type="text"
                name="userTag"
                className="note-input"
                placeholder="type tags.."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e)=>{
                    if(e.key === "Enter"){
                        e.preventDefault();
                        addTag();
                    }
                }}
              />
              <button onClick={addTag} className="save-btn">Add Tag</button>

        {/* show tags before saving       */}
        <div className="tags-preview">
          {userData.userTags.map((tag, index)=>(
              <span key={index} className="note-tag">#{tag}</span>
          ))}
        </div>

              <button onClick={saveData} className="save-btn">
                Save
              </button>
            </div>
          </div>
        )}

        {/* Show Notes on Screen */}

        <div className="notesData">
          {notes.map((note, index) => (
            <div className="div" key={note._id}>
              <h3>{note.title}</h3>
              <p>{note.content}</p>
              <small>Created on : {new Date(note.createdAt).toLocaleString()}</small>
              
              <div className="tags-preview">
                {Array.isArray(note.tag)&&note.tag.map((tag, i)=>(
                  <span className="note-tag" key={i}>#{tag}</span>
                ))}
              </div>

              <button onClick={()=> editingNotes(note)} className="edit-btn">
                  Edit
                </button>
              <button onClick={() => deleteNote(note._id)} className="delete-btn">Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
