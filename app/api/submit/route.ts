import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ImagePayload {
  name: string;
  base64: string;
  type: string;
}

interface FormPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  instagram: string;
  eventType: string;
  eventTypeOther: string;
  eventDate: string;
  guestCount: string;
  deliveryMethod: string;
  deliveryAddress: string;
  cakeTiers: string;
  servings: string;
  cakeFlavors: string[];
  cakeFlavorOther: string;
  fillingFlavors: string[];
  fillingFlavorOther: string;
  icingType: string;
  icingFinish: string;
  colorPalette: string;
  cakeShape: string;
  designStyle: string[];
  designDescription: string;
  inspirationImages: ImagePayload[];
  budgetRange: string;
  dietaryNeeds: string[];
  dietaryOther: string;
  hearAboutUs: string;
  additionalNotes: string;
}

// ─── HTML Email Template ──────────────────────────────────────────────────────

function buildEmailHtml(d: FormPayload): string {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "Not specified";
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const row = (label: string, value: string | string[]) => {
    const display = Array.isArray(value)
      ? value.length > 0
        ? value.join(", ")
        : "—"
      : value || "—";
    return `
      <tr>
        <td style="padding:10px 16px;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#8a7060;font-family:'Helvetica Neue',Arial,sans-serif;width:36%;vertical-align:top;border-bottom:1px solid #f0e8df;">
          ${label}
        </td>
        <td style="padding:10px 16px;font-size:14px;color:#2c1810;font-family:'Georgia',serif;border-bottom:1px solid #f0e8df;">
          ${display}
        </td>
      </tr>
    `;
  };

  const section = (title: string, rows: string) => `
    <div style="margin-bottom:32px;">
      <div style="background:#2c1810;padding:10px 16px;margin-bottom:0;">
        <p style="margin:0;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#f4ead8;font-family:'Helvetica Neue',Arial,sans-serif;">${title}</p>
      </div>
      <table style="width:100%;border-collapse:collapse;background:#fdfaf5;">
        ${rows}
      </table>
    </div>
  `;

  const fullName = `${d.firstName} ${d.lastName}`.trim();
  const eventLabel =
    d.eventType === "Other" && d.eventTypeOther
      ? d.eventTypeOther
      : d.eventType;

  const cakeFlavorsDisplay = [
    ...d.cakeFlavors.filter((f) => f !== "Other"),
    ...(d.cakeFlavors.includes("Other") && d.cakeFlavorOther
      ? [d.cakeFlavorOther]
      : []),
  ];

  const fillingFlavorsDisplay = [
    ...d.fillingFlavors.filter((f) => f !== "Other"),
    ...(d.fillingFlavors.includes("Other") && d.fillingFlavorOther
      ? [d.fillingFlavorOther]
      : []),
  ];

  const dietaryDisplay = [
    ...d.dietaryNeeds.filter((n) => n !== "Other"),
    ...(d.dietaryNeeds.includes("Other") && d.dietaryOther
      ? [d.dietaryOther]
      : []),
  ];

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <title>New Cake Inquiry — ${fullName}</title>
    </head>
    <body style="margin:0;padding:0;background:#f0e8df;">
      <div style="max-width:640px;margin:0 auto;padding:40px 20px;">

        <!-- Header -->
        <div style="background:#2c1810;padding:32px;margin-bottom:32px;text-align:center;">
          <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.3em;text-transform:uppercase;color:#c9968b;font-family:'Helvetica Neue',Arial,sans-serif;">
            New Inquiry Received
          </p>
          <h1 style="margin:0;font-size:36px;font-weight:300;color:#fdfaf5;font-family:'Georgia',serif;line-height:1.2;">
            ${fullName}
          </h1>
          <div style="width:40px;height:1px;background:#c9968b;margin:16px auto;"></div>
          <p style="margin:0;font-size:13px;color:#f4ead8;font-family:'Helvetica Neue',Arial,sans-serif;opacity:0.7;">
            ${eventLabel || "Custom Cake Request"} · ${formatDate(d.eventDate)}
          </p>
        </div>

        <!-- Contact -->
        ${section(
          "Contact Information",
          row("Name", fullName) +
            row("Email", d.email) +
            row("Phone", d.phone) +
            row("Instagram", d.instagram ? `@${d.instagram}` : "")
        )}

        <!-- Event -->
        ${section(
          "The Event",
          row("Event Type", eventLabel) +
            row("Date", formatDate(d.eventDate)) +
            row("Guest Count", d.guestCount) +
            row("Delivery", d.deliveryMethod) +
            (d.deliveryAddress
              ? row("Delivery Address", d.deliveryAddress)
              : "")
        )}

        <!-- Cake -->
        ${section(
          "The Cake",
          row("Tiers", d.cakeTiers) +
            row("Servings", d.servings) +
            row("Cake Flavor(s)", cakeFlavorsDisplay) +
            row("Filling Flavor(s)", fillingFlavorsDisplay) +
            row("Icing Type", d.icingType) +
            row("Frosting Finish", d.icingFinish)
        )}

        <!-- Design -->
        ${section(
          "The Design",
          row("Shape", d.cakeShape) +
            row("Style(s)", d.designStyle) +
            row("Color Palette", d.colorPalette) +
            row("Design Description", d.designDescription)
        )}

        <!-- Final Details -->
        ${section(
          "Final Details",
          row("Budget Range", d.budgetRange) +
            row("Dietary Needs", dietaryDisplay) +
            row("Heard From", d.hearAboutUs) +
            row("Additional Notes", d.additionalNotes)
        )}

        <!-- Images note -->
        ${
          d.inspirationImages.length > 0
            ? `<div style="background:#fdfaf5;padding:16px;margin-bottom:32px;border-left:3px solid #c9968b;">
                <p style="margin:0;font-size:13px;color:#2c1810;font-family:'Georgia',serif;">
                  📷 ${d.inspirationImages.length} inspiration image${d.inspirationImages.length !== 1 ? "s" : ""} attached to this email.
                </p>
              </div>`
            : ""
        }

        <!-- Footer -->
        <div style="text-align:center;padding-top:24px;">
          <p style="margin:0;font-size:11px;color:#a08070;font-family:'Helvetica Neue',Arial,sans-serif;letter-spacing:0.1em;">
            Reply directly to this email to respond to ${d.firstName}.
          </p>
        </div>

      </div>
    </body>
    </html>
  `;
}

// ─── Route Handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const body: FormPayload = await req.json();

    const { firstName, lastName, email } = body;
    const fullName = `${firstName} ${lastName}`.trim();

    // Build attachments from base64 images (max 8)
    const attachments = body.inspirationImages.slice(0, 8).map((img, i) => ({
      filename: img.name || `inspiration-${i + 1}.jpg`,
      content: Buffer.from(img.base64, "base64"),
      contentType: img.type || "image/jpeg",
    }));

    const result = await resend.emails.send({
      from: process.env.FROM_EMAIL ?? "noreply@yourdomain.com",
      to: process.env.BAKER_EMAIL ?? "",
      reply_to: email,
      subject: `🎂 New Cake Inquiry — ${fullName}`,
      html: buildEmailHtml(body),
      attachments,
    });

    if (result.error) {
      console.error("Resend error:", result.error);
      return NextResponse.json(
        { error: `Email failed: ${result.error.message}` },
        { status: 500 }
      );
    }

    // Send confirmation to the customer
    await resend.emails.send({
      from: process.env.FROM_EMAIL ?? "noreply@yourdomain.com",
      to: email,
      subject: `Your cake inquiry has been received ✦`,
      html: `
        <!DOCTYPE html>
        <html>
        <body style="margin:0;padding:0;background:#f0e8df;">
          <div style="max-width:560px;margin:0 auto;padding:40px 20px;">
            <div style="background:#2c1810;padding:32px;text-align:center;margin-bottom:24px;">
              <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.3em;text-transform:uppercase;color:#c9968b;font-family:'Helvetica Neue',Arial,sans-serif;">Inquiry Received</p>
              <h1 style="margin:0;font-size:32px;font-weight:300;color:#fdfaf5;font-family:'Georgia',serif;">Thank You, ${firstName}</h1>
            </div>
            <div style="background:#fdfaf5;padding:32px;">
              <p style="margin:0 0 16px;font-size:15px;color:#2c1810;font-family:'Georgia',serif;line-height:1.7;">
                Your inquiry has been received and I'm so excited to hear about your vision.
              </p>
              <p style="margin:0 0 16px;font-size:14px;color:#5c3524;font-family:'Helvetica Neue',Arial,sans-serif;line-height:1.7;">
                I'll be in touch within <strong>2–3 business days</strong> to discuss your cake and answer any questions.
              </p>
              <p style="margin:24px 0 0;font-size:13px;color:#8a7060;font-family:'Georgia',serif;font-style:italic;">
                Something beautiful is on its way. ✦
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Submission error:", err);
    const message = err instanceof Error ? err.message : "Failed to send inquiry.";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
