import { getPayPalAccessToken } from "@/lib/auth-action";

export async function POST(req: A) {
  const accessToken = await getPayPalAccessToken();
  const body = await req.json();
  const response = await fetch(
    "https://api-m.sandbox.paypal.com/v2/checkout/orders",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "PayPal-Request-Id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    }
  );
  const data = await response.json();
  return Response.json({ data });
}
