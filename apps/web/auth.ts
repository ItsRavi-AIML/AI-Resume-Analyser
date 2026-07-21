import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const apiUrl = process.env.BACKEND_INTERNAL_API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  session: {
    strategy: "jwt"
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code"
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account?.provider === "google" && profile?.email && profile?.sub) {
        const response = await fetch(`${apiUrl}/auth/oauth/google`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-OAuth-Bridge-Secret": process.env.OAUTH_BRIDGE_SECRET ?? "change-me-oauth-bridge"
          },
          body: JSON.stringify({
            email: profile.email,
            name: profile.name ?? profile.email,
            google_sub: profile.sub,
            image: profile.picture
          })
        });

        if (!response.ok) {
          throw new Error("FastAPI OAuth exchange failed");
        }

        const data = (await response.json()) as {
          access_token: string;
          user: { name: string; email: string; image?: string };
        };
        token.backendAccessToken = data.access_token;
        token.user = data.user;
      }
      return token;
    },
    async session({ session, token }) {
      session.backendAccessToken = token.backendAccessToken as string | undefined;
      if (token.user && session.user) {
        const user = token.user as { name?: string; email?: string; image?: string };
        session.user.name = user.name ?? session.user.name;
        session.user.email = user.email ?? session.user.email;
        session.user.image = user.image ?? session.user.image;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login"
  }
});
