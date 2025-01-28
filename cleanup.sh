#!/bin/bash

# Define the file extensions to remove
extensions=("*.js", "*.d.ts")

# Base directory to clean (current directory)
base_dir=$(pwd)

echo "Cleaning up the following file types: ${extensions[@]}"

# Iterate over the extensions and remove files
for ext in "${extensions[@]}"; do
  find "$base_dir" -type f -name "$ext" -exec rm -f {} +
done

echo "Cleanup complete!"