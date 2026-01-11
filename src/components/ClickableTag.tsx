"use client";

import { useRouter } from "next/navigation";
import { getTagColor } from "@/lib";

type ClickableTagProps = {
  tag: string;
  category: string;
};

export default function ClickableTag({ tag, category }: ClickableTagProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/recipes?tag=${tag}`);
  };

  return (
    <span
      onClick={handleClick}
      className={`px-2 py-2 rounded-lg border-2 bg-transparent capitalize cursor-pointer hover:opacity-80 transition-opacity ${getTagColor(
        tag,
        category
      )}`}>
      {tag}
    </span>
  );
}

