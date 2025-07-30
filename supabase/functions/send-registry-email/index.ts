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

    // Store the confirmed purchase in database
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
        purchase_confirmed: true
      });

    if (dbError) {
      console.error("Database error:", dbError);
      throw new Error("Failed to store purchase information");
    }

    // Build additional requests section
    let additionalRequests = '';
    if (requestDelivery) {
      additionalRequests = '\n\nAdditional Requests:\n- Delivery assistance from Dimpho Parkies or Zama Kunene requested';
    }

    // Send notification email to registry owners
    const ownerSubject = `Gift Purchase Confirmed - ${buyerName} ${buyerSurname}`;
    const ownerEmailBody = `Dear Mndeni & Nwabisa,

${buyerName} ${buyerSurname} has confirmed they are purchasing a gift from your wedding registry:

Item: ${itemName}
Brand: ${itemBrand}
Price: ${itemPrice}
${itemSize ? `Size: ${itemSize}` : ''}
${itemColor ? `Color: ${itemColor}` : ''}

Gift Buyer: ${buyerName} ${buyerSurname}
${buyerEmail ? `Email: ${buyerEmail}` : ''}${additionalRequests}

They have been directed to complete their purchase from the retailer.

Best regards,
Wedding Registry System`;

    // Send emails
    const emailPromises = [
      resend.emails.send({
        from: "Wedding Registry <onboarding@resend.dev>",
        to: ["titus2luvo@gmail.com"],
        subject: ownerSubject,
        text: ownerEmailBody,
      })
    ];

    if (buyerEmail) {
      const buyerSubject = `Thank You - ${itemName}`;
      const buyerEmailBody = `Dear ${buyerName},

Thank you for confirming your gift selection from Mndeni & Nwabisa's wedding registry!

Your purchase details:
- Item: ${itemName}
- Brand: ${itemBrand}
- Price: ${itemPrice}
${itemSize ? `- Size: ${itemSize}` : ''}
${itemColor ? `- Color: ${itemColor}` : ''}

You will now be redirected to complete your purchase from the retailer.

Thank you for celebrating with Mndeni & Nwabisa!

Best regards,
Wedding Registry Team`;

      emailPromises.push(
        resend.emails.send({
          from: "Wedding Registry <onboarding@resend.dev>",
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
      message: "Purchase confirmed and registry owners notified"
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