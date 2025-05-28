import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const code = req.query.code as string;

  const basicAuth = Buffer.from(
    `${process.env.NEXT_PUBLIC_CLIENT_ID}:${process.env.NEXT_PUBLIC_SPOTIFY_SECRET}`
  ).toString("base64");

  const params = new URLSearchParams();
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("redirect_uri", process.env.NEXT_PUBLIC_REDIRECT_URI!);

  const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basicAuth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  const data = await tokenRes.json();

  if (!tokenRes.ok) {
    console.error("Token exchange failed", data);
    return res.status(500).json({ error: "Token exchange failed" });
  }

  const access_token = data.access_token;
  
  return res.redirect(`/swipe?access_token=${access_token}`);
}
