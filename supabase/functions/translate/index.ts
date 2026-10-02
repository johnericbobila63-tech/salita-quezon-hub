const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const key = Deno.env.get("LOVABLE_API_KEY");
    if (!key) {
      return new Response(JSON.stringify({ error: "Missing LOVABLE_API_KEY" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { text, target, source, image } = await req.json();

    // Image mode: extract visible text from a photo (like Google Lens)
    if (image) {
      const imgRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Lovable-API-Key": key,
          "X-Lovable-AIG-SDK": "fetch",
        },
        body: JSON.stringify({
          model: "google/gemini-3.7-flash",
          messages: [
            {
              role: "system",
              content:
                "You are an OCR reader. Read ALL visible text in the image exactly as written, preserving line breaks. " +
                "Reply with ONLY the extracted text. If no text is readable, reply with an empty string.",
            },
            {
              role: "user",
              content: [
                { type: "text", text: "Extract the text from this image." },
                { type: "image_url", image_url: { url: image } },
              ],
            },
          ],
        }),
      });

      if (!imgRes.ok) {
        const detail = await imgRes.text();
        return new Response(JSON.stringify({ error: detail || "Could not read the image" }), {
          status: imgRes.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const imgData = await imgRes.json();
      const extracted = imgData?.choices?.[0]?.message?.content?.trim() ?? "";
      return new Response(JSON.stringify({ text: extracted }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!text || !target) {
      return new Response(JSON.stringify({ error: "text and target are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": key,
        "X-Lovable-AIG-SDK": "fetch",
      },
      body: JSON.stringify({
        model: "google/gemini-3.7-flash",
        messages: [
          {
            role: "system",
            content:
              "You are a translator specialized in Philippine languages, including Quezon province dialects (Tagalog-Quezon, Sariaya, Tayabas usage). " +
              "Translate the user's text faithfully and naturally. Reply with ONLY the translation, no notes, no quotes, no explanations.",
          },
          {
            role: "user",
            content: `Translate from ${source && source !== "auto" ? source : "the detected language"} to ${target}:\n\n${text}`,
          },
        ],
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      return new Response(JSON.stringify({ error: detail || "Translation failed" }), {
        status: res.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await res.json();
    const translation = data?.choices?.[0]?.message?.content?.trim() ?? "";
    return new Response(JSON.stringify({ translation }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
