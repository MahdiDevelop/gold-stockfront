import React, { useState, useCallback, useEffect } from "react";
import Source from "../../Source";
import axios from "axios";
import { useShowAlert } from "../../warrper";
import { useDropzone } from 'react-dropzone';
import { FormattedMessage } from "react-intl";

export default function AddDatabase({
  close,
  addAccountModal,
  setLoading
}) {
  const showAlert = useShowAlert();
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // پاکسازی حافظه
  useEffect(() => {
    return () => {
      if (file) {
        URL.revokeObjectURL(file.preview);
      }
    };
  }, [file]);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(Object.assign(selectedFile, {
        preview: URL.createObjectURL(selectedFile)
      }));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop, 
    accept: { 'text/plain': ['.sql'] },
    maxFiles: 1,
    disabled: isUploading
  });

  const handleSubmit = async () => {
    if (!file) {
      showAlert("لطفاً یک فایل SQL انتخاب کنید.", "warning");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const response = await axios.post(Source.getAddress() + "/api/import", formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("access")}`,
          'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        },
      });
      // showAlert("فایل SQL با موفقیت آپلود شد.", "success");
      showAlert({
        position: "top-end",
        icon: "success",
        // title: "Customer added successfully!",
        title: <FormattedMessage id="Database Successfully added!" />,
        showConfirmButton: false,
        timer: 500,
      });
      console.log('پاسخ سرور:', response.data);
    } catch (error) {
      console.log(error);
      const errorMessage = error.response?.data?.error || "خطای ناشناخته رخ داده است.";
      // showAlert(errorMessage, "error");
      showAlert({
        position: "top-end",
        icon: "error",
        // title: "Something went wrong!",
                    title: <FormattedMessage id="Not working ,please try again!" />,
        showConfirmButton: false,
        timer: 500,
      });
      console.error('خطا:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setFile(null);
    setUploadProgress(0);
    setIsUploading(false);
  };

  return (
    <div
      className={`container rounded-5 popup setting ${addAccountModal ? "show" : ""
        }`}
      style={{
        maxWidth: "70%",
        overflowX: "auto",
        overflowY: "auto",
        height: "auto", // ارتفاع خودکار برای نمایش محتوا
        backgroundColor: "#f8f9fa",
        padding: "20px",
      }}
    >
      <div className="d-flex justify-content-end">
        <button
          type="button"
          className="btn-close p-3 m-1 mt-0 hover_btn"
          onClick={close}
          aria-label="Close"
        ></button>
      </div>

      {/* منطقه دراگ و دراپ */}
      <div
        {...getRootProps()}
        style={{
          border: '2px dashed #007bff',
          borderRadius: '4px',
          padding: '20px',
          textAlign: 'center',
          backgroundColor: isDragActive ? '#e9f5ff' : '#f9f9f9',
          cursor: 'pointer',
          height: '60%'
        }}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>فایل SQL را اینجا رها کنید...</p>
        ) : (
          <p>فایل SQL را به اینجا بکشید و رها کنید، یا کلیک کنید تا فایل را انتخاب کنید.</p>
        )}
      </div>

      {/* نمایش فایل انتخاب شده */}
      {file && (
        <div style={{ marginTop: '20px' }}>
          <h4>فایل انتخاب شده:</h4>
          <p>{file.name} - {file.size} bytes</p>
        </div>
      )}

      {/* Progress Bar */}
      {isUploading && (
        <div style={{ marginTop: '20px' }}>
          <div style={{ width: '100%', backgroundColor: '#e0e0e0', borderRadius: '4px' }}>
            <div
              style={{
                width: `${uploadProgress}%`,
                backgroundColor: '#007bff',
                height: '10px',
                borderRadius: '4px',
                transition: 'width 0.3s ease',
              }}
            ></div>
          </div>
          <p>{uploadProgress}% آپلود شده</p>
        </div>
      )}

      {/* دکمه‌های ثبت و لغو */}
      <div className="d-flex justify-content-end mt-3">
        <button
          className="btn btn-danger me-2 ms-1"
          onClick={handleCancel}
          disabled={isUploading}
        >
          لغو
        </button>
        <button
          className="btn btn-success w-100 ms-1"
          onClick={handleSubmit}
          disabled={isUploading || !file}
        >
          {isUploading ? 'در حال آپلود...' : 'ثبت'}
        </button>
      </div>
    </div>
  );
}