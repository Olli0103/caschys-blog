#!/bin/bash

# Fix permissions for node_modules
echo "Fixing permissions for node_modules..."
chmod -R 755 node_modules

# Fix permissions for the entire project
echo "Fixing permissions for the project files..."
find . -type d -exec chmod 755 {} \;
find . -type f -exec chmod 644 {} \;

# Make the script executable
chmod +x fix-permissions.sh

echo "Permissions fixed. Now you can run:"
echo "npm run lint"
echo "npm run build" 