import { GoogleGenerativeAI } from '@google/generative-ai';

// Function to get the prompt based on the style
const getPromptForStyle = (style, text) => {
  const baseInstructions = `
    Rewrite the following text. Your response should:
    1. Be approximately the same length as the original text
    2. Contain ONLY the rewritten text with no explanations, options, or additional commentary
    3. Preserve the key information and meaning of the original text
    4. Not include any introductory phrases like "Here's the rewritten text" or "Here you go"
    5. Sound natural and human-like, as if written by a real person
  `;
  
  const prompts = {
    'developer': `${baseInstructions}
      Rewrite this as if a software engineer wrote it. Your response should:
      - Use precise technical terminology where appropriate
      - Be concise and efficient in expression
      - Include occasional programming analogies or references
      - Have a logical structure with clear reasoning
      - Maintain a slightly informal but professional tone
      - Use technical jargon that would be familiar to developers
      
      Original text: "${text}"`,
    
    'friendly': `${baseInstructions}
      Rewrite this in a genuinely warm and friendly tone. Your response should:
      - Use conversational language with a personal touch
      - Include encouraging and supportive phrases
      - Sound like someone speaking to a good friend
      - Use warm, inviting language that builds connection
      - Include occasional personal touches or questions
      - Have a positive, uplifting quality
      
      Original text: "${text}"`,
    
    'business': `${baseInstructions}
      Rewrite this for a professional workplace context. Your response should:
      - Use appropriate business terminology and phrasing
      - Maintain a professional but not overly formal tone
      - Be clear, concise, and action-oriented
      - Include workplace-appropriate language
      - Sound like an email or message from a competent colleague
      - Be structured in a way that respects the reader's time
      
      Original text: "${text}"`,
    
    'gen-z': `${baseInstructions}
      Rewrite this using authentic Gen-Z language and style. Your response should:
      - Include current slang and expressions used by Gen-Z (born 1997-2012)
      - Use emojis naturally throughout the text 😎✨
      - Include abbreviated expressions and internet shorthand
      - Have a casual, conversational flow
      - Reference current trends or meme formats when appropriate
      - Sound like a text message or social media post from a Gen-Z person
      
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
