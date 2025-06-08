import { Post } from "@/lib/types/post";
import { Dialog, DialogHeader, DialogTitle, DialogContent } from "./ui/dialog";
import ImageCarousel from "./image-carousel";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export function PostDialog({
  post,
  onClose,
}: {
  post: Post;
  onClose: () => void;
}) {
  return (
    <Dialog open={!!post} onOpenChange={onClose}>
      <DialogContent>
        <VisuallyHidden>
          <DialogHeader>
            <DialogTitle className="sr-only">{post.content}</DialogTitle>
          </DialogHeader>
        </VisuallyHidden>
        <div className="space-y-4">
          <div>
            <ImageCarousel images={post.images || []} />
          </div>
          <p className="text-sm whitespace-pre-wrap">{post.content}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
