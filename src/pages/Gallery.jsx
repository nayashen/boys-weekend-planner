import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useTrip } from "../context/TripContext";

function Gallery() {
  const { tripSettings } = useTrip();

  const [media, setMedia] = useState([]);
  const [activeTab, setActiveTab] =
    useState("photos");

  const [loading, setLoading] =
    useState(true);

  const [uploading, setUploading] =
    useState(false);

  const tripName =
    tripSettings.tripName ||
    "Boys Weekend";

  // =========================
  // LOAD MEDIA
  // =========================

  useEffect(() => {
    loadMedia();
  }, [tripName]);

  async function loadMedia() {
    setLoading(true);

    const { data, error } =
      await supabase
        .from("gallery_items")
        .select("*")
        .eq("trip_name", tripName)
        .order("created_at", {
          ascending: false,
        });

    if (error) {
      console.error(
        "DATABASE LOAD ERROR:",
        error
      );

      alert(
        "Could not load gallery:\n\n" +
          error.message
      );
    } else {
      setMedia(data || []);
    }

    setLoading(false);
  }

  // =========================
  // UPLOAD MEDIA
  // =========================

  async function handleUpload(event) {
    const files = Array.from(
      event.target.files || []
    );

    if (files.length === 0) {
      return;
    }

    setUploading(true);

    for (const file of files) {
      try {
        console.log(
          "Starting upload:",
          file.name
        );

        const mediaType =
          file.type.startsWith("video/")
            ? "video"
            : "photo";

        const folder =
          mediaType === "video"
            ? "videos"
            : "photos";

        const safeTripName =
          tripName
            .trim()
            .replace(
              /[^a-zA-Z0-9-_]/g,
              "-"
            );

        const safeFileName =
          file.name.replace(
            /[^a-zA-Z0-9._-]/g,
            "-"
          );

        const filePath =
          `${safeTripName}/${folder}/${Date.now()}-${safeFileName}`;

        console.log(
          "Uploading to:",
          filePath
        );

        // =========================
        // UPLOAD TO STORAGE
        // =========================

        const {
          data: uploadData,
          error: uploadError,
        } =
          await supabase.storage
            .from("trip-media")
            .upload(
              filePath,
              file,
              {
                cacheControl: "3600",
                upsert: false,
              }
            );

        if (uploadError) {
          console.error(
            "STORAGE UPLOAD ERROR:",
            uploadError
          );

          throw new Error(
            "Storage upload failed: " +
              uploadError.message
          );
        }

        console.log(
          "Storage upload successful:",
          uploadData
        );

        // =========================
        // GET PUBLIC URL
        // =========================

        const {
          data: publicUrlData,
        } =
          supabase.storage
            .from("trip-media")
            .getPublicUrl(filePath);

        const publicUrl =
          publicUrlData.publicUrl;

        console.log(
          "Public URL:",
          publicUrl
        );

        // =========================
        // SAVE TO DATABASE
        // =========================

        const {
          data: databaseData,
          error: databaseError,
        } =
          await supabase
            .from("gallery_items")
            .insert([
              {
                trip_name: tripName,
                name: file.name,
                type: mediaType,
                storage_path: filePath,
                url: publicUrl,
              },
            ])
            .select();

        if (databaseError) {
          console.error(
            "DATABASE INSERT ERROR:",
            databaseError
          );

          throw new Error(
            "Database insert failed: " +
              databaseError.message
          );
        }

        console.log(
          "Database record created:",
          databaseData
        );

        console.log(
          "UPLOAD SUCCESSFUL:",
          file.name
        );
      } catch (error) {
        console.error(
          "FINAL UPLOAD ERROR:",
          error
        );

        alert(
          `Failed to upload ${file.name}\n\n${error.message}`
        );
      }
    }

    setUploading(false);

    await loadMedia();

    event.target.value = "";
  }

  // =========================
  // DELETE MEDIA
  // =========================

  async function deleteMedia(item) {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this media?"
      );

    if (!confirmed) {
      return;
    }

    try {
      // Delete from Storage
      const {
        error: storageError,
      } =
        await supabase.storage
          .from("trip-media")
          .remove([
            item.storage_path,
          ]);

      if (storageError) {
        throw new Error(
          "Storage delete failed: " +
            storageError.message
        );
      }

      // Delete from Database
      const {
        error: databaseError,
      } =
        await supabase
          .from("gallery_items")
          .delete()
          .eq("id", item.id);

      if (databaseError) {
        throw new Error(
          "Database delete failed: " +
            databaseError.message
        );
      }

      setMedia((currentMedia) =>
        currentMedia.filter(
          (mediaItem) =>
            mediaItem.id !== item.id
        )
      );
    } catch (error) {
      console.error(
        "DELETE ERROR:",
        error
      );

      alert(
        "Failed to delete media:\n\n" +
          error.message
      );
    }
  }

  // =========================
  // FILTER
  // =========================

  const photos = media.filter(
    (item) =>
      item.type === "photo"
  );

  const videos = media.filter(
    (item) =>
      item.type === "video"
  );

  const displayedMedia =
    activeTab === "photos"
      ? photos
      : videos;

  // =========================
  // DISPLAY
  // =========================

  return (
    <div
      style={{
        padding: "30px",
        maxWidth: "1400px",
        margin: "0 auto",
      }}
    >
      <h1>📸 Gallery</h1>

      <div
        style={{
          background: "white",
          padding: "25px",
          borderRadius: "12px",
          marginTop: "20px",
          marginBottom: "30px",
          boxShadow:
            "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        <h2>
          📁 {tripName}
        </h2>

        <p
          style={{
            color: "#666",
          }}
        >
          Photos and videos uploaded
          for this trip.
        </p>

        <div
          style={{
            display: "flex",
            gap: "15px",
            flexWrap: "wrap",
            marginTop: "20px",
          }}
        >
          {/* PHOTOS */}

          <label
            style={{
              background: "#2563eb",
              color: "white",
              padding: "12px 18px",
              borderRadius: "8px",
              cursor: uploading
                ? "not-allowed"
                : "pointer",
              fontWeight: "bold",
              opacity: uploading
                ? 0.6
                : 1,
            }}
          >
            📷 Upload Photos

            <input
              type="file"
              accept="image/*"
              multiple
              disabled={uploading}
              onChange={handleUpload}
              style={{
                display: "none",
              }}
            />
          </label>

          {/* VIDEOS */}

          <label
            style={{
              background: "#7c3aed",
              color: "white",
              padding: "12px 18px",
              borderRadius: "8px",
              cursor: uploading
                ? "not-allowed"
                : "pointer",
              fontWeight: "bold",
              opacity: uploading
                ? 0.6
                : 1,
            }}
          >
            🎥 Upload Videos

            <input
              type="file"
              accept="video/*"
              multiple
              disabled={uploading}
              onChange={handleUpload}
              style={{
                display: "none",
              }}
            />
          </label>
        </div>

        {uploading && (
          <p
            style={{
              marginTop: "15px",
              color: "#2563eb",
              fontWeight: "bold",
            }}
          >
            ⏳ Uploading media...
          </p>
        )}
      </div>

      {/* TABS */}

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "25px",
        }}
      >
        <button
          onClick={() =>
            setActiveTab("photos")
          }
          style={{
            padding: "12px 25px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            background:
              activeTab === "photos"
                ? "#2563eb"
                : "#e5e7eb",
            color:
              activeTab === "photos"
                ? "white"
                : "black",
            fontWeight: "bold",
          }}
        >
          📷 Photos ({photos.length})
        </button>

        <button
          onClick={() =>
            setActiveTab("videos")
          }
          style={{
            padding: "12px 25px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            background:
              activeTab === "videos"
                ? "#7c3aed"
                : "#e5e7eb",
            color:
              activeTab === "videos"
                ? "white"
                : "black",
            fontWeight: "bold",
          }}
        >
          🎥 Videos ({videos.length})
        </button>
      </div>

      {/* MEDIA */}

      {loading ? (
        <div
          style={{
            background: "white",
            padding: "50px",
            borderRadius: "12px",
            textAlign: "center",
          }}
        >
          Loading gallery...
        </div>
      ) : displayedMedia.length === 0 ? (
        <div
          style={{
            background: "white",
            padding: "50px",
            borderRadius: "12px",
            textAlign: "center",
            color: "#777",
          }}
        >
          {activeTab === "photos"
            ? "No photos uploaded yet."
            : "No videos uploaded yet."}
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "20px",
          }}
        >
          {displayedMedia.map(
            (item) => (
              <div
                key={item.id}
                style={{
                  background: "white",
                  borderRadius: "12px",
                  overflow: "hidden",
                  boxShadow:
                    "0 2px 8px rgba(0,0,0,0.1)",
                }}
              >
                {item.type === "photo" ? (
                  <img
                    src={item.url}
                    alt={item.name}
                    style={{
                      width: "100%",
                      height: "220px",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <video
                    src={item.url}
                    controls
                    style={{
                      width: "100%",
                      height: "220px",
                      objectFit: "cover",
                    }}
                  />
                )}

                <div
                  style={{
                    padding: "15px",
                  }}
                >
                  <p
                    style={{
                      marginTop: 0,
                      wordBreak:
                        "break-word",
                    }}
                  >
                    {item.name}
                  </p>

                  <button
                    onClick={() =>
                      deleteMedia(item)
                    }
                    style={{
                      background: "#dc2626",
                      color: "white",
                      border: "none",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}

export default Gallery;