"use client";
import "react-quill/dist/quill.snow.css";
import styles from "../../styles/InterviewStages.module.scss";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

export default function RichTextEditor({
  value,
  onChange,
  error,
  placeholder,
  height = "200px"
}) {
  return (
    <div
      className={`${styles.quill} ${error ? styles.quillError : ""}`}
      style={{ height }}
    >
      <ReactQuill
        value={value || ""}
        onChange={onChange}
        theme="snow"
        placeholder={placeholder}
        modules={{
          toolbar: [
            ["bold", "italic", "underline"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image"],
          ],
        }}
      />
    </div>
  );
}
