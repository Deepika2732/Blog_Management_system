import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { z } from "zod";
import { User, Session } from "@supabase/supabase-js";
import { ArrowLeft, Save } from "lucide-react";

const postSchema = z.object({
  title: z.string().trim().min(3, { message: "Title must be at least 3 characters" }).max(200),
  content: z.string().trim().min(10, { message: "Content must be at least 10 characters" }).max(10000),
});

const CreateEditPost = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (!session?.user) {
        navigate("/auth");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (!session?.user) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (isEdit && user) {
      fetchPost();
    }
  }, [id, user]);

  const fetchPost = async () => {
    setFetching(true);
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      toast.error("Failed to fetch post");
      navigate("/dashboard");
    } else if (data.author_id !== user?.id) {
      toast.error("You don't have permission to edit this post");
      navigate("/dashboard");
    } else {
      setTitle(data.title);
      setContent(data.content);
    }
    setFetching(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      postSchema.parse({ title, content });

      if (isEdit) {
        const { error } = await supabase
          .from("blog_posts")
          .update({
            title: title.trim(),
            content: content.trim(),
          })
          .eq("id", id);

        if (error) throw error;
        toast.success("Post updated successfully!");
      } else {
        const { error } = await supabase
          .from("blog_posts")
          .insert({
            title: title.trim(),
            content: content.trim(),
            author_id: user?.id,
          });

        if (error) throw error;
        toast.success("Post created successfully!");
      }

      navigate("/dashboard");
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading post...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background py-8 px-4">
      <div className="container mx-auto max-w-3xl">
        <Button
          onClick={() => navigate("/dashboard")}
          variant="ghost"
          className="mb-6 hover:bg-secondary"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <Card className="shadow-xl border-border/50">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">
              {isEdit ? "Edit Post" : "Create New Post"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-base">Title</Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="Enter an engaging title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="text-lg h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content" className="text-base">Content</Label>
                <Textarea
                  id="content"
                  placeholder="Write your blog post content here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  className="min-h-[400px] text-base leading-relaxed resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all h-12"
                  disabled={loading}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? "Saving..." : isEdit ? "Update Post" : "Publish Post"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/dashboard")}
                  className="h-12"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateEditPost;
