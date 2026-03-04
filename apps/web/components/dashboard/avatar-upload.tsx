"use client";

import { getImageUrl } from "@/lib/image";
import { X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import FileUploadArea from "../ui/file-upload-area";

interface AvatarUploadProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (file: File) => Promise<void>;
  currentAvatarUrl: string | null;
}
export default function AvatarUpload({ open, onOpenChange, onSubmit, currentAvatarUrl }: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentAvatarUrl);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);


  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    };
    reader.readAsDataURL(file);
  }


  const clearSelection = () => {
    setSelectedFile(null);
    setPreview(null);

  }

  const handleUpload = async () => {
    if (!selectedFile) return;
    setIsUploading(true);

    try {
      await onSubmit(selectedFile)
      clearSelection();
      onOpenChange(false)
    } catch (err) {
      console.error('error creating avatar', err)
    } finally {
      setIsUploading(false);
    }
  }



  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Avatar</DialogTitle>
        </DialogHeader>

        {
          !preview ? (
            <div>
              <div className="space-y-4">
                {
                  currentAvatarUrl && (
                    <div className="flex justify-center">
                      <Image
                        src={getImageUrl(currentAvatarUrl)}
                        alt="Current Avatar"
                        height={64} width={64}
                        className="w-24 h-24 rounded-full object-cover border-muted"
                      />
                    </div>
                  )
                }
              </div>
              <FileUploadArea onFileSelect={handleFileSelect} />

            </div>

          ) : (
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="relative">
                  <Image src={preview} height={64} width={64} alt="Preview"
                    className="w-32 h-32 rounded-full object-cover border-primary" />
                  <Button
                    variant={"ghost"}
                    size={"sm"}
                    className="absolute -top-2 -right-2 bg-black/50 text-white hover:bg-black/70 rounded-full p-2" onClick={clearSelection}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <DialogFooter>
                <Button variant={"outline"} onClick={clearSelection} disabled={isUploading}>
                  Back
                </Button>
                <Button onClick={handleUpload} disabled={isUploading}>
                  {isUploading ? 'Updating...' : 'Update avatar'}
                </Button>
              </DialogFooter>
            </div>)
        }


      </DialogContent>
    </Dialog>
  )
}