"use client"

import { getImageUrl } from "@/lib/image";
import { Post } from "@repo/trpc/schemas";
import Image from 'next/image';
import { Dialog, DialogContent } from "../ui/dialog";

interface PostModalProps {
  post: Post;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PostModal({ post, open, onOpenChange }: PostModalProps) {

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl! w-full h-[90vh] p-0 overflow-hidden flex flex-col">
        <div className="grid md:grid-cols-[1.5fr_1fr] h-full flex-1 overflow-hidden">
          <div className="relative bg-black flex items-center justify-center min-h-0">
            <div className="relative w-full h-full">
              <Image src={getImageUrl(post.image)} alt={post.caption} fill className="object-contain" sizes="(max-width: 768px) 100vw, 50vw" />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}