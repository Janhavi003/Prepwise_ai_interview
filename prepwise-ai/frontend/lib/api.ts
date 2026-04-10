const DEFAULT_API_BASE = "https://prepwise-bo7r.onrender.com";

export function getApiBaseUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_API_URL?.trim();
  const base = fromEnv || DEFAULT_API_BASE;
  return base.replace(/\/$/, "");
}
