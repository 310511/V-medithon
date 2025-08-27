"""
Database connection module for MedChain
Handles connections to PostgreSQL, MongoDB, and Redis
"""

import os
import asyncio
from typing import Optional
import psycopg2
from psycopg2.extras import RealDictCursor
import pymongo
from pymongo import MongoClient
import redis
from redis import Redis
import logging
from contextlib import contextmanager

logger = logging.getLogger(__name__)

class DatabaseConnection:
    """Database connection manager for MedChain"""
    
    def __init__(self):
        self.postgres_conn = None
        self.mongo_client = None
        self.redis_client = None
        self._initialized = False
    
    def initialize(self):
        """Initialize all database connections"""
        if self._initialized:
            return
        
        try:
            # PostgreSQL connection
            self.postgres_conn = psycopg2.connect(
                host=os.getenv('POSTGRES_HOST', 'localhost'),
                port=os.getenv('POSTGRES_PORT', '5432'),
                database=os.getenv('POSTGRES_DB', 'medchain'),
                user=os.getenv('POSTGRES_USER', 'indian22162'),
                password=os.getenv('POSTGRES_PASSWORD', 'password')
            )
            self.postgres_conn.autocommit = True
            logger.info("PostgreSQL connection established")
            
            # MongoDB connection
            mongo_uri = os.getenv('MONGO_URI', 'mongodb://indian22162:password@localhost:27017/')
            self.mongo_client = MongoClient(mongo_uri)
            self.mongo_db = self.mongo_client.medchain
            logger.info("MongoDB connection established")
            
            # Redis connection
            self.redis_client = Redis(
                host=os.getenv('REDIS_HOST', 'localhost'),
                port=int(os.getenv('REDIS_PORT', '6379')),
                password=os.getenv('REDIS_PASSWORD', 'password'),
                decode_responses=True
            )
            # Test Redis connection
            self.redis_client.ping()
            logger.info("Redis connection established")
            
            self._initialized = True
            
        except Exception as e:
            logger.error(f"Failed to initialize database connections: {e}")
            raise
    
    def get_postgres_connection(self):
        """Get PostgreSQL connection"""
        if not self._initialized:
            self.initialize()
        return self.postgres_conn
    
    def get_mongo_db(self):
        """Get MongoDB database instance"""
        if not self._initialized:
            self.initialize()
        return self.mongo_db
    
    def get_redis_client(self):
        """Get Redis client"""
        if not self._initialized:
            self.initialize()
        return self.redis_client
    
    @contextmanager
    def get_postgres_cursor(self):
        """Context manager for PostgreSQL cursor"""
        conn = self.get_postgres_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        try:
            yield cursor
        except Exception as e:
            conn.rollback()
            raise
        finally:
            cursor.close()
    
    def close(self):
        """Close all database connections"""
        if self.postgres_conn:
            self.postgres_conn.close()
            logger.info("PostgreSQL connection closed")
        
        if self.mongo_client:
            self.mongo_client.close()
            logger.info("MongoDB connection closed")
        
        if self.redis_client:
            self.redis_client.close()
            logger.info("Redis connection closed")
        
        self._initialized = False

# Global database connection instance
_db_connection = DatabaseConnection()

def get_database_connection() -> DatabaseConnection:
    """Get the global database connection instance"""
    return _db_connection

def initialize_database():
    """Initialize the database connections"""
    _db_connection.initialize()

def close_database():
    """Close all database connections"""
    _db_connection.close()

# Health check functions
def check_postgres_health() -> bool:
    """Check PostgreSQL connection health"""
    try:
        with _db_connection.get_postgres_cursor() as cursor:
            cursor.execute("SELECT 1")
            return True
    except Exception as e:
        logger.error(f"PostgreSQL health check failed: {e}")
        return False

def check_mongo_health() -> bool:
    """Check MongoDB connection health"""
    try:
        _db_connection.get_mongo_db().command('ping')
        return True
    except Exception as e:
        logger.error(f"MongoDB health check failed: {e}")
        return False

def check_redis_health() -> bool:
    """Check Redis connection health"""
    try:
        _db_connection.get_redis_client().ping()
        return True
    except Exception as e:
        logger.error(f"Redis health check failed: {e}")
        return False

def check_all_databases_health() -> dict:
    """Check health of all databases"""
    return {
        'postgres': check_postgres_health(),
        'mongodb': check_mongo_health(),
        'redis': check_redis_health()
    }

