import { PostsList } from "@/components/posts-list";
import { getPosts } from "@/lib/api/posts";

export default async function HomePage() {
  const { posts, hasMore } = await getPosts(0, 10);

  return (
    <section className="max-w-2xl mx-auto">
      <PostsList initialPosts={posts} initialHasMore={hasMore} />
    </section>
  );
}
