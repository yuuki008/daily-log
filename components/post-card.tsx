import { ImageCarousel } from "@/components/image-carousel";
import { Post } from "@/lib/types/post";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <div>
      {post.images && post.images.length > 0 && (
        <div className="mb-4">
          <ImageCarousel images={post.images} alt={post.content} />
        </div>
      )}
      <p className="text-sm whitespace-pre-wrap">{post.content}</p>
    </div>
  );
}
