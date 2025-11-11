import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Edit, Trash2, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface PostCardProps {
  post: {
    id: string;
    title: string;
    content: string;
    author_id: string;
    created_at: string;
    profiles?: {
      full_name: string | null;
    };
  };
  currentUserId?: string;
  onDelete: (id: string) => void;
}

const PostCard = ({ post, currentUserId, onDelete }: PostCardProps) => {
  const navigate = useNavigate();
  const isAuthor = currentUserId === post.author_id;
  const authorName = post.profiles?.full_name || "Anonymous";
  const excerpt = post.content.length > 150 
    ? post.content.substring(0, 150) + "..." 
    : post.content;

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-border/50 overflow-hidden">
      <div className="h-2 bg-gradient-to-r from-primary to-accent" />
      
      <CardHeader className="space-y-3">
        <h3 className="text-xl font-bold line-clamp-2 group-hover:text-primary transition-colors">
          {post.title}
        </h3>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <User className="w-4 h-4" />
          <span>{authorName}</span>
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-muted-foreground leading-relaxed line-clamp-4">
          {excerpt}
        </p>
      </CardContent>

      <CardFooter className="flex gap-2 pt-4 border-t border-border/50">
        {isAuthor && (
          <>
            <Button
              onClick={() => navigate(`/edit/${post.id}`)}
              variant="outline"
              size="sm"
              className="flex-1 hover:bg-secondary"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 hover:bg-destructive/10 hover:text-destructive hover:border-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Post</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete "{post.title}"? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDelete(post.id)}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default PostCard;
