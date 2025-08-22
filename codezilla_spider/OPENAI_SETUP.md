# OpenAI Integration Setup Guide

This guide explains how to set up the OpenAI API integration for the EchoMed AI medicine assistant and recommendations system.

## Prerequisites

- Python 3.8+
- Node.js 16+
- OpenAI API key

## Setup Instructions

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd codezilla_spider/backend
   ```

2. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Create a `.env` file in the backend directory with the following content:
   ```env
   # OpenAI Configuration
   OPENAI_API_KEY=your_openai_api_key_here

   # AWS Configuration (fill in your values)
   AWS_ACCESS_KEY_ID=your_aws_access_key_id
   AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
   AWS_REGION_NAME=us-east-1

   # Bedrock Configuration (fill in your values)
   BEDROCK_MODEL_ID=anthropic.claude-3-opus-20240229-v1:0
   BEDROCK_SYNTHESIS_MODEL_ID=anthropic.claude-3-haiku-20240307-v1:0

   # ElevenLabs Configuration (fill in your values)
   ELEVENLABS_API_KEY=your_elevenlabs_api_key

   # Kendra Configuration (fill in your values)
   KENDRA_INDEX_ID=your_kendra_index_id

   # Neptune Configuration (fill in your values)
   NEPTUNE_ENDPOINT=your_neptune_endpoint

   # S3 Configuration (fill in your values)
   S3_BUCKET_NAME=your_s3_bucket_name

   # DynamoDB Configuration (fill in your values)
   DYNAMODB_SPEAKERS_TABLE_NAME=your_speakers_table_name
   DYNAMODB_ANALYTICS_TABLE_NAME=your_analytics_table_name
   DYNAMODB_ALERTS_TABLE_NAME=your_alerts_table_name
   DYNAMODB_TASKS_TABLE_NAME=your_tasks_table_name

   # Hugging Face Configuration (fill in your values)
   HUGGING_FACE_TOKEN=your_hugging_face_token

   # Google Configuration (fill in your values)
   GOOGLE_CREDENTIALS_PATH=credentials.json
   GOOGLE_TOKEN_PATH=token.json
   ```

4. Start the backend server:
   ```bash
   python main.py
   ```

### 2. Frontend Setup

1. Navigate to the project root:
   ```bash
   cd codezilla_spider
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Start the frontend development server:
   ```bash
   npm run dev
   ```

## Features

### 1. AI-Powered Medicine Recommendations

The system now includes advanced AI-powered medicine recommendations using OpenAI's GPT-4 model:

- **Symptom Analysis**: AI analyzes user symptoms and provides detailed insights
- **Personalized Recommendations**: Tailored medicine suggestions based on symptoms
- **Dosage Information**: Detailed dosage and frequency recommendations
- **Side Effects & Warnings**: Comprehensive safety information
- **Urgency Assessment**: AI determines if immediate medical attention is needed
- **Lifestyle Recommendations**: Non-medical intervention suggestions

### 2. Enhanced Health Chat

The EchoMed Emergency Chat now features:

- **AI-Powered Responses**: Uses OpenAI for intelligent health consultations
- **Fallback Mode**: Automatically falls back to emergency mode if AI is unavailable
- **Conversation Context**: Maintains conversation history for better responses
- **Real-time Status**: Shows AI availability status

### 3. Medical Text Analysis

Advanced text analysis capabilities:

- **Symptom Extraction**: Identifies key symptoms from medical text
- **Condition Assessment**: Suggests potential medical conditions
- **Action Recommendations**: Provides recommended next steps
- **Urgency Classification**: Determines urgency level

## API Endpoints

### AI Medicine Recommendations
- `POST /ai/medicine/recommend` - Get AI-powered medicine recommendations

### AI Health Consultation
- `POST /ai/health/consultation` - Get AI health consultation

### Medical Text Analysis
- `POST /ai/medical/text-analysis` - Analyze medical text

## Components

### 1. EchoMedEmergencyChat
Enhanced chat component with AI integration:
- Automatic fallback to emergency mode
- Real-time AI status indication
- Conversation history support

### 2. AIOpenAIMedicineRecommendation
New AI-powered medicine recommendation component:
- Advanced symptom analysis
- Personalized recommendations
- Comprehensive safety information
- Progress tracking

## Security & Safety

### Medical Disclaimers
- All AI recommendations include medical disclaimers
- Users are advised to consult healthcare professionals
- AI does not replace professional medical advice

### API Key Security
- OpenAI API key is stored in environment variables
- Never commit API keys to version control
- Use secure key management practices

## Troubleshooting

### Common Issues

1. **AI Service Unavailable**
   - Check if the backend server is running
   - Verify OpenAI API key is correct
   - Check network connectivity

2. **Fallback to Emergency Mode**
   - This is normal behavior when AI is unavailable
   - System automatically switches to offline mode
   - Check backend logs for error details

3. **API Key Issues**
   - Ensure the API key is valid and has sufficient credits
   - Check if the key has the necessary permissions
   - Verify the key format is correct

## Support

For issues or questions:
1. Check the backend logs for error messages
2. Verify all environment variables are set correctly
3. Ensure all dependencies are installed
4. Check network connectivity to OpenAI API

## License

This integration is part of the EchoMed project and follows the same licensing terms.
