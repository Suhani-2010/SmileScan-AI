import React, { useState } from "react";
import axios from "axios";
import "./App.css";


function cleanReportText(text) {
  return text
    // Join percentages like "84.\n7%" or "84. \n7%" → "84.7%"
    .replace(/(\d+)\.\s*\n\s*(\d+%)/g, '$1.$2')

    // Fix "84. 7%" inside lines → "84.7%"
    .replace(/(\d+)\.\s+(\d+%)/g, '$1.$2')

    // Join mid-sentence line breaks
    .replace(/([a-z0-9,;:])\n(?=[a-zA-Z])/g, '$1 ')

    // Clean up asterisk or dash lines
    .replace(/[-*]+/g, '')

    // Final trim
    .trim();
}
function cleanedReportText(text) {
  return text
    .replace(/\n\s*/g, ' ') // Remove line breaks and extra spaces
    .replace(/(\d+)\.\s*(\d+)%/g, '$1.$2%') // Fix percentages like "84. 7%" → "84.7%"
    .replace(/(?<=\d)\s+(?=[A-Za-z])/g, ' ') // Remove space between number and following word
    .trim();
}









function Report() {
  const [file, setFile] = useState(null);
  const [image, setImage] = useState("");
  const [report, setReport] = useState("");
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [patientName, setPatientName] = useState("");
  const [patientAge, setPatientAge] = useState("");
  const [patientGender, setPatientGender] = useState("");
  const [examDate, setExamDate] = useState("");


  const handleDownloadPDF = async () => {
  const { impression, recommendations } = splitReportSections(report);

  const formData = new FormData();
  formData.append("name", patientName);
  formData.append("age", patientAge);
  formData.append("gender", patientGender);
  formData.append("exam_date", examDate);
  formData.append("impression", impression);
  formData.append("recommendations", recommendations);

  // 👇 Convert base64 image to File
  if (image) {
    const byteCharacters = atob(image); // decode base64
    const byteNumbers = new Array(byteCharacters.length).fill().map((_, i) => byteCharacters.charCodeAt(i));
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "image/png" });
    const file = new File([blob], "annotated_image.png", { type: "image/png" });
    formData.append("annotated_image", file);
  }

  try {
    const response = await fetch("https://smilescan-ai-1.onrender.com/download-pdf/", {
      method: "POST",
      body: formData,
    }); 

    if (!response.ok) throw new Error("Failed to generate PDF");

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "report.pdf";
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading PDF:", error);
  }
};


  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("https://smilescan-ai-1.onrender.com/upload/", formData);
      setImage(res.data.image);
      const rawText = res.data.report || "No findings.";
      console.log("🧾 RAW REPORT TEXT:", rawText); 
      const cleaned = cleanReportText(rawText);
      const formatted = formatAsMarkdown(cleaned);
      setReport(formatted);

    

      setPredictions(res.data.predictions || []);
    } catch (err) {
      console.error("Error:", err);
      setReport("Error generating report.");
    } finally {
      setLoading(false);
    }
  };


const formatAsMarkdown = (text) => {
  return text
    // Collapse improperly broken section headers like "Radiographic Impression\n:**"
    .replace(/(Impression|Recommendations|Conclusion|Summary|Findings)\s*[\n\r]*[:：]+[\n\r]*/gi, "\n\n**$1:**\n\n")

    // Add spacing before numbered list items
    .replace(/(\d+)\.\s*/g, "\n$1. ")

    // Add extra line before numbered points
    .replace(/(\n\d+\.\s)/g, "\n\n$1")

    // Normalize bullet points
    .replace(/\n\s*[-•]\s*/g, "\n- ")

    // Remove excessive line breaks
    .replace(/\n{3,}/g, "\n\n")

    // Collapse spaces at line start
    .replace(/\n +/g, "\n")

    .trim();
};



