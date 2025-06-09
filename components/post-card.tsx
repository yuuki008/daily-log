import { ImageGrid } from "@/components/image-grid";
import { Post } from "@/lib/types/post";
import { useState } from "react";
import { deletePostClient } from "@/lib/api/posts-client";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PostCardProps {
  post: Post;
  onDelete?: (id: string) => void;
}

export function PostCard({ post, onDelete }: PostCardProps) {
  const [hovered, setHovered] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm("本当に削除しますか？")) return;
    setLoading(true);
    const { error } = await deletePostClient(post.id);
    setLoading(false);
    if (!error && onDelete) {
      onDelete(post.id);
    } else if (error) {
      alert("削除に失敗しました");
    }
  };

  return (
    <div
      className="mb-2 hover:bg-secondary p-2 rounded transition-colors duration-300 relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className={cn(
          "absolute right-2 bottom-2 z-20 opacity-0 transition-opacity duration-300",
          hovered && "opacity-100"
        )}
      >
        <Button
          className="cursor-pointer"
          size="icon"
          onClick={handleDelete}
          disabled={loading}
        >
          <Trash2 />
        </Button>
      </div>
      {post.images && post.images.length > 0 && (
        <div className={post.content ? "mb-4" : ""}>
          <ImageGrid images={post.images} alt={post.content} />
        </div>
      )}
      <p className="text-sm whitespace-pre-wrap">{post.content}</p>
    </div>
  );
}
