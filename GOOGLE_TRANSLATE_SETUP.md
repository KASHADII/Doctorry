# Google Translate API Integration Guide

## Overview
This guide will help you integrate Google Translate API into your Doctorry application to support 100+ languages dynamically.

## Prerequisites
- Google Cloud Account
- Credit card for billing (Google Translate API is paid)
- Basic understanding of React and API integration

## Step 1: Set Up Google Cloud Project

### 1.1 Create Google Cloud Account
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. Accept terms and conditions

### 1.2 Create a New Project
1. Click on the project dropdown at the top
2. Click "New Project"
3. Enter project name: `doctorry-translate`
4. Click "Create"

### 1.3 Enable Billing
1. Go to "Billing" in the left sidebar
2. Click "Link a billing account"
3. Create a new billing account
4. Add your credit card information

## Step 2: Enable Google Translate API

### 2.1 Enable the API
1. Go to "APIs & Services" > "Library"
2. Search for "Cloud Translation API"
3. Click on "Cloud Translation API"
4. Click "Enable"

### 2.2 Create API Key
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy the generated API key
4. (Optional) Click "Restrict Key" to limit usage

## Step 3: Configure Your Application

### 3.1 Environment Variables
1. Copy `env.example` to `.env.local` in your client folder:
   ```bash
   cp env.example .env.local
   ```

2. Edit `.env.local` and add your API key:
   ```
   VITE_GOOGLE_TRANSLATE_API_KEY=your_actual_api_key_here
   ```

### 3.2 Install Dependencies (if needed)
The implementation uses fetch API, so no additional packages are required.

## Step 4: Usage

### 4.1 Basic Usage
The Google Translate integration is automatically enabled when you add the API key. Users can:

1. Click the language switcher in the top-right corner
2. See "Powered by Google Translate" indicator
3. Select from 100+ supported languages
4. Experience real-time translation

### 4.2 Supported Languages
The integration supports all languages supported by Google Translate, including:
- Major world languages (Spanish, French, German, etc.)
- Indian regional languages (Bengali, Gujarati, Tamil, etc.)
- Asian languages (Chinese, Japanese, Korean, etc.)
- Middle Eastern languages (Arabic, Hebrew, etc.)

## Step 5: Cost Management

### 5.1 Pricing (as of 2024)
- $20 per 1M characters translated
- First 500K characters per month are free
- Detection: $20 per 1M characters

### 5.2 Cost Optimization Tips
1. **Caching**: Translations are cached for 24 hours
2. **Batch Translation**: Multiple texts are translated together
3. **Fallback**: Falls back to predefined languages if API fails
4. **Usage Monitoring**: Monitor usage in Google Cloud Console

### 5.3 Set Usage Limits
1. Go to "APIs & Services" > "Quotas"
2. Find "Cloud Translation API"
3. Set daily/monthly limits to control costs

## Step 6: Testing

### 6.1 Test the Integration
1. Start your development server: `npm run dev`
2. Open the language switcher
3. Try translating to different languages
4. Verify translations are accurate

### 6.2 Test Error Handling
1. Temporarily disable the API key
2. Verify fallback to basic languages works
3. Check console for error messages

## Step 7: Production Deployment

### 7.1 Security Considerations
- Never expose API keys in client-side code
- Use environment variables
- Consider server-side translation for sensitive data

### 7.2 Performance Optimization
- Enable caching
- Use CDN for static translations
- Implement lazy loading for translations

## Troubleshooting

### Common Issues

#### 1. API Key Not Working
- Verify the API key is correct
- Check if billing is enabled
- Ensure Cloud Translation API is enabled

#### 2. Translations Not Loading
- Check browser console for errors
- Verify network connectivity
- Check API quota limits

#### 3. High Costs
- Monitor usage in Google Cloud Console
- Implement usage limits
- Use caching effectively

### Error Messages
- `Translation failed: 403`: API key or billing issue
- `Translation failed: 429`: Rate limit exceeded
- `Translation failed: 400`: Invalid request parameters

## Advanced Features

### Custom Translation Service
You can extend the `translationService.js` to:
- Add custom translation logic
- Implement translation memory
- Add domain-specific terminology

### Server-Side Translation
For better security and performance:
1. Move translation logic to your backend
2. Use server-side Google Translate API
3. Cache translations in your database

## Support
- Google Cloud Documentation: https://cloud.google.com/translate/docs
- Google Cloud Support: https://cloud.google.com/support
- Community Forums: https://cloud.google.com/community

## Security Best Practices
1. Restrict API key to specific domains
2. Use environment variables
3. Monitor usage regularly
4. Implement rate limiting
5. Use HTTPS for all requests
