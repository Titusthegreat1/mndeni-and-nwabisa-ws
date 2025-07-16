import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RSVPEmailRequest {
  fullName: string;
  surname: string;
  attendance: string;
  guestCount: string;
  guestNames: string;
  songRequest: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { fullName, surname, attendance, guestCount, guestNames, songRequest }: RSVPEmailRequest = await req.json();

    // Define background email sending task
    const sendEmailInBackground = async () => {
      try {
        let subject: string;
        let emailBody: string;

        if (attendance === 'no') {
          subject = `RSVP Response - ${fullName} ${surname} - Cannot Attend`;
          emailBody = `Dear Mndeni & Nwabisa,

${fullName} ${surname} has responded to your wedding RSVP:

Response: Cannot attend

We're sorry they can't make it to your special day.

Best regards,
Mndeni & Nwabisa`;
        } else {
          const guestText = `${guestCount} guest${parseInt(guestCount) !== 1 ? 's' : ''} coming`;
          const guestNamesSection = guestNames ? `\nGuest Names: ${guestNames}` : '';
          const songRequestSection = songRequest ? `\nSong Request: ${songRequest}` : '';

          subject = `RSVP Response - ${fullName} ${surname} - Attending`;
          emailBody = `Dear Mndeni & Nwabisa,

${fullName} ${surname} has responded to your wedding RSVP:

Response: Will be attending! 🎉

RSVP Details:
Full Name: ${fullName}
Surname: ${surname}
Number of Guests: ${guestText}${guestNamesSection}${songRequestSection}

Looking forward to celebrating the special day

Best regards,
Mndeni & Nwabisa`;
        }

        await resend.emails.send({
          from: "Wedding RSVP <noreply@mndeni-and-nwabisa-ws.site>",
          to: ["dimphoparkies@gmail.com"],
          subject: subject,
          text: emailBody,
        });

        console.log("RSVP email sent successfully");
      } catch (error) {
        console.error("Error sending RSVP email:", error);
      }
    };

    // Start background task
    EdgeRuntime.waitUntil(sendEmailInBackground());

    // Return immediate response
    return new Response(JSON.stringify({ 
      success: true, 
      message: attendance === 'no' ? "RSVP response recorded" : "RSVP submitted successfully"
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-rsvp-email function:", error);
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