import { GoogleGenerativeAI } from '@google/generative-ai';

// Function to get the prompt based on the style
const getPromptForStyle = (style, text) => {
  const baseInstructions = `
    Rewrite the following text. Your response should:
    1. Be approximately the same length as the original text or shorter
    2. Contain ONLY the rewritten text with no explanations, options, or additional commentary
    3. STRICTLY preserve ALL key information, points, and meaning of the original text
    4. Not include any introductory phrases like "Here's the rewritten text" or "Here you go"
    5. Sound natural and human-like, as if written by a real person
    6. Do not add any new information that wasn't in the original text
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
      - Keep the text short
      
      Original text: "${text}"`,
    
    'friendly': `${baseInstructions}
      Rewrite this in a genuinely warm and friendly tone. Your response should:
      - Use conversational language with a personal touch
      - Include encouraging and supportive phrases
      - Sound like someone speaking to a good friend
      - Use warm, inviting language that builds connection
      - Include occasional personal touches or questions
      - Have a positive, uplifting quality
      - Keep the text short
      
      Original text: "${text}"`,
    
    'business': `${baseInstructions}
      Rewrite this for a professional workplace context. Your response should:
      - Use appropriate business terminology and phrasing
      - Maintain a professional but not overly formal tone
      - Be clear, concise, and action-oriented
      - Include workplace-appropriate language
      - Sound like an email or message from a competent colleague
      - Be structured in a way that respects the reader's time
      - Keep the text short
      - DO NOT include a subject line or "Subject:" prefix
      
      Original text: "${text}"`,
    
    'gen-z': `${baseInstructions}
      Rewrite this using authentic Gen-Z language and style. Your response should:
      - Include current slang and expressions used by Gen-Z (born 1997-2012)
      - Use emojis naturally throughout the text 😎✨
      - Include abbreviated expressions and internet shorthand
      - Have a casual, conversational flow
      - Reference current trends or meme formats when appropriate
      - Sound like a text message or social media post from a Gen-Z person
      - Keep the text short
      
      Original text: "${text}"`
  };
  
  return prompts[style] || `${baseInstructions} Original text: "${text}"`;
};

// Get the second prompt based on the style and first result
const getSecondPrompt = (style, firstResult) => {
  const baseInstructions = `
    Rewrite the following text to sound more natural and human-like. Your response should:
    1. Preserve ALL key information and meaning
    2. Contain ONLY the rewritten text with no explanations or commentary
    3. Sound like it was written by a real person, not AI
    4. Use natural language patterns, occasional imperfections, and conversational elements
    5. Not be overly polished or formal unless appropriate for the style
  `;
  
  const prompts = {
    'developer': `${baseInstructions}
      Make this sound like it was written by a real software engineer or developer who is:
      - Knowledgeable but not pretentious
      - Slightly informal in their technical explanations
      - Using natural technical language that a developer would actually use
      - Writing to fellow developers in a Slack channel or technical documentation
      
      Text to rewrite: "${firstResult}"`,
    
    'friendly': `${baseInstructions}
      Make this sound like it was written by a warm, supportive friend who is:
      - Genuinely caring and interested
      - Using natural conversational language with occasional filler words
      - Writing a personal message to someone they care about
      - Being supportive without sounding artificial
      
      Text to rewrite: "${firstResult}"`,
    
    'business': `${baseInstructions}
      Make this sound like it was written by a real business professional who is:
      - Competent but not robotic
      - Writing an email to colleagues or clients
      - Using natural business language that a professional would actually use
      - Being concise but not unnaturally formal
      - NOT using a subject line or email header format
      
      Text to rewrite: "${firstResult}"`,
    
    'gen-z': `${baseInstructions}
      Make this sound like it was written by a real Gen-Z person who is:
      - Using authentic slang that doesn't feel forced
      - Texting or posting on social media
      - Using emojis in a natural way
      - Writing how a real young person would actually communicate
      - Being casual but not incomprehensible to others
      
      Text to rewrite: "${firstResult}"`
  };
  
  return prompts[style] || `${baseInstructions} Text to rewrite: "${firstResult}"`;
};

// Process text with Gemini API
export const processWithGemini = async (text, style, apiKey) => {
  try {
    // Initialize the Gemini API with the provided API key
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Get the generative model (Gemini Flash 2.0)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    
    // Step 1: Get the first prompt for the selected style
    const firstPrompt = getPromptForStyle(style, text);
    
    // Generate first content
    const firstResult = await model.generateContent(firstPrompt);
    const firstResponse = await firstResult.response;
    let firstGeneratedText = firstResponse.text();
    
    // Basic post-processing for the first result
    firstGeneratedText = firstGeneratedText
      .replace(/```[a-z]*\n/g, '')
      .replace(/```$/g, '')
      .replace(/^["']|["']$/g, '')
      .replace(/^(Here'?s?|I'?ve|I have|Below is|Following is|As requested|Rewritten|Rephrased).*?:\s*/i, '')
      .replace(/^Subject:.*?\n/i, '')
      .trim();
    
    // Step 2: Get the second prompt to make it more human-like
    const secondPrompt = getSecondPrompt(style, firstGeneratedText);
    
    // Generate second content
    const secondResult = await model.generateContent(secondPrompt);
    const secondResponse = await secondResult.response;
    let generatedText = secondResponse.text();
    
    // Full post-processing for the final result
    generatedText = generatedText
      // Remove any markdown code block formatting
      .replace(/```[a-z]*\n/g, '')
      .replace(/```$/g, '')
      // Remove any quotes that might be added
      .replace(/^["']|["']$/g, '')
      // Remove any "Here's the rewritten text" type phrases
      .replace(/^(Here'?s?|I'?ve|I have|Below is|Following is|As requested|Rewritten|Rephrased).*?:\s*/i, '')
      // Remove any explanations at the end
      .replace(/\n\n(Note|PS|P\.S\.|In summary|To summarize|In conclusion).*$/i, '')
      // Remove "Subject:" that often appears in business style
      .replace(/^Subject:.*?\n/i, '')
      // Trim whitespace
      .trim();
    
    return generatedText;
  } catch (error) {
    console.error('Error processing with Gemini:', error);
    throw new Error(`Failed to process text: ${error.message}`);
  }
};
