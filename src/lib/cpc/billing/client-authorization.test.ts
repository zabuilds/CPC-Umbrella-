import { describe, expect, it } from "vitest";

import { requireAuthenticatedCpcClient } from "./client-authorization";

const getUser = vi.fn();
const maybeSingle = vi.fn();
const from = vi.fn(() => ({
  select: () => ({
    eq: () => ({
      eq: () => ({ maybeSingle }),
    }),
  }),
}));

vi.mock("@/lib/supabase/server", () => ({
  createClient: async () => ({ auth: { getUser } }),
}));

vi.mock("@/lib/supabase/admin", () => ({
  getSupabaseAdminClient: () => ({ from }),
}));

describe("CPC billing client authorization", () => {
  it("rejects unauthenticated requests", async () => {
    getUser.mockResolvedValueOnce({ data: { user: null }, error: null });
    await expect(requireAuthenticatedCpcClient()).rejects.toThrow("Authentication required");
  });

  it("rejects authenticated users without an active CPC client", async () => {
    getUser.mockResolvedValueOnce({ data: { user: { id: "user-1" } }, error: null });
    maybeSingle.mockResolvedValueOnce({ data: null, error: null });
    await expect(requireAuthenticatedCpcClient()).rejects.toThrow("CPC client account not found");
  });

  it("returns only the active client linked to the authenticated profile", async () => {
    getUser.mockResolvedValueOnce({ data: { user: { id: "user-1" } }, error: null });
    maybeSingle.mockResolvedValueOnce({
      data: { id: "client-1", email: "client@example.test", profile_id: "user-1", status: "active" },
      error: null,
    });

    const result = await requireAuthenticatedCpcClient();
    expect(result.client.id).toBe("client-1");
    expect(maybeSingle).toHaveBeenCalled();
  });
});
