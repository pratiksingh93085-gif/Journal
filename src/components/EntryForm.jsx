import { useState } from "react";
import { db, storage } from "../firebase";
import { ref, push } from "firebase/database";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { checkGrammar } from "../utils/checkGrammar";

function EntryForm() {
  const [entry, setEntry] = useState("");
  const [mood, setMood] = useState("😊 Happy");
  const [errors, setErrors] = useState([]);
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const detectSentiment = (text) => {
    const positiveWords = ["happy", "great", "good", "amazing", "love"];
    const negativeWords = ["sad", "bad", "angry", "upset", "hate"];
    let score = 0;
    const lowerText = text.toLowerCase();
    positiveWords.forEach(word => { if (lowerText.includes(word)) score++; });
    negativeWords.forEach(word => { if (lowerText.includes(word)) score--; });
    if (score > 0) return "Positive";
    if (score < 0) return "Negative";
    return "Neutral";
  };

  const handleCheckGrammar = async () => {
    const result = await checkGrammar(entry);
    setErrors(result);
  };

  const applySuggestion = (suggestion, offset, length) => {
    const corrected =
      entry.substring(0, offset) + suggestion + entry.substring(offset + length);
    setEntry(corrected);
    setErrors([]);
  };

  // ✅ Handle photo selection and show preview
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // only allow images
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    // max 5MB check
    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be under 5MB.");
      return;
    }

    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  // ✅ Remove selected photo before saving
  const handleRemovePhoto = () => {
    setPhoto(null);
    setPhotoPreview(null);
  };

  // ✅ Upload photo to Firebase Storage and return download URL
  const uploadPhoto = async (file) => {
    const fileName = `photos/${Date.now()}_${file.name}`;
    const photoRef = storageRef(storage, fileName);
    await uploadBytes(photoRef, file);
    const url = await getDownloadURL(photoRef);
    return url;
  };

  const handleSave = async () => {
    if (!entry.trim()) {
      alert("Please write something before saving.");
      return;
    }

    setUploading(true);

    try {
      const sentiment = detectSentiment(entry);
      let photoURL = null;

      // upload photo first if one is selected
      if (photo) {
        photoURL = await uploadPhoto(photo);
      }

      const journalRef = ref(db, "entries");
      await push(journalRef, {
        text: entry,
        date: new Date().toLocaleString(),
        mood,
        sentiment,
        photoURL: photoURL || null,
      });

      // reset form
      setEntry("");
      setErrors([]);
      setPhoto(null);
      setPhotoPreview(null);

    } catch (error) {
      console.error("Save error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h2>Write Your Journal</h2>

      <textarea
        value={entry}
        onChange={(e) => setEntry(e.target.value)}
        placeholder="Write here..."
        rows={5}
        style={{ width: "100%" }}
      />

      <br /><br />

      <select value={mood} onChange={(e) => setMood(e.target.value)}>
        <option>😊 Happy</option>
        <option>😔 Sad</option>
        <option>😡 Angry</option>
        <option>😌 Calm</option>
        <option>😴 Tired</option>
      </select>

      <br /><br />

      {/* ✅ Photo upload section */}
      <div>
        <label
          htmlFor="photo-upload"
          style={{
            display: "inline-block",
            padding: "6px 14px",
            border: "1px dashed #aaa",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "13px",
          }}
        >
          📷 Attach Photo
        </label>
        <input
          id="photo-upload"
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          style={{ display: "none" }}
        />
      </div>

      {/* ✅ Photo preview */}
      {photoPreview && (
        <div style={{ marginTop: "12px", position: "relative", display: "inline-block" }}>
          <img
            src={photoPreview}
            alt="preview"
            style={{
              width: "160px",
              height: "160px",
              objectFit: "cover",
              borderRadius: "8px",
              border: "1px solid #ddd",
            }}
          />
          <button
            onClick={handleRemovePhoto}
            style={{
              position: "absolute",
              top: "4px",
              right: "4px",
              background: "rgba(0,0,0,0.6)",
              color: "#fff",
              border: "none",
              borderRadius: "50%",
              width: "22px",
              height: "22px",
              cursor: "pointer",
              fontSize: "12px",
            }}
          >
            ✕
          </button>
        </div>
      )}

      <br /><br />

      <button onClick={handleCheckGrammar}>Check Grammar</button>
      <button
        onClick={handleSave}
        disabled={uploading}
        style={{ marginLeft: "8px", opacity: uploading ? 0.6 : 1 }}
      >
        {uploading ? "Saving..." : "Save"}
      </button>

      {/* Grammar errors */}
      <div>
        {errors.map((err, index) => (
          <div key={index}>
            <p>Incorrect: "{entry.substring(err.offset, err.offset + err.length)}"</p>
            <p>Suggestion: {err.message}</p>
            {err.suggestions.slice(0, 3).map((suggestion, i) => (
              <button
                key={i}
                onClick={() => applySuggestion(suggestion, err.offset, err.length)}
              >
                {suggestion}
              </button>
            ))}
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
}

export default EntryForm;