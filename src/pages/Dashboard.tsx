import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { User, Session } from "@supabase/supabase-js";
import { LogOut, Plus, Edit3 } from "lucide-react";
import PostCard from "@/components/PostCard";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  author_id: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    full_name: string | null;
  } | null;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

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
      } else {
        fetchPosts();
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("blog_posts")
      .select(`
        *,
        profiles(full_name)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to fetch posts");
      console.error(error);
    } else {
      setPosts(data || []);
    }
    setLoading(false);
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Failed to sign out");
    } else {
      toast.success("Signed out successfully");
      navigate("/auth");
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from("blog_posts")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Failed to delete post");
    } else {
      toast.success("Post deleted successfully");
      fetchPosts();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background">
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <Edit3 className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Blog CMS
              </h1>
              <p className="text-xs text-muted-foreground">Content Management</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              onClick={() => navigate("/create")}
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Post
            </Button>
            <Button onClick={handleSignOut} variant="outline" size="icon">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Your Blog Posts</h2>
          <p className="text-muted-foreground">Manage and organize your content</p>
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-card rounded-xl animate-pulse" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
              <Edit3 className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">No posts yet</h3>
            <p className="text-muted-foreground mb-6">Create your first blog post to get started</p>
            <Button
              onClick={() => navigate("/create")}
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Post
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                currentUserId={user?.id}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
