# Hugo Development Container

This development container is configured for working on the Hugo-based blog hosted in this repository. It includes all necessary tools and dependencies to build, test, and serve the site locally.

## Features
- Hugo extended version for building the site.
- Node.js and npm for managing JavaScript dependencies.
- Pre-installed VS Code extensions for Docker, Prettier, and ESLint.
- Port forwarding for Hugo's default server port (1313).

## Usage
1. Open this repository in VS Code.
2. Install the "Remote - Containers" extension if not already installed.
3. Reopen the folder in the container (Command Palette > "Remote-Containers: Reopen in Container").
4. The container will automatically install dependencies and set up the environment.
5. Run `hugo server` to serve the site locally.

## Customization
- Modify the `devcontainer.json` file to add more extensions or change settings.
- Update the `Dockerfile` to include additional tools or dependencies.