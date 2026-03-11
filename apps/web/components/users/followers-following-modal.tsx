import { authClient } from "@/lib/auth/client";
import { getImageUrl } from "@/lib/image";
import { trpc } from "@/lib/trpc/client";
import { User } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

interface FollowersFollowingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  type: 'followers' | 'following'
}

export function FollowersFollowingModel({ open, onOpenChange, userId, type }: FollowersFollowingModalProps) {
  const router = useRouter();
  const utils = trpc.useUtils();
  const { data: session } = authClient.useSession();

  const { data: followers = [] } = trpc.usersRouter.getFollowers.useQuery({
    userId
  }, {
    enabled: open && type === 'followers'
  })

  const { data: following = [] } = trpc.usersRouter.getFollowing.useQuery({
    userId
  }, {
    enabled: open && type === 'following'
  })


  const followMutation = trpc.usersRouter.follow.useMutation({
    onSuccess: () => {
      utils.usersRouter.getFollowers.invalidate();
      utils.usersRouter.getFollowing.invalidate();
      utils.usersRouter.getUserProfile.invalidate({ userId });
    }
  })

  const unfollowMutation = trpc.usersRouter.unfollow.useMutation({
    onSuccess: () => {
      utils.usersRouter.getFollowers.invalidate();
      utils.usersRouter.getFollowing.invalidate();
      utils.usersRouter.getUserProfile.invalidate({ userId });
    }
  })


  const users = type === 'followers' ? followers : following;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>
            {type === 'followers' ? 'Followers' : 'Following'}
          </DialogTitle>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto">
          {
            users.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No {type === 'followers' ? 'followers' : 'following'} yet</p>
            ) : (
              <div className="space-y-3">{
                users.map(user => (
                  <div key={user.id} className="flex items-center justify-between">

                    <Button variant={"ghost"} onClick={() => { router.push(`/users/${user.id}`); onOpenChange(false) }} className="flex items-center space-x-3 flex-1 h-auto p-0 justify-start">

                      {
                        user.image ? (
                          <Image
                            src={getImageUrl(user.image)}
                            alt={user.name}
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded-full object-cover" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                            <User className="w-5 h-5 text-muted-foreground" />
                          </div>
                        )}
                      <div className="flex-1 min-w-0 text-left">
                        <div className="font-semibold text-sm truncate">{user.name}</div>
                      </div>
                      {
                        user.bio && (
                          <div className="text-xs text-muted-foreground truncate">
                            {user.bio}
                          </div>
                        )
                      }
                    </Button>
                    {
                      session?.user.id !== user.id && (
                        <Button variant={user.isFollowing ? 'outline' : 'default'}
                          size={"sm"} onClick={() => {
                            if (user.isFollowing) {
                              unfollowMutation.mutate({ userId: user.id })
                            } else {
                              followMutation.mutate({ userId: user.id })
                            }
                          }}
                          disabled={followMutation.isPending || unfollowMutation.isPending}
                          className="shrink-0"
                        >
                          {user.isFollowing ? 'Unfollow' : 'Follow'}
                        </Button>
                      )
                    }
                  </div>
                ))
              }</div>
            )
          }


        </div>
      </DialogContent>
    </Dialog>
  )
}