import { useState, useEffect } from "react";
import './firstLandingPage.css'

export default function FirstLandingPage() {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = "https://img.youtube.com/vi/b-z8MpYMgPY/maxresdefault.jpg";
    img.onload = () => setImageLoaded(true);
  }, []);

  return (
    <section
      className="first-landing-section header18 mbr-fullscreen"
    >
      {/* ✅ Cover Image (shows immediately) */}
      {imageLoaded && (
        <div
          style={{
            backgroundImage:
              'url("https://img.youtube.com/vi/b-z8MpYMgPY/maxresdefault.jpg")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "absolute",
            inset: 0,
            zIndex: 1,
            opacity: videoLoaded ? 0 : 1,
            transition: "opacity 0.8s ease-in-out",
          }}
        ></div>
      )}

      {/* 🎥 Local or Cloud-hosted MP4 Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/crownImage.jpg"
        onCanPlayThrough={() => setVideoLoaded(true)}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 0,
        }}
      >
        <source src="/crownBackgroundVideo.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* 🖤 Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 2,
        }}
      ></div>

      {/* ✨ Hero Content */}
      <div
        className="container-fluid text-center text-white"
        style={{
          position: "relative",
          zIndex: 3,
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div className="first-landing-page-wrapper">
            <h1 className="display-2 fw-bold">VOTE FOR YOUR  FAVORITE</h1>
            <h2 className="display-3 fw-bold" style={{color: "#D4AF37"}}>Most Beautiful Girl In Iba CONTESTANT</h2>
            <p className="display-7 mb-4 fw-bold">
            Have your say! Vote for the participant you think should win this remarkable contest.
            </p>
            <div className="vote-price">
                Vote Price: $200
            </div>
        </div>
      </div>
    </section>
  );
}
