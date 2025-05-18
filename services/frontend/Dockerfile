# Use an official Nginx image as a base
FROM nginx:latest

# Remove the default Nginx configuration and HTML files
RUN rm /etc/nginx/conf.d/default.conf /usr/share/nginx/html/*

# Copy all frontend files into the Nginx webroot directory
COPY . /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Command to run Nginx (default in Nginx image)
CMD ["nginx", "-g", "daemon off;"]