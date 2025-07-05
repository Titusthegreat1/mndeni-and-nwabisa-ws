import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RegistryEmailRequest {
  itemName: string;
  itemBrand: string;
  itemPrice: string;
  itemSize?: string;
  itemColor?: string;
  buyerName: string;
  buyerSurname: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { itemName, itemBrand, itemPrice, itemSize, itemColor, buyerName, buyerSurname }: RegistryEmailRequest = await req.json();

    const subject = `Gift Purchase - ${itemName} - Mndeni & Nwabisa Wedding Registry`;
    const emailBody = `Dear Mndeni & Nwabisa,

I would like to purchase the following item from your wedding registry:

Item: ${itemName}
Brand: ${itemBrand}
Price: ${itemPrice}
${itemSize ? `Size: ${itemSize}` : ''}
${itemColor ? `Color: ${itemColor}` : ''}

This email has been automatically generated to confirm my selection from your wedding registry. I will proceed with purchasing this item for your special day.

Please let me know if you need any additional information.

Best regards,
${buyerName} ${buyerSurname}`;

    const emailResponse = await resend.emails.send({
      from: "Wedding Registry <onboarding@resend.dev>",
      to: ["titus3luvo@gmail.com"],
      subject: subject,
      text: emailBody,
    });

    console.log("Registry email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailId: emailResponse.id }), {
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