import { StoryGroup } from "@repo/trpc/schemas";
import { useState } from "react";
import { Dialog, DialogContent } from "../ui/dialog";

interface StoryViewerProps {
  storyGroups: StoryGroup[];
  open: boolean;
  initalGroupIndex: number;
  onOpenChange: (open: boolean) => void;
}

export default function StoryViewer({ storyGroups, open, onOpenChange, initalGroupIndex }: StoryViewerProps) {
  const [currentGroupIndex, setCurrentGroupIndex] = useState(initalGroupIndex);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const currentGroup = storyGroups[currentGroupIndex];

  const handleClose = () => {
    onOpenChange(false);
    setCurrentGroupIndex(initalGroupIndex);
    setCurrentStoryIndex(0);
    setProgress(0);
  }

  if (!currentGroup) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md! w-full h-[90vh] p-0 overflow-hidden bg-black">
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="absolute top-0 left-0 right-0 z-20 flex gap-1 p-2">
            {
              currentGroup?.stories.map((_, index) => (
                <div key={index} className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden">
                  <div className="h-full bg-white transition-all duration-100" style={{
                    width: index < currentStoryIndex ? "100%" : index === currentStoryIndex ? `${progress}%` : '0%'
                  }} />
                </div>
              ))
            }
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )

}