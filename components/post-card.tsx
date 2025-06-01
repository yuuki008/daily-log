import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ImageCarousel } from "@/components/image-carousel";
import { Post } from "@/lib/types/post";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const displayName = post.user?.user_metadata?.full_name || "ユーザー";
  const userInitial = displayName[0].toUpperCase();
  const timeAgo = formatDistanceToNow(new Date(post.created_at), {
    addSuffix: true,
    locale: ja,
  });

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={post.user?.user_metadata?.avatar_url}
              alt={displayName}
            />
            <AvatarFallback>{userInitial}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="font-semibold text-sm">{displayName}</p>
              <span className="text-xs text-muted-foreground">·</span>
              <time className="text-xs text-muted-foreground">{timeAgo}</time>
            </div>
            <p className="text-xs text-muted-foreground">
              @{post.user?.email?.split("@")[0] || "user"}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm whitespace-pre-wrap">{post.content}</p>
        {post.images && post.images.length > 0 && (
          <ImageCarousel
            images={post.images}
            alt={`${displayName}の投稿画像`}
          />
        )}
      </CardContent>
    </Card>
  );
}
