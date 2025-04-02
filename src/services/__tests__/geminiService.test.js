import { processWithGemini } from '../geminiService';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Mock the GoogleGenerativeAI module
jest.mock('@google/generative-ai', () => {
  const mockGenerateContent = jest.fn();
  const mockResponse = {
    response: {
      text: jest.fn().mockReturnValue('Mocked response text')
    }
  };
  
  mockGenerateContent.mockResolvedValue(mockResponse);
  
  return {
    GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
      getGenerativeModel: jest.fn().mockReturnValue({
        generateContent: mockGenerateContent
      })
    }))
  };
});

describe('geminiService', () => {
  const mockText = 'This is a test text to be rephrased.';
  const mockApiKey = 'test-api-key';
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('initializes GoogleGenerativeAI with the provided API key', async () => {
    await processWithGemini(mockText, 'developer', mockApiKey);
    
    expect(GoogleGenerativeAI).toHaveBeenCalledWith(mockApiKey);
  });
  
  test('uses the correct model', async () => {
    await processWithGemini(mockText, 'developer', mockApiKey);
    
    // Check that getGenerativeModel was called with the correct model
    const mockGetGenerativeModel = GoogleGenerativeAI.mock.results[0].value.getGenerativeModel;
    expect(mockGetGenerativeModel).toHaveBeenCalledWith({ model: 'gemini-2.0-flash' });
  });
  
  test('processes text with developer style', async () => {
    const result = await processWithGemini(mockText, 'developer', mockApiKey);
    
    const genAI = new GoogleGenerativeAI(mockApiKey);
    const model = genAI.getGenerativeModel();
    
    // Check that generateContent was called twice (first and second prompts)
    expect(model.generateContent).toHaveBeenCalledTimes(2);
    
    // Check that the first call includes the developer style
    const firstCall = model.generateContent.mock.calls[0][0];
    expect(firstCall).toContain('developer');
    expect(firstCall).toContain(mockText);
    
    // Check the result
    expect(result).toBe('Mocked response text');
  });
  
  test('processes text with friendly style', async () => {
    await processWithGemini(mockText, 'friendly', mockApiKey);
    
    const genAI = new GoogleGenerativeAI(mockApiKey);
    const model = genAI.getGenerativeModel();
    
    const firstCall = model.generateContent.mock.calls[0][0];
    expect(firstCall).toContain('friendly');
    expect(firstCall).toContain(mockText);
  });
  
  test('processes text with business style', async () => {
    await processWithGemini(mockText, 'business', mockApiKey);
    
    const genAI = new GoogleGenerativeAI(mockApiKey);
    const model = genAI.getGenerativeModel();
    
    const firstCall = model.generateContent.mock.calls[0][0];
    expect(firstCall).toContain('business');
    expect(firstCall).toContain(mockText);
  });
  
  test('processes text with gen-z style', async () => {
    await processWithGemini(mockText, 'gen-z', mockApiKey);
    
    // Get the mock model
    const mockModel = GoogleGenerativeAI.mock.results[0].value.getGenerativeModel();
    
    // Check the first call to generateContent
    const firstCall = mockModel.generateContent.mock.calls[0][0];
    // Use a case-insensitive check since it might be 'Gen-Z' in the code
    expect(firstCall.toLowerCase()).toContain('gen-z');
    expect(firstCall).toContain(mockText);
  });
  
  test('handles API errors gracefully', async () => {
    // Mock the API to throw an error
    const errorMessage = 'API error';
    GoogleGenerativeAI.mockImplementationOnce(() => ({
      getGenerativeModel: jest.fn().mockReturnValue({
        generateContent: jest.fn().mockRejectedValue(new Error(errorMessage))
      })
    }));
    
    await expect(processWithGemini(mockText, 'developer', mockApiKey))
      .rejects
      .toThrow(`Failed to process text: ${errorMessage}`);
  });
  
  test('post-processes the response text correctly', async () => {
    // Mock a response with formatting that needs to be cleaned
    const formattedResponse = `
      \`\`\`
      Here's the rewritten text: "This is a formatted response with code blocks and quotes."
      \`\`\`
    `;
    
    // For the second response (which is what gets returned)
    const cleanedResponse = 'This is a formatted response with code blocks and quotes.';
    
    const mockResponseWithFormatting = {
      response: {
        text: jest.fn().mockReturnValue(formattedResponse)
      }
    };
    
    const mockCleanedResponse = {
      response: {
        text: jest.fn().mockReturnValue(cleanedResponse)
      }
    };
    
    // Mock the first call to return formatted text, second call to return cleaned text
    const mockGenerateContent = jest.fn()
      .mockResolvedValueOnce(mockResponseWithFormatting)
      .mockResolvedValueOnce(mockCleanedResponse);
    
    GoogleGenerativeAI.mockImplementationOnce(() => ({
      getGenerativeModel: jest.fn().mockReturnValue({
        generateContent: mockGenerateContent
      })
    }));
    
    const result = await processWithGemini(mockText, 'developer', mockApiKey);
    
    // The result should be the cleaned text
    expect(result).toBe(cleanedResponse);
  });
});
