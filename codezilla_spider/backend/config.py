from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field
import os


class Settings(BaseSettings):
    # OpenAI Configuration
    openai_api_key: str = Field(default_factory=lambda: os.getenv("OPENAI_API_KEY", ""))
    
    # AWS Configuration (optional for basic functionality)
    aws_access_key_id: str = "dummy"
    aws_secret_access_key: str = "dummy"
    aws_region_name: str = "us-east-1"
    elevenlabs_api_key: str = Field(default_factory=lambda: os.getenv("ELEVENLABS_API_KEY", "dummy"))
    bedrock_model_id: str = "anthropic.claude-3-opus-20240229-v1:0"
    bedrock_synthesis_model_id: str = "anthropic.claude-3-haiku-20240307-v1:0"
    kendra_index_id: str = "dummy"
    neptune_endpoint: str = "dummy"
    s3_bucket_name: str = "dummy"
    dynamodb_speakers_table_name: str = "dummy"
    hugging_face_token: str = "dummy"
    dynamodb_analytics_table_name: str = "dummy"
    dynamodb_alerts_table_name: str = "dummy"
    google_credentials_path: str = "credentials.json"
    google_token_path: str = "token.json"
    dynamodb_tasks_table_name: str = "dummy"

    model_config = SettingsConfigDict(env_file=".env")


settings = Settings() 