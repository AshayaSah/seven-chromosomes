import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

const FileViewer = ({ fileBlob }) => {
  const [content, setContent] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (fileBlob) {
      // Clean up previous object URL when component updates
      return () => {
        if (content && content.startsWith("blob:")) {
          URL.revokeObjectURL(content);
        }
      };
    }
  }, [content, fileBlob]);

  if (!fileBlob) {
    return (
      <Card>
        <CardContent className="text-center text-gray-500 p-6">
          No file selected to preview.
        </CardContent>
      </Card>
    );
  }

  const fileType = fileBlob.type;
  const blobUrl = URL.createObjectURL(fileBlob);

  const isPDF = fileType === "application/pdf";
  const isExcel =
    fileType ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    fileType === "application/vnd.ms-excel";
  const isText = fileType === "text/plain";
  const isImage = fileType.startsWith("image/");

  return (
    <Card className="py-0">
      <CardContent className="px-0">
        {isPDF && (
          <iframe
            src={blobUrl}
            title="PDF Preview"
            className="w-full h-96 border rounded-md"
          />
        )}

        {isExcel && (
          <p className="text-sm text-gray-700">
            Excel files can't be previewed directly.{" "}
            <a
              href={blobUrl}
              download={fileBlob.name || "file.xlsx"}
              className="text-blue-600 underline"
            >
              Download Excel File
            </a>
          </p>
        )}

        {isText && (
          <iframe
            src={blobUrl}
            title="Text Preview"
            className="w-full h-96 border rounded-md"
          />
        )}

        {isImage && (
          <div className="flex justify-center">
            <img
              src={blobUrl}
              alt="Image preview"
              className="max-w-full max-h-96 object-contain"
            />
          </div>
        )}

        {!isPDF && !isExcel && !isText && !isImage && (
          <p className="text-sm text-red-500">
            Unsupported file type: {fileType}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default FileViewer;
