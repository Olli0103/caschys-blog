#!/bin/bash

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "Git is not installed. Please install git first."
    exit 1
fi

# Check if the repository is already initialized
if [ ! -d .git ]; then
    echo "Initializing git repository..."
    git init
fi

# Ask for GitHub username
read -p "Enter your GitHub username: " github_username

# Ask for repository name
read -p "Enter the repository name (default: raycast-caschys-blog): " repo_name
repo_name=${repo_name:-raycast-caschys-blog}

# Check if remote origin already exists
if git remote | grep -q "^origin$"; then
    echo "Remote 'origin' already exists. Updating it..."
    git remote set-url origin "https://github.com/$github_username/$repo_name.git"
else
    echo "Adding remote 'origin'..."
    git remote add origin "https://github.com/$github_username/$repo_name.git"
fi

# Add all files to git
echo "Adding files to git..."
git add .

# Commit changes
echo "Committing changes..."
read -p "Enter commit message (default: 'Initial commit of Caschys Blog extension'): " commit_message
commit_message=${commit_message:-"Initial commit of Caschys Blog extension"}
git commit -m "$commit_message"

# Push to GitHub
echo "Pushing to GitHub..."
echo "Note: You will be prompted for your GitHub credentials."
git push -u origin main || git push -u origin master

echo ""
echo "Repository pushed to GitHub: https://github.com/$github_username/$repo_name"
echo ""
echo "Next steps:"
echo "1. Go to your repository on GitHub"
echo "2. Click on 'Releases' on the right side"
echo "3. Click 'Create a new release'"
echo "4. Tag version: v1.1.0"
echo "5. Release title: Version 1.1.0"
echo "6. Description: Copy the content from your CHANGELOG.md for version 1.1.0"
echo ""
echo "To distribute your extension, share the GitHub repository URL with users."
echo "They can clone it and install it locally using Raycast's 'Import Extension' command." 