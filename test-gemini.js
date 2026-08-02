const { GoogleGenerativeAI } = require("@google/generative-ai");

// Replace the placeholder below with your actual API key
const genAI = new GoogleGenerativeAI("YOUR_ACTUAL_API_KEY_HERE");

async function test() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Hello, are you working?");
    console.log("Success! Response from Gemini:");
    console.log(result.response.text());
  } catch (err) {
    console.error("Test failed with error:", err.message);
  }
}

test();


