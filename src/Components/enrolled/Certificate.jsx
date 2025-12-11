import React, { forwardRef } from "react";

const Certificate = forwardRef(({ studentName, courseName, date, profileImage }, ref) => {
  
  // Color Palette
  const colors = {
    primary: "#1a4d2e", // Deep Forest Green
    secondary: "#c5a059", // Gold/Bronze
    text: "#333333",
    background: "#fffdf5", // Very light cream
  };

  return (
    <div
      ref={ref}
      style={{
        width: "1123px", // A4 Landscape width
        height: "794px", // A4 Landscape height
        backgroundColor: colors.background,
        color: colors.text,
        fontFamily: "'Georgia', 'Times New Roman', serif",
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      {/* --- Outer Border --- */}
      <div
        style={{
          width: "100%",
          height: "100%",
          border: `10px solid ${colors.primary}`,
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "40px",
          boxSizing: "border-box",
        }}
      >
        {/* --- Inner Gold Border --- */}
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            right: "10px",
            bottom: "10px",
            border: `2px solid ${colors.secondary}`,
            pointerEvents: "none",
          }}
        />

        {/* --- Background Watermark (Optional) --- */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: "120px",
            fontWeight: "bold",
            color: colors.primary,
            opacity: "0.03",
            zIndex: 0,
            whiteSpace: "nowrap",
            fontFamily: "Arial, sans-serif",
          }}
        >
          LearnHub
        </div>

        {/* --- Content Container --- */}
        <div style={{ zIndex: 1, width: "100%", textAlign: "center" }}>
          
          {/* Header / Logo */}
          <div style={{ marginBottom: "20px" }}>
            <h2
              style={{
                margin: 0,
                fontSize: "28px",
                color: colors.primary,
                letterSpacing: "2px",
                textTransform: "uppercase",
                fontFamily: "Arial, sans-serif",
                fontWeight: "bold",
              }}
            >
              LearnHub
            </h2>
          </div>

          {/* Profile Image (Styled) */}
          {profileImage && (
            <div style={{ marginBottom: "20px" }}>
              <img
                src={profileImage}
                alt="Student"
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: `4px solid ${colors.secondary}`,
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                }}
              />
            </div>
          )}

          {/* Title */}
          <h1
            style={{
              fontSize: "56px",
              margin: "10px 0",
              color: colors.primary,
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            Certificate of Completion
          </h1>

          <div
            style={{
              width: "200px",
              height: "2px",
              backgroundColor: colors.secondary,
              margin: "10px auto 30px auto",
            }}
          />

          {/* Intro Text */}
          <p style={{ fontSize: "24px", margin: "0", fontStyle: "italic", color: "#555" }}>
            This is to certify that
          </p>

          {/* Student Name */}
          <h2
            style={{
              fontSize: "48px",
              margin: "20px 0",
              color: "#000",
              fontFamily: "'Great Vibes', cursive, 'Georgia', serif", // Fallback to Georgia if Google Font not loaded
              borderBottom: "1px solid #ddd",
              display: "inline-block",
              paddingBottom: "10px",
              minWidth: "400px",
            }}
          >
            {studentName}
          </h2>

          {/* Course Text */}
          <p style={{ fontSize: "24px", margin: "10px 0 0 0", color: "#555" }}>
            has successfully completed the course
          </p>

          {/* Course Name */}
          <h3
            style={{
              fontSize: "36px",
              margin: "15px 0 40px 0",
              color: colors.primary,
              fontWeight: "bold",
            }}
          >
            {courseName}
          </h3>

          {/* Footer Section: Date & Signature */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginTop: "60px",
              padding: "0 60px",
            }}
          >
            {/* Date Section */}
            <div style={{ textAlign: "center" }}>
              <p
                style={{
                  fontSize: "22px",
                  margin: "0 0 10px 0",
                  borderBottom: "2px solid #333",
                  paddingBottom: "5px",
                  minWidth: "200px",
                  fontWeight: "bold",
                }}
              >
                {date}
              </p>
              <p style={{ fontSize: "16px", color: "#777", marginTop: "5px" }}>
                Date Issued
              </p>
            </div>

            {/* Badge / Seal */}
            <div
              style={{
                width: "100px",
                height: "100px",
                backgroundColor: colors.secondary,
                borderRadius: "50%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "#fff",
                fontWeight: "bold",
                fontSize: "14px",
                textAlign: "center",
                boxShadow: "0 0 0 5px #fff, 0 0 0 7px " + colors.secondary,
              }}
            >
              OFFICIAL
              <br />
              SEAL
            </div>

            {/* Signature Section */}
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: "28px",
                  fontFamily: "'Brush Script MT', cursive",
                  color: "#000",
                  marginBottom: "5px",
                }}
              >
                LearnHub Team
              </div>
              <div
                style={{
                  width: "200px",
                  height: "2px",
                  backgroundColor: "#333",
                  margin: "0 auto",
                }}
              />
              <p style={{ fontSize: "16px", color: "#777", marginTop: "5px" }}>
                Instructor Signature
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Certificate;