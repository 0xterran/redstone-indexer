# Use official PostgreSQL image as base
FROM postgres:16.2

# Environment variables
ENV POSTGRES_USER your_username
ENV POSTGRES_PASSWORD your_password
ENV POSTGRES_DB your_database_name

# Expose PostgreSQL port
EXPOSE 5432
