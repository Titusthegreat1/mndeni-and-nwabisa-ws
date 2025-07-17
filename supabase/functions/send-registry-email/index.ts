import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const supabase = createClient(
  "https://yptjhzawttwkaiacpnpc.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlwdGpoemF3dHR3a2FpYWNwbnBjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2MTQxNDUsImV4cCI6MjA2ODE5MDE0NX0.T3HG791nmPKtRyCDFJCfv6yIbaLxqvhyNJ3Ka1UMoJc"
);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RegistryEmailRequest {
  itemId: number;
  itemName: string;
  itemBrand: string;
  itemPrice: string;
  itemSize?: string;
  itemColor?: string;
  itemWebsiteUrl?: string;
  buyerName: string;
  buyerSurname: string;
  buyerEmail?: string;
  requestDelivery?: boolean;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { itemId, itemName, itemBrand, itemPrice, itemSize, itemColor, itemWebsiteUrl, buyerName, buyerSurname, buyerEmail, requestDelivery }: RegistryEmailRequest = await req.json();

    // Generate unique confirmation token
    const confirmationToken = crypto.randomUUID();

    // Store purchase intent in database
    const { error: dbError } = await supabase
      .from('registry_purchases')
      .insert({
        item_id: itemId,
        item_name: itemName,
        item_brand: itemBrand,
        item_price: itemPrice,
        item_size: itemSize,
        item_color: itemColor,
        buyer_name: buyerName,
        buyer_surname: buyerSurname,
        buyer_email: buyerEmail,
        redirect_url: itemWebsiteUrl,
        confirmation_token: confirmationToken,
        purchase_confirmed: false
      });

    if (dbError) {
      console.error("Database error:", dbError);
      throw new Error("Failed to store purchase information");
    }

    // Create confirmation link
    const confirmationUrl = `https://yptjhzawttwkaiacpnpc.supabase.co/functions/v1/confirm-purchase?token=${confirmationToken}`;

    // Build additional requests section
    let additionalRequests = '';
    if (requestDelivery) {
      additionalRequests = '\n\nAdditional Requests:\n- Delivery assistance from Dimpho Parkies or Zama Kunene requested';
    }

    // Send notification email to registry owners
    const ownerSubject = `Gift Registry Selection from ${buyerName} ${buyerSurname} - ${itemName}`;
    const ownerEmailBody = `Dear Mndeni & Nwabisa,

${buyerName} ${buyerSurname} has selected an item from your wedding registry and is proceeding with the purchase:

Item: ${itemName}
Brand: ${itemBrand}
Price: ${itemPrice}
${itemSize ? `Size: ${itemSize}` : ''}
${itemColor ? `Color: ${itemColor}` : ''}

Gift Buyer: ${buyerName} ${buyerSurname}
${buyerEmail ? `Email: ${buyerEmail}` : ''}${additionalRequests}

This purchase is pending confirmation from the buyer.

Best regards,
Wedding Registry System`;

    // Send confirmation email to buyer if email provided
    const emailPromises = [
      resend.emails.send({
        from: "Wedding Registry <noreply@mndeni-and-nwabisa-ws.site>",
        to: ["dimphoparkies@gmail.com"],
        subject: ownerSubject,
        text: ownerEmailBody,
      })
    ];

    if (buyerEmail) {
      const buyerSubject = `Confirm Your Gift Purchase - ${itemName}`;
      const buyerEmailBody = `Dear ${buyerName},

Thank you for selecting a gift from Mndeni & Nwabisa's wedding registry!

Please confirm your gift selection by clicking the link below:
${confirmationUrl}

Item Details:
- Item: ${itemName}
- Brand: ${itemBrand}
- Price: ${itemPrice}
${itemSize ? `- Size: ${itemSize}` : ''}
${itemColor ? `- Color: ${itemColor}` : ''}

After confirming, you'll be redirected to complete your purchase.

Best regards,
Wedding Registry Team`;

      emailPromises.push(
        resend.emails.send({
          from: "Wedding Registry <noreply@mndeni-and-nwabisa-ws.site>",
          to: [buyerEmail],
          subject: buyerSubject,
          text: buyerEmailBody,
        })
      );
    }

    const emailResponses = await Promise.all(emailPromises);
    console.log("Emails sent successfully:", emailResponses);

    return new Response(JSON.stringify({ 
      success: true, 
      confirmationToken,
      confirmationUrl: buyerEmail ? confirmationUrl : null,
      message: buyerEmail ? "Confirmation email sent to buyer" : "Registry owners notified"
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-registry-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);