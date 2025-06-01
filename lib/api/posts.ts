import { Post } from "@/lib/types/post";
import createClient from "@/lib/supabase/server";

interface PostImage {
  image_url: string;
  image_order: number;
}

interface PostWithRelations {
  id: string;
  user_id: string;
  title?: string;
  content?: string;
  created_at: string;
  updated_at: string;
  post_images?: PostImage[];
}

export async function getPosts(
  page: number = 0,
  limit: number = 10
): Promise<{
  posts: Post[];
  hasMore: boolean;
}> {
  const supabase = await createClient();
  const from = page * limit;
  const to = from + limit;

  const {
    data: posts,
    error,
    count,
  } = await supabase
    .from("posts")
    .select(
      `
      *,
     post_images(
        image_url,
        image_order
      )
    `,
      { count: "exact" }
    )
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Error fetching posts:", error);
    return { posts: [], hasMore: false };
  }

  const formattedPosts: Post[] = ((posts || []) as PostWithRelations[]).map(
    (post) => ({
      id: post.id,
      user_id: post.user_id,
      title: post.title || "",
      content: post.content || "",
      images:
        post.post_images
          ?.sort((a, b) => a.image_order - b.image_order)
          .map((img) => img.image_url) || [],
      created_at: post.created_at,
      updated_at: post.updated_at,
    })
  );

  const hasMore = count ? from + limit < count : false;

  return { posts: formattedPosts, hasMore };
}
