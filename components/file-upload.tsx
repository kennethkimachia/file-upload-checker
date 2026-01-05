"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import { Upload01Icon, FileVideoIcon, FileAudioIcon, CheckmarkCircle01Icon, AlertCircleIcon, Loading03Icon } from "@hugeicons/core-free-icons";
import { validateVideo } from "@/app/actions/video";
import { validateAudio } from "@/app/actions/audio";

interface FileUploadProps {
  category: "video" | "audio";
}

export function FileUpload({ category }: FileUploadProps) {
  const [dragActive, setDragActive] = React.useState(false);
  const [file, setFile] = React.useState<File | null>(null);
  const [status, setStatus] = React.useState<"idle" | "validating" | "success" | "error">("idle");
  const [message, setMessage] = React.useState<string>("");
  const [uploadUrl, setUploadUrl] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const acceptedTypes = category === "video" 
    ? "video/mp4,video/x-matroska,video/quicktime"
    : "audio/mpeg,audio/wav,audio/mp4,audio/x-m4a";

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateFile = async (fileToValidate: File) => {
    setStatus("validating");
    setMessage("Checking file type...");
    
    // Quick client-side check for mime type (optional but good for UX)
    // Server validation is the source of truth

    const formData = new FormData();
    formData.append("file", fileToValidate);

    try {
      let result;
      if (category === "video") {
        result = await validateVideo(formData);
      } else {
        result = await validateAudio(formData);
      }

      if (result.success) {
        setStatus("success");
        setMessage(result.message || "File valid");
        setUploadUrl(result.url || null);
        setFile(fileToValidate);
      } else {
        setStatus("error");
        setMessage(result.message || "Invalid file");
        setUploadUrl(null);
        setFile(null);
      }
    } catch (error) {
        console.error(error)
      setStatus("error");
      setMessage("An error occurred during validation");
      setFile(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    inputRef.current?.click();
  };

  const reset = (e: React.MouseEvent) => {
      e.stopPropagation();
      setFile(null);
      setStatus("idle");
      setMessage("");
      setUploadUrl(null);
      if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="w-full max-w-xl mx-auto">
      <div
        className={cn(
          "relative group flex flex-col items-center justify-center w-full min-h-[300px] rounded-3xl border-2 border-dashed transition-all duration-300 ease-in-out cursor-pointer overflow-hidden",
          dragActive
            ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/10 scale-[1.02]"
            : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900",
            status === 'error' && "border-red-500/50 bg-red-50/50 dark:bg-red-900/10",
            status === 'success' && "border-emerald-500/50 bg-emerald-50/50 dark:bg-emerald-900/10"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={onButtonClick}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept={acceptedTypes}
          onChange={handleChange}
        />

        <div className="absolute inset-0 bg-linear-to-tr from-transparent via-transparent to-zinc-500/5 dark:to-white/5 pointer-events-none" />

        <div className="flex flex-col items-center gap-4 p-8 text-center z-10">
          <div className={cn(
            "p-5 rounded-2xl transition-all duration-500",
            status === "idle" && "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 group-hover:scale-110 group-hover:text-indigo-500 dark:group-hover:text-indigo-400",
            status === "validating" && "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 animate-pulse",
            status === "success" && "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
            status === "error" && "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
          )}>
            {status === "idle" && (category === "video" ? <HugeiconsIcon icon={FileVideoIcon} className="w-10 h-10" /> : <HugeiconsIcon icon={FileAudioIcon} className="w-10 h-10" />)}
            {status === "validating" && <HugeiconsIcon icon={Loading03Icon} className="w-10 h-10 animate-spin" />}
            {status === "success" && <HugeiconsIcon icon={CheckmarkCircle01Icon} className="w-10 h-10" />}
            {status === "error" && <HugeiconsIcon icon={AlertCircleIcon} className="w-10 h-10" />}
          </div>

          <div className="space-y-2">
            <h3 className={cn(
                "text-lg font-semibold transition-colors duration-300",
                status === "error" ? "text-red-600 dark:text-red-400" : "text-zinc-900 dark:text-zinc-100",
                status === "success" && "text-emerald-600 dark:text-emerald-400"
            )}>
              {status === "idle" && "Upload your file"}
              {status === "validating" && "Verifying Format..."}
              {status === "success" && "File Validated Successfully"}
              {status === "error" && "Validation Failed"}
            </h3>
            
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xs mx-auto">
              {status === "idle" && (
                <>Drag and drop your <span className="font-medium text-zinc-900 dark:text-zinc-200">{category}</span> file here, or click to browse</>
              )}
              {status !== "idle" && message}
            </p>
          </div>

           {status === "success" && file && (
               <div className="mt-4 px-4 py-2 bg-white/50 dark:bg-black/20 rounded-lg text-sm font-medium text-zinc-600 dark:text-zinc-300 backdrop-blur-sm border border-black/5 dark:border-white/5">
                   <p className="line-clamp-1">{file.name}</p>
                   {uploadUrl && (
                     <a href={uploadUrl} target="_blank" rel="noopener noreferrer" className="block mt-1 text-xs text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 dark:hover:text-indigo-300 underline">
                       View Uploaded File
                     </a>
                   )}
               </div>
           )}

           {status !== 'idle' && (
               <button 
                onClick={reset}
                className="mt-6 text-xs font-medium text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 underline transition-colors z-20"
               >
                   Upload another file
               </button>
           )}
        </div>
      </div>
    </div>
  );
}
