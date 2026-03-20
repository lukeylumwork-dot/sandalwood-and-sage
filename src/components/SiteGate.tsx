import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const SITE_PASSWORD = "Gareth2026";
const STORAGE_KEY = "ss_site_auth";

const SiteGate = ({ children }: { children: React.ReactNode }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY) === "1") {
      setAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === SITE_PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY, "1");
      setAuthenticated(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  if (loading) return null;
  if (authenticated) return <>{children}</>;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background">
      <form onSubmit={handleSubmit} className="mx-4 w-full max-w-sm space-y-4 text-center">
        <h1
          className="text-2xl tracking-tight text-foreground"
          style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
        >
          Sandalwood & Sage
        </h1>
        <p className="text-sm text-muted-foreground">
          This site is currently private. Enter the password to continue.
        </p>
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => { setPassword(e.target.value); setError(false); }}
          autoFocus
        />
        {error && (
          <p className="text-sm text-destructive">Incorrect password</p>
        )}
        <Button type="submit" className="w-full">Enter</Button>
      </form>
    </div>
  );
};

export default SiteGate;
