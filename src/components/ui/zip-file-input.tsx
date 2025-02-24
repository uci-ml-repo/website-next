"use client";

import React, { useCallback, useReducer } from "react";
import { useDropzone } from "react-dropzone";

import { Button } from "@/components/ui/button";
import { abbreviateFileSize, cn } from "@/lib/utils";

// Define the action types
type Action =
  | { type: "ADD_FILES"; files: File[] }
  | { type: "REMOVE_FILE"; index: number };

// The state is an array of File objects
type State = File[];

// Reducer function to manage file state
function fileReducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD_FILES":
      return [...state, ...action.files];
    case "REMOVE_FILE":
      return state.filter((_, i) => i !== action.index);
    default:
      return state;
  }
}

export function ZipFileInput() {
  const [files, dispatch] = useReducer(fileReducer, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    dispatch({ type: "ADD_FILES", files: acceptedFiles });
    console.log("Uploaded files:", acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  // Handler to remove a file by its index in the list
  const handleRemove = (index: number) => {
    dispatch({ type: "REMOVE_FILE", index });
  };

  return (
    <div>
      <div
        {...getRootProps()}
        className="cursor-pointer focus-visible:ring focus-visible:ring-offset-2"
      >
        <input {...getInputProps()} />
        <div
          className={cn(
            "flex h-52 items-center justify-center rounded-md border-2 border-dashed p-6 text-center",
            {
              "bg-uci-blue/10": isDragActive,
            },
          )}
        >
          {isDragActive ? (
            <div>Drop the files here ...</div>
          ) : (
            <div className="space-y-1">
              <div className="text-lg font-bold">
                Drag & drop files to upload
              </div>
              <div className="text-muted-foreground">or</div>
              <Button variant="outline" tabIndex={-1}>
                Browse files
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Display the list of uploaded files */}
      {files.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-bold">Uploaded Files:</h3>
          <ul className="ml-6 list-disc">
            {files.map((file, index) => (
              <li key={index} className="flex items-center justify-between">
                <span>
                  {file.name} ({abbreviateFileSize(file.size)})
                </span>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleRemove(index)}
                >
                  Remove
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