const splitReportSections = (text) => {
  const cleanParagraphs = (raw) =>
    raw
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .join("\n\n"); // Markdown expects double line breaks between paragraphs

  const impressionMatch = text.match(
    /\*\*(Radiographic )?Impression:\*\*([\s\S]*?)(\*\*(Recommendations|Recommendations for Follow-Up):\*\*)/i
  );
  const recommendationsMatch = text.match(
    /\*\*(Recommendations|Recommendations for Follow-Up):\*\*([\s\S]*)$/i
  );

  const impression = impressionMatch
    ? cleanParagraphs(impressionMatch[2])
    : "Not available.";
  const recommendations = recommendationsMatch
    ? cleanParagraphs(recommendationsMatch[2])
    : "Not available.";

  return { impression, recommendations };
};




  const {impression, recommendations } = splitReportSections(report);

  const filledReport = `
# 📄 Diagnostic Report

---

## 🧍 Patient Information:
- **Name:** ${patientName || "[Not Provided]"}
- **Age:** ${patientAge || "[Not Provided]"}
- **Gender:** ${patientGender || "[Not Provided]"}
- **Date of Examination:** ${examDate || "[Not Provided]"}



## 📋 Diagnosis & Recommendations:
### 🔍 Impression:
${impression}
### 🧾 Recommendations:
${recommendations}
`;



  return (
    <div className="report-page">
      <h1 className="report-title">Generate Diagnostic Report</h1>
      <div className="report-layout">
        {/* LEFT SIDE: Inputs & Preview */}
        <div className="left-side">
          <div className="input-group">
            <input
              type="text"
              placeholder="Patient Name"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
            />
           
            <input
              type="number"
              placeholder="Age"
              value={patientAge}
              onChange={(e) => setPatientAge(e.target.value)}
            />
            <select
              value={patientGender}
              onChange={(e) => setPatientGender(e.target.value)}
            >
              <option value="">Select Gender</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Other">Other</option>
            </select>
            <input
              type="date"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
            />
            
            <input
              type="file"
              accept=".dcm"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <button onClick={handleUpload} disabled={loading}>
              {loading ? "Analyzing..." : "Generate Report"}
            </button>
          </div>

          <div className="image-preview">
  {loading ? (
    <div className="spinner"></div>
  ) : (
    image && (
      <img
        src={`data:image/png;base64,${image}`}
        alt="Preview"
        className="preview-img"
      />
    )
  )}
</div>


          {predictions.length > 0 && (
            <div className="predictions">
              <h4>🔍 Predictions</h4>
              <ul>
                {predictions.map((pred, idx) => (
                  <li key={idx}>
                    <strong>{pred.class}</strong> –{" "}
                    {(pred.confidence * 100).toFixed(1)}% at ({pred.x}, {pred.y})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* RIGHT SIDE: Report */}
        <div className="right-side">
 {report && (
  <div className="report-wrapper">
    <div className="report-box">
      <div className="clinic-header">
        <h1>SmileScan AI</h1>
        <p>AI-Powered Radiographic Analysis for Smarter Dental Care</p>
        <p className="clinic-contact">Powered by advanced imaging & artificial intelligence | support@gmail.com</p>
      </div>

      <div className="report-body">
        <div className="patient-info">
          <h3>Patient Information</h3>
          <p><strong>Name:</strong> {patientName || "[Not Provided]"}</p>
          <p><strong>Age:</strong> {patientAge || "[Not Provided]"}</p>
          <p><strong>Gender:</strong> {patientGender || "[Not Provided]"}</p>
          <p><strong>Date of Examination:</strong> {examDate || "[Not Provided]"}</p>
        </div>

        <div className="report-section">
          <h3>Radiographic Impression</h3>
          <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit" }}>
            {cleanedReportText(impression)}
          </pre>
        </div>

        <div className="report-section">
          <h3>Recommendations</h3>
          <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit" }}>
            {cleanReportText(recommendations)}
          </pre>
        </div>
      </div>
    </div>

    {/* ✅ Button placed OUTSIDE report-box but INSIDE wrapper */}
    <div className="download-btn-container">
      <button className="download-btn" onClick={handleDownloadPDF}>
        🖨️ Download PDF
      </button>
    </div>
  </div>
)}

        </div>
      </div>
    </div>
  );
}

export default Report;
