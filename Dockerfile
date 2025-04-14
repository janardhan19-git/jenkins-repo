# Use a base image
FROM ubuntu:20.04

# Install dependencies
RUN apt-get update && apt-get install -y nginx

# Copy the application files from your cloned repository to the nginx serving directory
COPY . /var/www/html/

# Ensure proper permissions
RUN chown -R www-data:www-data /var/www/html/

# Expose port
EXPOSE 80

# Start nginx when container starts
CMD ["nginx", "-g", "daemon off;"]
