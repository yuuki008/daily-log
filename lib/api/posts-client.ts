import { Post } from "@/lib/types/post";
import createClient from "@/lib/supabase/client";

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
  profiles?: {
    id: string;
    email?: string;
    full_name?: string;
    avatar_url?: string;
  };
  post_images?: PostImage[];
}

export async function getPostsClient(
  page: number = 0,
  limit: number = 10
): Promise<{
  posts: Post[];
  hasMore: boolean;
}> {
  const supabase = createClient();
  const from = page * limit;
  const to = from + limit - 1;

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

export async function createPost(content: string, images: File[]) {
  const supabase = createClient();

  // 現在のユーザーを取得
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("ユーザーが認証されていません");
  }

  // 投稿を作成
  const { data: post, error: postError } = await supabase
    .from("posts")
    .insert({
      user_id: user.id,
      content,
    })
    .select()
    .single();

  if (postError || !post) {
    throw new Error("投稿の作成に失敗しました");
  }

  // 画像をアップロード
  if (images.length > 0) {
    const uploadPromises = images.map(async (file, index) => {
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/${post.id}/${index}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("post-images")
        .upload(fileName, file);

      if (uploadError) {
        console.error("画像のアップロードに失敗しました:", uploadError);
        return null;
      }

      // 画像のURLを取得
      const {
        data: { publicUrl },
      } = supabase.storage.from("post-images").getPublicUrl(fileName);

      return {
        post_id: post.id,
        image_url: publicUrl,
        image_order: index,
      };
    });

    const imageRecords = await Promise.all(uploadPromises);
    const validImageRecords = imageRecords.filter((record) => record !== null);

    // 画像レコードを挿入
    if (validImageRecords.length > 0) {
      const { error: imageError } = await supabase
        .from("post_images")
        .insert(validImageRecords);

      if (imageError) {
        console.error("画像レコードの作成に失敗しました:", imageError);
      }
    }
  }

  return post;
}
