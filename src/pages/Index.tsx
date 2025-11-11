import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Edit3, BookOpen, Sparkles } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-muted">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-2xl shadow-lg mb-6">
            <Edit3 className="w-10 h-10 text-primary-foreground" />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Blog Management
            </span>
            <br />
            <span className="text-foreground">Made Simple</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Create, edit, and manage your blog posts with ease. A beautiful and intuitive content management system.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Button
              onClick={() => navigate("/auth")}
              size="lg"
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all text-lg px-8 py-6 h-auto"
            >
              Get Started
              <Sparkles className="w-5 h-5 ml-2" />
            </Button>
            <Button
              onClick={() => navigate("/dashboard")}
              variant="outline"
              size="lg"
              className="text-lg px-8 py-6 h-auto hover:bg-secondary"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              View Dashboard
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-8 pt-16">
            <div className="p-6 rounded-xl bg-card border border-border/50 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Edit3 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Editing</h3>
              <p className="text-muted-foreground">
                Create and edit posts with a clean, distraction-free interface
              </p>
            </div>

            <div className="p-6 rounded-xl bg-card border border-border/50 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <BookOpen className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Organize Content</h3>
              <p className="text-muted-foreground">
                Keep all your blog posts organized in one beautiful dashboard
              </p>
            </div>

            <div className="p-6 rounded-xl bg-card border border-border/50 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Modern Design</h3>
              <p className="text-muted-foreground">
                Beautiful, responsive design that works on all devices
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
