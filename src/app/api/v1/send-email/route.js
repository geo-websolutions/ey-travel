import { sendEmail } from "@/lib/sendEmail";
import { admin } from "@/lib/firebaseAdmin";
import { checkRateLimit } from "@/utils/rateLimit";

export async function POST(request) {
  try {
    // Rate limiting
    const forwardedFor = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    const ip = forwardedFor?.split(",")[0]?.trim() || realIp || "unknown-ip";

    const { allowed } = await checkRateLimit(ip, "EMAIL_SENDING");
    if (!allowed) {
      return NextResponse.json(
        { success: false, message: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    // Extract payload
    const { to, cc, subject, title, htmlBody } = await request.json();
    if (!to || !subject || !title || !htmlBody) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    // Send email
    const result = await sendEmail({ to, cc, subject, title, htmlBody });
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
