#!/usr/bin/env python3
"""
Database setup script for MedChain
This script helps initialize and manage the database
"""

import os
import sys
import subprocess
import time
from pathlib import Path

def run_command(command, description):
    """Run a command and handle errors"""
    print(f"🔄 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} completed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed: {e}")
        print(f"Error output: {e.stderr}")
        return False

def check_docker():
    """Check if Docker is installed and running"""
    print("🔍 Checking Docker installation...")
    if not run_command("docker --version", "Docker version check"):
        print("❌ Docker is not installed or not running")
        print("Please install Docker Desktop and start it")
        return False
    
    if not run_command("docker ps", "Docker daemon check"):
        print("❌ Docker daemon is not running")
        print("Please start Docker Desktop")
        return False
    
    return True

def start_databases():
    """Start the database services using Docker Compose"""
    print("🚀 Starting database services...")
    
    # Change to the database directory
    db_dir = Path(__file__).parent
    os.chdir(db_dir)
    
    # Start the databases
    if not run_command("docker-compose up -d", "Starting database containers"):
        return False
    
    # Wait for databases to be ready
    print("⏳ Waiting for databases to be ready...")
    time.sleep(10)
    
    # Check if databases are running
    if not run_command("docker-compose ps", "Checking database status"):
        return False
    
    return True

def stop_databases():
    """Stop the database services"""
    print("🛑 Stopping database services...")
    
    db_dir = Path(__file__).parent
    os.chdir(db_dir)
    
    return run_command("docker-compose down", "Stopping database containers")

def reset_databases():
    """Reset the databases (WARNING: This will delete all data)"""
    print("⚠️  WARNING: This will delete all database data!")
    response = input("Are you sure you want to continue? (y/N): ")
    
    if response.lower() != 'y':
        print("❌ Database reset cancelled")
        return False
    
    print("🗑️  Resetting databases...")
    
    db_dir = Path(__file__).parent
    os.chdir(db_dir)
    
    # Stop and remove containers with volumes
    if not run_command("docker-compose down -v", "Removing database containers and volumes"):
        return False
    
    # Start fresh
    return start_databases()

def show_status():
    """Show the status of database services"""
    print("📊 Database Status:")
    
    db_dir = Path(__file__).parent
    os.chdir(db_dir)
    
    run_command("docker-compose ps", "Database container status")
    
    # Show connection info
    print("\n🔗 Connection Information:")
    print("PostgreSQL: localhost:5432")
    print("  - Database: medchain")
    print("  - Username: medchain_user")
    print("  - Password: medchain_password")
    
    print("\nMongoDB: localhost:27017")
    print("  - Database: medchain")
    print("  - Username: medchain_admin")
    print("  - Password: medchain_password")
    
    print("\nRedis: localhost:6379")
    print("  - Password: medchain_redis_password")
    
    print("\n📱 Management Interfaces:")
    print("pgAdmin: http://localhost:5050")
    print("  - Email: admin@medchain.com")
    print("  - Password: admin_password")
    
    print("Mongo Express: http://localhost:8081")
    print("  - Username: admin")
    print("  - Password: admin_password")

def create_env_file():
    """Create environment file with database configuration"""
    env_content = """# Database Configuration
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=medchain
POSTGRES_USER=medchain_user
POSTGRES_PASSWORD=medchain_password

MONGO_URI=mongodb://medchain_admin:medchain_password@localhost:27017/

REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=medchain_redis_password

# Existing configuration
OPENAI_API_KEY=your_openai_api_key_here
ELEVENLABS_API_KEY=dummy
SESSION_SECRET=spider1-flask-secret-key
YOUTUBE_API_KEY=AIzaSyCKZvQBqIJPzQbT9jo4w2Huzp5V7z715QU
"""
    
    env_file = Path(__file__).parent.parent / ".env"
    
    if env_file.exists():
        print(f"⚠️  .env file already exists at {env_file}")
        response = input("Do you want to overwrite it? (y/N): ")
        if response.lower() != 'y':
            print("❌ Environment file creation cancelled")
            return False
    
    try:
        with open(env_file, 'w') as f:
            f.write(env_content)
        print(f"✅ Environment file created at {env_file}")
        return True
    except Exception as e:
        print(f"❌ Failed to create environment file: {e}")
        return False

def main():
    """Main function"""
    if len(sys.argv) < 2:
        print("""
🔧 MedChain Database Setup

Usage:
  python setup.py <command>

Commands:
  start     - Start database services
  stop      - Stop database services
  reset     - Reset databases (WARNING: deletes all data)
  status    - Show database status
  env       - Create environment file
  install   - Full installation (start + env)
""")
        return
    
    command = sys.argv[1].lower()
    
    if command == "start":
        if not check_docker():
            return
        start_databases()
    
    elif command == "stop":
        stop_databases()
    
    elif command == "reset":
        if not check_docker():
            return
        reset_databases()
    
    elif command == "status":
        show_status()
    
    elif command == "env":
        create_env_file()
    
    elif command == "install":
        if not check_docker():
            return
        if not start_databases():
            return
        create_env_file()
        print("\n🎉 MedChain database setup completed!")
        print("You can now start your application.")
    
    else:
        print(f"❌ Unknown command: {command}")
        print("Run 'python setup.py' for help")

if __name__ == "__main__":
    main()
