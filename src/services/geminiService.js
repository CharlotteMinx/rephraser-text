import { GoogleGenerativeAI } from '@google/generative-ai';

// Function to get the prompt based on the style
const getPromptForStyle = (style, text) => {
  const baseInstructions = `
    Rewrite the following text. Your response should:
    1. Be approximately the same length as the original text
    2. Contain ONLY the rewritten text with no explanations, options, or additional commentary
    3. Preserve the key information and meaning of the original text
    4. Not include any introductory phrases like "Here's the rewritten text" or "Here you go"
  `;
  
  const prompts = {
    'developer': `${baseInstructions}
      Use a developer-friendly tone with technical accuracy and clarity.
      Original text: "${text}"`,
    
    'friendly': `${baseInstructions}
      Use a friendly, warm, and approachable tone.
      Original text: "${text}"`,
    
    'business': `${baseInstructions}
      Use a professional business tone suitable for corporate communications.
      Original text: "${text}"`,
    
    'gen-z': `${baseInstructions}
      Use Gen-Z language, slang, and style.
      Original text: "${text}"`
  };
  
  return prompts[style] || `${baseInstructions} Original text: "${text}"`;
};

// Process text with Gemini API
export const processWithGemini = async (text, style, apiKey) => {
  try {
    // Initialize the Gemini API with the provided API key
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Get the generative model (Gemini Flash 2.0)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    
    // Get the prompt for the selected style
    const prompt = getPromptForStyle(style, text);
    
    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let generatedText = response.text();
    
    // Post-process the response to clean up any formatting issues
    generatedText = generatedText
      // Remove any markdown code block formatting
      .replace(/```[a-z]*\n/g, '')
      .replace(/```$/g, '')
      // Remove any quotes that might be added
      .replace(/^["']|["']$/g, '')
      // Remove any "Here's the rewritten text" type phrases
      .replace(/^(Here'?s?|I'?ve|I have|Below is|Following is).*?:\s*/i, '')
      // Trim whitespace
      .trim();
    
    return generatedText;
  } catch (error) {
    console.error('Error processing with Gemini:', error);
    throw new Error(`Failed to process text: ${error.message}`);
  }
};
