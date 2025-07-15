import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const supabase = createClient(
  "https://yptjhzawttwkaiacpnpc.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlwdGpoemF3dHR3a2FpYWNwbnBjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2MTQxNDUsImV4cCI6MjA2ODE5MDE0NX0.T3HG791nmPKtRyCDFJCfv6yIbaLxqvhyNJ3Ka1UMoJc"
);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const token = url.searchParams.get('token');

    if (!token) {
      return new Response('Missing confirmation token', { status: 400 });
    }

    // Find the purchase record by token
    const { data: purchase, error: fetchError } = await supabase
      .from('registry_purchases')
      .select('*')
      .eq('confirmation_token', token)
      .single();

    if (fetchError || !purchase) {
      console.error("Purchase not found:", fetchError);
      return new Response('Invalid or expired confirmation token', { status: 404 });
    }

    if (purchase.purchase_confirmed) {
      // Already confirmed, just redirect
      if (purchase.redirect_url) {
        return Response.redirect(purchase.redirect_url, 302);
      } else {
        return new Response('Purchase already confirmed. Thank you!', { status: 200 });
      }
    }

    // Mark purchase as confirmed
    const { error: updateError } = await supabase
      .from('registry_purchases')
      .update({ purchase_confirmed: true })
      .eq('confirmation_token', token);

    if (updateError) {
      console.error("Failed to confirm purchase:", updateError);
      throw new Error("Failed to confirm purchase");
    }

    // Update the registry item quantity (if the item exists in registry_items table)
    const { error: quantityError } = await supabase
      .from('registry_items')
      .update({ purchased_quantity: supabase.sql`purchased_quantity + 1` })
      .eq('id', purchase.item_id);

    if (quantityError) {
      console.log("Item not found in registry_items table or quantity update failed:", quantityError);
      // This is not critical, continue with the flow
    }

    // Send final confirmation emails
    const confirmationSubject = `Purchase Confirmed - ${purchase.item_name}`;
    const ownerConfirmationBody = `Dear Mndeni & Nwabisa,

A gift purchase has been confirmed for your wedding registry:

Item: ${purchase.item_name}
Brand: ${purchase.item_brand}
Price: ${purchase.item_price}
${purchase.item_size ? `Size: ${purchase.item_size}` : ''}
${purchase.item_color ? `Color: ${purchase.item_color}` : ''}

Purchased by: ${purchase.buyer_name} ${purchase.buyer_surname}
${purchase.buyer_email ? `Email: ${purchase.buyer_email}` : ''}

The buyer has been redirected to complete their purchase.

Best regards,
Wedding Registry System`;

    const emailPromises = [
      resend.emails.send({
        from: "Wedding Registry <onboarding@resend.dev>",
        to: ["titus3luvo@gmail.com"],
        subject: confirmationSubject,
        text: ownerConfirmationBody,
      })
    ];

    if (purchase.buyer_email) {
      const buyerConfirmationBody = `Dear ${purchase.buyer_name},

Thank you for confirming your gift selection from Mndeni & Nwabisa's wedding registry!

Your selection has been confirmed:
- Item: ${purchase.item_name}
- Brand: ${purchase.item_brand}
- Price: ${purchase.item_price}
${purchase.item_size ? `- Size: ${purchase.item_size}` : ''}
${purchase.item_color ? `- Color: ${purchase.item_color}` : ''}

You are now being redirected to complete your purchase. Thank you for celebrating with Mndeni & Nwabisa!

Best regards,
Wedding Registry Team`;

      emailPromises.push(
        resend.emails.send({
          from: "Wedding Registry <onboarding@resend.dev>",
          to: [purchase.buyer_email],
          subject: `Thank You - ${purchase.item_name}`,
          text: buyerConfirmationBody,
        })
      );
    }

    // Send confirmation emails (don't wait for them to complete)
    Promise.all(emailPromises).catch(error => {
      console.error("Failed to send confirmation emails:", error);
    });

    // Redirect to purchase URL or show success message
    if (purchase.redirect_url) {
      return Response.redirect(purchase.redirect_url, 302);
    } else {
      return new Response(`
        <html>
          <head><title>Purchase Confirmed</title></head>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
            <h1>🎉 Purchase Confirmed!</h1>
            <p>Thank you for confirming your gift selection from Mndeni & Nwabisa's wedding registry.</p>
            <p><strong>${purchase.item_name}</strong> by ${purchase.item_brand}</p>
            <p>Please proceed to purchase this item from the retailer.</p>
            <p>The couple has been notified of your generous gift!</p>
          </body>
        </html>
      `, {
        status: 200,
        headers: { "Content-Type": "text/html", ...corsHeaders },
      });
    }

  } catch (error: any) {
    console.error("Error in confirm-purchase function:", error);
    return new Response(
      `<html>
        <head><title>Error</title></head>
        <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
          <h1>❌ Error</h1>
          <p>Sorry, there was an error processing your confirmation.</p>
          <p>Please contact the registry owners for assistance.</p>
        </body>
      </html>`,
      {
        status: 500,
        headers: { "Content-Type": "text/html", ...corsHeaders },
      }
    );
  }
};

serve(handler);