"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import { Video01Icon, MusicNote01Icon } from "@hugeicons/core-free-icons";

interface CategorySelectorProps {
  selectedCategory: "video" | "audio";
  onSelectCategory: (category: "video" | "audio") => void;
}

export function CategorySelector({
  selectedCategory,
  onSelectCategory,
}: CategorySelectorProps) {
  return (
    <div className="flex p-1 bg-zinc-100 dark:bg-zinc-900 rounded-xl w-fit mx-auto mb-8 border border-zinc-200 dark:border-zinc-800">
      <button
        onClick={() => onSelectCategory("video")}
        className={cn(
          "flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ease-in-out",
          selectedCategory === "video"
            ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm ring-1 ring-black/5 dark:ring-white/10"
            : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
        )}
      >
        <HugeiconsIcon icon={Video01Icon} className="w-4 h-4" />
        Video
      </button>
      <button
        onClick={() => onSelectCategory("audio")}
        className={cn(
          "flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ease-in-out",
          selectedCategory === "audio"
            ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm ring-1 ring-black/5 dark:ring-white/10"
            : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
        )}
      >
        <HugeiconsIcon icon={MusicNote01Icon} className="w-4 h-4" />
        Audio
      </button>
    </div>
  );
}
