import React, { useEffect, useState } from "react";
import "./App.css";
import { db, auth, storage } from "./firebase/firebaseConfig";
import { logError, logWarning, logInfo, downloadLogs, clearLogs } from "./components/logger";
import {
  getDocs,
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
import { Input, Button, Checkbox, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";

function App() {
  const [movieList, setMovieList] = useState([]);
  const [newMovieTitle, setNewMovieTitle] = useState("");
  const [newReleaseDate, setNewReleaseDate] = useState(0);
  const [isNewMovieOscar, setIsNewMovieOscar] = useState(false);
  const [updatedTitles, setUpdatedTitles] = useState({});
  const [fileUpload, setFileUpload] = useState(null);
  const [error, setError] = useState(null);

  const moviesCollectionRef = collection(db, "test");

  const getMovieList = async () => {
    try { 
      const data = await getDocs(moviesCollectionRef);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setMovieList(filteredData);
      let initialUpdatedTitles = {};
      filteredData.forEach((movie) => {
        initialUpdatedTitles[movie.id] = "";
      });
      setUpdatedTitles(initialUpdatedTitles);
    } catch (err) {
      logError("Error fetching movie list", err);
      message.error("Error fetching movie list.");
    }
  };   //utilize?

  useEffect(() => {
    getMovieList();
  }, []);
  
  
  const onSubmitMovie = async () => {
    try {
      await addDoc(moviesCollectionRef, {
        title: newMovieTitle,
        releaseDate: newReleaseDate,
        receivedAnOscar: isNewMovieOscar,
      });
      logInfo("Movie added successfully");
      getMovieList();
      setNewMovieTitle("");
      setNewReleaseDate(0);
      setIsNewMovieOscar(false);
    } catch (err) {
      logError("Error adding movie", err);
      message.error("Error adding movie.");
    }
  };

  const deleteMovie = async (id) => {
    const movieDoc = doc(db, "test", id);
    try {
      await deleteDoc(movieDoc);
      logInfo(`Movie with id ${id} deleted successfully`);
      getMovieList();
    } catch (err) {
      logError("Error deleting movie", err);
      message.error("Error deleting movie.");
    }
  };

  const updateMovieTitle = async (id) => {
    const movieDoc = doc(db, "tet", id);
    const updatedTitle = updatedTitles[id];
    try {
      await updateDoc(movieDoc, { title: updatedTitle });
      logInfo(`Movie title with id ${id} updated successfully`);
      getMovieList();
      setUpdatedTitles((prevState) => ({
        ...prevState,
        [id]: "",
      }));
    } catch (err) {
      logError("Error updating movie title", err);
      message.error("Error updating movie title.");
    }
  };

  const handleTitleChange = (id, value) => {
    setUpdatedTitles((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const uploadFile = async () => {
    if (!fileUpload) return;

    const filesFolderRef = ref(storage, `projectFiles/${fileUpload.name}`);
    try {
      await uploadBytes(filesFolderRef, fileUpload);
      logInfo("File uploaded successfully");
      message.success("File uploaded successfully!");
    } catch (err) {
      logError("Error uploading file", err);
      message.error("Error uploading file.");
    }
  };

  return (
    <div className="App">
      {error && <div className="error-message">{error}</div>}
      <div className="input-container">
        <Input
          placeholder="Movie title..."
          value={newMovieTitle}
          onChange={(e) => setNewMovieTitle(e.target.value)}
        />
        <Input
          placeholder="Release Date..."
          type="number"
          value={newReleaseDate}
          onChange={(e) => setNewReleaseDate(Number(e.target.value))}
        />
        <Checkbox
          checked={isNewMovieOscar}
          onChange={(e) => setIsNewMovieOscar(e.target.checked)}
        >
          Received an Oscar
        </Checkbox>
        <Button type="primary" onClick={onSubmitMovie}>
          Submit Movie
        </Button>
      </div>

      <div className="movie-list-container">
        {movieList.map((movie) => (
          <div key={movie.id} className="movie-item">
            <h1 style={{ color: movie.receivedAnOscar ? "green" : "red" }}>
              {movie.title}
            </h1>
            <p> Date: {movie.releaseDate} </p>

            <Button type="danger" onClick={() => deleteMovie(movie.id)}>
              Delete Movie
            </Button>

            <Input
              placeholder="New title..."
              value={updatedTitles[movie.id]}
              onChange={(e) => handleTitleChange(movie.id, e.target.value)}
            />
            <Button onClick={() => updateMovieTitle(movie.id)}>
              Update Title
            </Button>
          </div>
        ))}
      </div>

      <div className="file-upload-container">
        <Upload beforeUpload={() => false} onChange={(info) => setFileUpload(info.file)}>
          <Button icon={<UploadOutlined />}>Select File</Button>
        </Upload>
        <Button onClick={uploadFile}>Upload File</Button>
      </div>

      <div className="log-actions">
        <Button onClick={downloadLogs}>Download Logs</Button>
        <Button onClick={clearLogs}>Clear Logs</Button>
      </div>
    </div>
  );
}

export default App;
