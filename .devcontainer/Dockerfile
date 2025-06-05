FROM mcr.microsoft.com/vscode/devcontainers/typescript-node:20-1-bullseye

# Optional: Install additional OS packages
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        openssh-client \
        gnupg \
        git \
    && rm -rf /var/lib/apt/lists/*

# Set up known_hosts for SSH (optional, für GitHub/GitLab)
RUN mkdir -p /home/vscode/.ssh && \
    ssh-keyscan github.com >> /home/vscode/.ssh/known_hosts && \
    ssh-keyscan gitlab.com >> /home/vscode/.ssh/known_hosts && \
    chown -R vscode:vscode /home/vscode/.ssh

# Set working directory
WORKDIR /workspace

# Install dependencies (wird auch durch postCreateCommand erledigt, hier optional)
# COPY package*.json ./
# RUN npm install

# Default user
USER vscode
