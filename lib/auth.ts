import crypto from "crypto";

export const AUTH_COOKIE_NAME = "gym_auth";

export function expectedAuthToken(): string {
  const password = process.env.PWA_PASSWORD ?? "";
  return crypto.createHash("sha256").update(password).digest("hex");
}
