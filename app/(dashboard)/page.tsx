import { getPosts } from "@/lib/api/posts";
import { PostsList } from "@/components/posts-list";
import { CreatePostDialog } from "@/components/create-post-dialog";

export default async function HomePage() {
  const { posts, hasMore } = await getPosts(0, 10);

  return (
    <section className="max-w-lg mx-auto pb-12">
      <PostsList initialPosts={posts} initialHasMore={hasMore} />
      <CreatePostDialog />
    </section>
  );
}
