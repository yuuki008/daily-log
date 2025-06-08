"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { PostCard } from "@/components/post-card";
import { Loader2 } from "lucide-react";
import { Post } from "@/lib/types/post";
import { getPostsClient } from "@/lib/api/posts-client";
import dayjs from "dayjs";

interface PostsListProps {
  initialPosts: Post[];
  initialHasMore: boolean;
}

export function PostsList({ initialPosts, initialHasMore }: PostsListProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const loadMorePosts = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const { posts: newPosts, hasMore: newHasMore } = await getPostsClient(
        page,
        10
      );
      setPosts((prevPosts) => [...prevPosts, ...newPosts]);
      setHasMore(newHasMore);
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error("Failed to load more posts:", error);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting) {
          loadMorePosts();
        }
      },
      { threshold: 0.1 }
    );

    observerRef.current = observer;
    const currentLoadMoreRef = loadMoreRef.current;

    if (currentLoadMoreRef) {
      observer.observe(currentLoadMoreRef);
    }

    return () => {
      if (currentLoadMoreRef && observerRef.current) {
        observerRef.current.unobserve(currentLoadMoreRef);
      }
    };
  }, [loadMorePosts]);

  if (posts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No posts yet</p>
      </div>
    );
  }

  return (
    <div className="relative max-w-lg mx-auto pb-12">
      <div>
        {posts.map((post, idx) => {
          const prevPost = posts[idx - 1];
          const isSame =
            prevPost &&
            dayjs(prevPost.created_at).isSame(post.created_at, "day");
          if (prevPost && isSame) return <PostCard key={post.id} post={post} />;

          const postDate = dayjs(post.created_at).format("MMM D, YYYY	");
          return (
            <div key={post.id}>
              <div className="sticky top-0 z-20 bg-background text-left p-2">
                {postDate}
              </div>
              <PostCard post={post} />
            </div>
          );
        })}
      </div>

      {hasMore && (
        <div ref={loadMoreRef} className="flex justify-center py-4">
          {loading && (
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          )}
        </div>
      )}

      {!hasMore && posts.length > 0 && (
        <div className="text-center py-4">
          <p className="text-sm text-muted-foreground">
            All posts are displayed
          </p>
        </div>
      )}
    </div>
  );
}
