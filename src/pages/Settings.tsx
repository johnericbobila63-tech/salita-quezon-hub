import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTheme } from "next-themes";
import { z } from "zod";
import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Moon, Sun, LogOut, LogIn, Star, MessageSquare, Flag, Loader2, User as UserIcon } from "lucide-react";

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().trim().max(1000).optional(),
});
const reportSchema = z.object({
  category: z.string().min(1),
  description: z.string().trim().min(5, "Please describe the issue").max(2000),
});

const Settings = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { theme, setTheme } = useTheme();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const [category, setCategory] = useState("bug");
  const [description, setDescription] = useState("");
  const [submittingReport, setSubmittingReport] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out");
  };

  const submitReview = async () => {
    if (!user) return toast.error("Please sign in to leave a review");
    const parsed = reviewSchema.safeParse({ rating, comment });
    if (!parsed.success) return toast.error(parsed.error.errors[0].message);
    setSubmittingReview(true);
    const { error } = await supabase.from("reviews").insert({
      user_id: user.id, rating, comment: comment || null,
    });
    setSubmittingReview(false);
    if (error) return toast.error(error.message);
    toast.success("Thanks for your review!");
    setRating(0); setComment("");
  };

  const submitReport = async () => {
    if (!user) return toast.error("Please sign in to submit a report");
    const parsed = reportSchema.safeParse({ category, description });
    if (!parsed.success) return toast.error(parsed.error.errors[0].message);
    setSubmittingReport(true);
    const { error } = await supabase.from("reports").insert({
      user_id: user.id, category, description,
    });
    setSubmittingReport(false);
    if (error) return toast.error(error.message);
    toast.success("Report sent. Salamat!");
    setDescription("");
  };

  return (
    <Layout>
      <div className="container max-w-2xl py-8 space-y-6">
        <div>
          <h1 className="font-display text-3xl">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">Account, appearance, and feedback</p>
        </div>

        {/* Account */}
        <Card className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="grid place-items-center w-10 h-10 rounded-full bg-primary/10 text-primary">
              <UserIcon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">
                {authLoading ? "…" : user ? (user.user_metadata?.display_name || user.email) : "Not signed in"}
              </div>
              {user && <div className="text-xs text-muted-foreground truncate">{user.email}</div>}
            </div>
          </div>
          {user ? (
            <Button variant="outline" className="w-full" onClick={handleLogout}>
              <LogOut className="w-4 h-4" /> Sign out
            </Button>
          ) : (
            <Button className="w-full" asChild>
              <Link to="/auth"><LogIn className="w-4 h-4" /> Sign in</Link>
            </Button>
          )}
        </Card>

        {/* Theme */}
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {theme === "dark" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              <div>
                <Label htmlFor="dark-mode" className="font-medium">Dark mode</Label>
                <p className="text-xs text-muted-foreground">Switch between light and dark theme</p>
              </div>
            </div>
            <Switch
              id="dark-mode"
              checked={theme === "dark"}
              onCheckedChange={(c) => setTheme(c ? "dark" : "light")}
            />
          </div>
        </Card>

        {/* Review */}
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className="w-5 h-5 text-primary" />
            <h2 className="font-display text-xl">Leave a review</h2>
          </div>
          <div className="flex gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} type="button" onClick={() => setRating(n)} aria-label={`Rate ${n}`}>
                <Star className={`w-7 h-7 transition-smooth ${n <= rating ? "fill-saffron text-saffron" : "text-muted-foreground"}`} />
              </button>
            ))}
          </div>
          <Textarea
            placeholder="Share your experience (optional)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={1000}
            className="mb-3"
          />
          <Button onClick={submitReview} disabled={submittingReview || rating === 0} className="w-full">
            {submittingReview && <Loader2 className="w-4 h-4 animate-spin" />}
            Submit review
          </Button>
        </Card>

        {/* Report */}
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <Flag className="w-5 h-5 text-accent" />
            <h2 className="font-display text-xl">Report an issue</h2>
          </div>
          <div className="space-y-3">
            <div>
              <Label className="text-sm">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="bug">Bug / something broken</SelectItem>
                  <SelectItem value="content">Wrong word or definition</SelectItem>
                  <SelectItem value="suggestion">Feature suggestion</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Textarea
              placeholder="Tell us what happened or what you'd like to change…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={2000}
              rows={4}
            />
            <Button onClick={submitReport} disabled={submittingReport} variant="secondary" className="w-full">
              {submittingReport && <Loader2 className="w-4 h-4 animate-spin" />}
              Send report
            </Button>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default Settings;
