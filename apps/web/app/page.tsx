"use client";

import Feed from "@/components/dashboard/feed";
import PhotoUpload from "@/components/dashboard/photo-upload";
import Sidebar from "@/components/dashboard/sidebar";
import { Stories } from "@/components/dashboard/stories";
import { Fab } from "@/components/ui/fab";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [showUpdateModal, setShowUpdateModal] = useState(false)

  const handleCreatePost = async (file: File, caption: string) => {
    const formdata = new FormData();
    formdata.append('image', file)

    const uploadResponse = await fetch('/api/upload/image', {
      method: 'POST',
      body: formdata
    })

    if (!uploadResponse.ok) {
      throw new Error('Failed to upload image')
    }

    const { filename } = await uploadResponse.json();
    console.log(filename);

  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Stories></Stories>
            <Feed></Feed>
          </div>
          <div className="lg:sticky lg:top-8 lg:h-fit">
            <Sidebar></Sidebar>
          </div>
        </div>
      </div>

      <PhotoUpload open={showUpdateModal} onOpenChange={setShowUpdateModal} onSubmit={handleCreatePost} />
      <Fab onClick={() => setShowUpdateModal(true)}>
        <Plus className="h-6 w-6" />
      </Fab>
    </div>
  )
}