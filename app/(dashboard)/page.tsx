"use client";

import React, { useCallback, useEffect, useState } from "react";
import { PostsList } from "@/components/posts-list";
import { CreatePostDialog } from "@/components/create-post-dialog";
import { getPostsClient } from "@/lib/api/posts-client";
import { Post } from "@/lib/types/post";

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [initialized, setInitialized] = useState(false);

  const fetchInitialPosts = useCallback(async () => {
    const { posts: newPosts, hasMore: newHasMore } = await getPostsClient(
      0,
      10
    );
    setPosts(newPosts);
    setHasMore(newHasMore);
    setInitialized(true);
  }, []);

  const handlePostCreated = useCallback(async () => {
    await fetchInitialPosts();
  }, [fetchInitialPosts]);

  useEffect(() => {
    if (!initialized) {
      fetchInitialPosts();
    }
  }, [initialized, fetchInitialPosts]);

  return (
    <section>
      <PostsList
        initialPosts={posts}
        initialHasMore={hasMore}
        key={posts.length}
      />
      <CreatePostDialog onPostCreated={handlePostCreated} />
    </section>
  );
}
