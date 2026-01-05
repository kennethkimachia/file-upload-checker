"use client";

import * as React from "react";
import { CategorySelector } from "@/components/category-selector";
import { FileUpload } from "@/components/file-upload";

export default function Page() {
  const [selectedCategory, setSelectedCategory] = React.useState<"video" | "audio">("video");

  return (
    <div className="min-h-screen bg-white dark:bg-black flex flex-col items-center pt-24 pb-12 px-4 selection:bg-indigo-100 dark:selection:bg-indigo-900/30">
        
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[14px_24px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="relative z-10 w-full max-w-4xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            File Validity <span className="text-indigo-600 dark:text-indigo-500">Checker</span>
          </h1>
          <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-lg mx-auto leading-relaxed">
            Securely validate your media files before processing. Supports various video and audio formats.
          </p>
        </div>

        <CategorySelector
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        <div className="mt-8">
           <FileUpload category={selectedCategory} />
        </div>
        
        <div className="pt-12 flex items-center justify-center gap-6 text-xs text-zinc-400">
             <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                 <span>Server-side Verification</span>
             </div>
             <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                 <span>Instant Analysis</span>
             </div>
        </div>
      </div>
    </div>
  );
}