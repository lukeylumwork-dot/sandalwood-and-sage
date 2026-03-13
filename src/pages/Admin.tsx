import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Trash2, Lock, LogOut, Pencil, X, Star } from "lucide-react";

const CATEGORIES = ["Tech", "Work", "Society", "Money", "Sport", "Politics"];
const VERIFY_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/verify-admin`;

interface Episode {
  id: string;
  title: string;
  category: string;
  created_at: string;
  is_featured: boolean;
}

interface EpisodeFull {
  id: string;
  title: string;
  topic: string;
  category: string;
  question: string;
  summary: string;
  host_intro: string;
  for_argument: string;
  against_argument: string;
  video_url: string | null;
  side_a_label: string | null;
  side_b_label: string | null;
  side_a_summary: string | null;
  side_b_summary: string | null;
}

type FormData = {
  title: string;
  category: string;
  summary: string;
  duration: string;
  question: string;
  host_intro: string;
  for_argument: string;
  against_argument: string;
  video_url: string;
  audio_url: string;
  side_a_label: string;
  side_b_label: string;
  side_a_summary: string;
  side_b_summary: string;
};

/* ─── Password Gate ─── */
function PasswordGate({ onAuth }: { onAuth: () => void }) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(VERIFY_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ password: password.trim() }),
      });
      if (res.ok) {
        sessionStorage.setItem("admin_auth", "true");
        onAuth();
      } else {
        setError("Incorrect password. Please try again.");
      }
    } catch {
      setError("Could not verify password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-5">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-lg border bg-card p-8 space-y-4"
      >
        <div className="flex items-center gap-2 mb-2">
          <Lock size={18} className="text-primary" />
          <h1 className="text-lg font-semibold text-card-foreground">Admin Access</h1>
        </div>
        <div>
          <label htmlFor="admin-pw" className="text-xs font-medium text-card-foreground block mb-1">
            Password
          </label>
          <Input
            id="admin-pw"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter admin password"
            autoFocus
          />
        </div>
        {error && <p className="text-xs text-destructive">{error}</p>}
        <Button type="submit" disabled={loading || !password.trim()} className="w-full" size="sm">
          {loading ? <Loader2 size={14} className="animate-spin mr-1.5" /> : null}
          Sign In
        </Button>
      </form>
    </div>
  );
}

/* ─── Episode Form (create + edit) ─── */
const EMPTY_FORM: FormData = {
  title: "",
  category: "Tech",
  summary: "",
  duration: "",
  question: "",
  host_intro: "",
  for_argument: "",
  against_argument: "",
  video_url: "",
  audio_url: "",
  side_a_label: "",
  side_b_label: "",
  side_a_summary: "",
  side_b_summary: "",
};

function EpisodeForm({
  editingId,
  initialData,
  onSaved,
  onCancel,
}: {
  editingId: string | null;
  initialData: FormData;
  onSaved: () => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<FormData>(initialData);
  const [saving, setSaving] = useState(false);
  const isEditing = !!editingId;

  useEffect(() => {
    setForm(initialData);
  }, [initialData]);

  const set = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.summary.trim() || !form.duration.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setSaving(true);

    const payload = {
      title: form.title.trim(),
      topic: form.title.trim(),
      category: form.category,
      question: form.question.trim() || form.title.trim(),
      summary: form.summary.trim(),
      host_intro: form.host_intro.trim() || form.summary.trim(),
      for_argument: form.for_argument.trim() || "No argument provided.",
      against_argument: form.against_argument.trim() || "No argument provided.",
      video_url: form.video_url.trim() || null,
      audio_url: form.audio_url.trim() || null,
      side_a_label: form.side_a_label.trim() || null,
      side_b_label: form.side_b_label.trim() || null,
      side_a_summary: form.side_a_summary.trim() || null,
      side_b_summary: form.side_b_summary.trim() || null,
    };

    let error;
    if (isEditing) {
      ({ error } = await supabase
        .from("generated_debates")
        .update(payload)
        .eq("id", editingId));
    } else {
      ({ error } = await supabase.from("generated_debates").insert(payload));
    }

    setSaving(false);
    if (error) {
      console.error("Save error:", error);
      toast.error(`Failed to ${isEditing ? "update" : "save"} episode. Please try again.`);
    } else {
      toast.success(isEditing ? "Episode updated!" : "Episode published!");
      if (!isEditing) setForm(EMPTY_FORM);
      onSaved();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border bg-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-card-foreground">
          {isEditing ? "Edit Episode" : "Publish New Episode"}
        </h2>
        {isEditing && (
          <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
            <X size={14} className="mr-1" /> Cancel
          </Button>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="text-xs font-medium text-card-foreground block mb-1">
            Title <span className="text-primary">*</span>
          </label>
          <Input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Episode title" />
        </div>

        <div>
          <label className="text-xs font-medium text-card-foreground block mb-1">
            Category <span className="text-primary">*</span>
          </label>
          <select
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-medium text-card-foreground block mb-1">
            Duration <span className="text-primary">*</span>
          </label>
          <Input value={form.duration} onChange={(e) => set("duration", e.target.value)} placeholder="e.g. 15 min" />
        </div>

        <div className="sm:col-span-2">
          <label className="text-xs font-medium text-card-foreground block mb-1">
            Description <span className="text-primary">*</span>
          </label>
          <Textarea value={form.summary} onChange={(e) => set("summary", e.target.value)} placeholder="Episode summary / description" rows={3} />
        </div>

        <div className="sm:col-span-2">
          <label className="text-xs font-medium text-card-foreground block mb-1">Question</label>
          <Input value={form.question} onChange={(e) => set("question", e.target.value)} placeholder="Central debate question" />
        </div>

        <div className="sm:col-span-2">
          <label className="text-xs font-medium text-card-foreground block mb-1">Host Introduction</label>
          <Textarea value={form.host_intro} onChange={(e) => set("host_intro", e.target.value)} placeholder="Host intro script" rows={3} />
        </div>

        <div>
          <label className="text-xs font-medium text-card-foreground block mb-1">For Argument</label>
          <Textarea value={form.for_argument} onChange={(e) => set("for_argument", e.target.value)} placeholder="The case for…" rows={4} />
        </div>

        <div>
          <label className="text-xs font-medium text-card-foreground block mb-1">Against Argument</label>
          <Textarea value={form.against_argument} onChange={(e) => set("against_argument", e.target.value)} placeholder="The case against…" rows={4} />
        </div>

        <div>
          <label className="text-xs font-medium text-card-foreground block mb-1">Video URL</label>
          <Input value={form.video_url} onChange={(e) => set("video_url", e.target.value)} placeholder="YouTube embed, Vimeo, MP4…" />
        </div>

        <div>
          <label className="text-xs font-medium text-card-foreground block mb-1">Audio URL</label>
          <Input value={form.audio_url} onChange={(e) => set("audio_url", e.target.value)} placeholder="URL to pre-generated audio file" />
        </div>

        <div>
          <label className="text-xs font-medium text-card-foreground block mb-1">Side A Label</label>
          <Input value={form.side_a_label} onChange={(e) => set("side_a_label", e.target.value)} placeholder="e.g. For Regulation" />
        </div>

        <div>
          <label className="text-xs font-medium text-card-foreground block mb-1">Side B Label</label>
          <Input value={form.side_b_label} onChange={(e) => set("side_b_label", e.target.value)} placeholder="e.g. Against Regulation" />
        </div>

        <div>
          <label className="text-xs font-medium text-card-foreground block mb-1">Side A Summary</label>
          <Textarea value={form.side_a_summary} onChange={(e) => set("side_a_summary", e.target.value)} placeholder="Summary of side A position" rows={2} />
        </div>

        <div>
          <label className="text-xs font-medium text-card-foreground block mb-1">Side B Summary</label>
          <Textarea value={form.side_b_summary} onChange={(e) => set("side_b_summary", e.target.value)} placeholder="Summary of side B position" rows={2} />
        </div>
      </div>

      <Button type="submit" disabled={saving} size="sm">
        {saving ? <Loader2 size={14} className="animate-spin mr-1.5" /> : null}
        {isEditing ? "Update Episode" : "Publish Episode"}
      </Button>
    </form>
  );
}

/* ─── Episode List ─── */
function EpisodeList({
  episodes,
  onDelete,
  onEdit,
  onToggleFeatured,
}: {
  episodes: Episode[];
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onToggleFeatured: (id: string, current: boolean) => void;
}) {
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    if (confirmId === id) {
      onDelete(id);
      setConfirmId(null);
    } else {
      setConfirmId(id);
    }
  };

  return (
    <div className="rounded-lg border bg-card p-6 space-y-4">
      <h2 className="text-base font-semibold text-card-foreground">
        Existing Episodes ({episodes.length})
      </h2>
      {episodes.length === 0 && (
        <p className="text-sm text-muted-foreground">No episodes found in the database.</p>
      )}
      <div className="grid gap-2">
        {episodes.map((ep) => (
          <div
            key={ep.id}
            className={`flex items-center justify-between gap-3 rounded-lg border p-3 ${ep.is_featured ? "border-primary/40" : ""}`}
          >
            <div className="min-w-0 flex items-center gap-2">
              <button
                onClick={() => onToggleFeatured(ep.id, ep.is_featured)}
                className="shrink-0"
                title={ep.is_featured ? "Unpin from featured" : "Pin as featured"}
              >
                <Star
                  size={16}
                  className={ep.is_featured ? "text-primary fill-primary" : "text-muted-foreground hover:text-primary"}
                />
              </button>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-medium text-primary">{ep.category}</span>
                  {ep.is_featured && (
                    <span className="text-[10px] font-medium text-primary bg-primary/10 rounded-full px-1.5 py-0.5">
                      Featured
                    </span>
                  )}
                </div>
                <h4 className="text-sm font-semibold text-card-foreground leading-snug truncate">
                  {ep.title}
                </h4>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(ep.id)}
              >
                <Pencil size={14} className="mr-1" />
                Edit
              </Button>
              <Button
                variant={confirmId === ep.id ? "destructive" : "ghost"}
                size="sm"
                onClick={() => handleDelete(ep.id)}
                onBlur={() => setConfirmId(null)}
              >
                <Trash2 size={14} className="mr-1" />
                {confirmId === ep.id ? "Confirm" : "Delete"}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Admin Page ─── */
const Admin = () => {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem("admin_auth") === "true");
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<FormData>(EMPTY_FORM);

  const fetchEpisodes = useCallback(async () => {
    const { data } = await supabase
      .from("generated_debates")
      .select("id, title, category, created_at, is_featured")
      .order("created_at", { ascending: false });
    if (data) setEpisodes(data as unknown as Episode[]);
  }, []);

  useEffect(() => {
    if (authed) fetchEpisodes();
  }, [authed, fetchEpisodes]);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("generated_debates").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete episode.");
    } else {
      toast.success("Episode deleted.");
      if (editingId === id) {
        setEditingId(null);
        setEditFormData(EMPTY_FORM);
      }
      fetchEpisodes();
    }
  };

  const handleEdit = async (id: string) => {
    const { data, error } = await supabase
      .from("generated_debates")
      .select("id, title, topic, category, question, summary, host_intro, for_argument, against_argument, video_url, side_a_label, side_b_label, side_a_summary, side_b_summary")
      .eq("id", id)
      .single();

    if (error || !data) {
      toast.error("Failed to load episode for editing.");
      return;
    }

    const ep = data as unknown as EpisodeFull;
    setEditingId(id);
    setEditFormData({
      title: ep.title,
      category: ep.category,
      summary: ep.summary,
      duration: "",
      question: ep.question,
      host_intro: ep.host_intro,
      for_argument: ep.for_argument,
      against_argument: ep.against_argument,
      video_url: ep.video_url || "",
      side_a_label: ep.side_a_label || "",
      side_b_label: ep.side_b_label || "",
      side_a_summary: ep.side_a_summary || "",
      side_b_summary: ep.side_b_summary || "",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSaved = () => {
    setEditingId(null);
    setEditFormData(EMPTY_FORM);
    fetchEpisodes();
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditFormData(EMPTY_FORM);
  };

  const handleToggleFeatured = async (id: string, currentlyFeatured: boolean) => {
    if (!currentlyFeatured) {
      // Unset any existing featured episode first
      await supabase
        .from("generated_debates")
        .update({ is_featured: false } as any)
        .eq("is_featured", true);
    }
    const { error } = await supabase
      .from("generated_debates")
      .update({ is_featured: !currentlyFeatured } as any)
      .eq("id", id);
    if (error) {
      toast.error("Failed to update featured status.");
    } else {
      toast.success(currentlyFeatured ? "Episode unpinned." : "Episode pinned as featured!");
      fetchEpisodes();
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_auth");
    setAuthed(false);
  };

  if (!authed) return <PasswordGate onAuth={() => setAuthed(true)} />;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-5 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-xl font-bold text-foreground">Episode Admin</h1>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut size={14} className="mr-1.5" />
            Sign Out
          </Button>
        </div>
        <div className="space-y-8">
          <EpisodeForm
            editingId={editingId}
            initialData={editingId ? editFormData : EMPTY_FORM}
            onSaved={handleSaved}
            onCancel={handleCancel}
          />
          <EpisodeList episodes={episodes} onDelete={handleDelete} onEdit={handleEdit} onToggleFeatured={handleToggleFeatured} />
        </div>
      </div>
    </div>
  );
};

export default Admin;
