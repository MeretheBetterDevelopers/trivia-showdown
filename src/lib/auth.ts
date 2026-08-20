import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";
import { createAccessControl } from "better-auth/plugins/access";
import { headers } from "next/headers";
import { prisma } from "@/src/lib/prisma";

// The admin plugin's `adminRoles` option only controls a simpler
// "is this role considered admin" classification — it does NOT feed the
// plugin's own permission checks (e.g. what gates auth.api.setUserPassword).
// Those check role names against a *separate* statement map that defaults
// to the literal keys "admin"/"user" (lowercase), which never match our
// "ADMIN"/"MEMBER" values. Rebuilding that map under our own role names,
// with the exact same permission sets as the plugin's built-in defaults,
// is what actually makes those checks pass for "ADMIN".
const statement = {
  user: [
    "create",
    "list",
    "set-role",
    "ban",
    "impersonate",
    "delete",
    "set-password",
    "set-email",
    "get",
    "update",
  ],
  session: ["list", "revoke", "delete"],
} as const;

const accessControl = createAccessControl(statement);

const adminRole = accessControl.newRole({
  user: [...statement.user],
  session: [...statement.session],
});

const memberRole = accessControl.newRole({
  user: [],
  session: [],
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: { enabled: true },
  user: {
    fields: { image: "imageUrl" },
  },
  plugins: [
    admin({
      defaultRole: "MEMBER",
      adminRoles: ["ADMIN"],
      ac: accessControl,
      roles: { ADMIN: adminRole, MEMBER: memberRole },
    }),
    nextCookies(),
  ],
});

export async function getCurrentSession() {
  return auth.api.getSession({ headers: await headers() });
}
