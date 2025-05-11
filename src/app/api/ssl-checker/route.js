import sslChecker from "ssl-checker";

export async function POST(request) {
  const { url } = await request.json();

  try {
    // Sanitize and format the URL
    const formattedUrl = url.replace(/^https?:\/\//, "").split("/")[0];
    console.log("Processing URL:", formattedUrl); // Debugging Log

    // Perform the SSL check on the user-provided URL
    const sslData = await sslChecker(formattedUrl);
    return new Response(JSON.stringify(sslData), { status: 200 });
  } catch (error) {
    console.error("SSL Checker Error:", error); // Log the error for debugging
    return new Response(
      JSON.stringify({ 
        error: "Failed to check SSL certificate.",
        message: error.message 
      }),
      { status: 500 }
    );
  }
}