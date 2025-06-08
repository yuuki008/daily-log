import { ImageGrid } from "@/components/image-grid";
import { Post } from "@/lib/types/post";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <div className="mb-2 hover:bg-secondary p-2 cursor-pointer rounded transition-colors duration-300">
      {post.images && post.images.length > 0 && (
        <div className={post.content ? "mb-4" : ""}>
          <ImageGrid images={post.images} alt={post.content} />
        </div>
      )}
      <p className="text-sm whitespace-pre-wrap">{post.content}</p>
    </div>
  );
}
