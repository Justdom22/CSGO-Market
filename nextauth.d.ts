import { Role } from "@prisma/client";

// nextauth.d.ts
declare module "next-auth" {
  interface User {
    steamId?: number;
    role?: Role;
    balance?: number;

    trade_link?: string;
  }

  interface Session extends DefaultSession {
    user?: User;
  }
}
