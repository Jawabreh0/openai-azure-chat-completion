const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");
const readline = require("readline");

// Set up the Azure OpenAI client
const endpoint = "you resource endpoint goes here or get it from the .env";
const apiKey = "your api key goes here or get it from the .env";
const client = new OpenAIClient(endpoint, new AzureKeyCredential(apiKey));

async function getChatCompletion(messages) {
  try {
    const deploymentId =
      "your deployment id goes here or get it from the .env, deployment id is the model name without the version";
    console.time("API Response Time");
    const result = await client.getChatCompletions(deploymentId, messages);
    console.timeEnd("API Response Time");
    return result.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error getting chat completion:", error);
    return null;
  }
}

// Set up readline for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Function to prompt user and get input
function askQuestion(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

// Main function to handle the chat loop
async function main() {
  console.log("Chat with the OpenAI model. Type 'exit' to quit.");
  let messages = [{ role: "system", content: "You are a helpful assistant." }];

  while (true) {
    const userInput = await askQuestion("> ");
    if (userInput.toLowerCase() === "exit") {
      rl.close();
      process.exit(0);
    }

    messages.push({ role: "user", content: userInput });

    const response = await getChatCompletion(messages);

    if (response) {
      console.log("AI:", response);
      messages.push({ role: "assistant", content: response });
    } else {
      console.log("Failed to get a response from the AI.");
    }
  }
}

main();
