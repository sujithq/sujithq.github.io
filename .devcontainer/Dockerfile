# Hugo Development Container
FROM mcr.microsoft.com/devcontainers/base:ubuntu-24.04

# Pinned versions (update intentionally)
ARG HUGO_VERSION=0.161.1
ARG NODE_VERSION=24.15.0
ARG NPM_VERSION=11.14.1

# Install pinned Hugo (extended)
RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates curl git xz-utils \
    && curl -fL "https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_extended_${HUGO_VERSION}_linux-amd64.deb" -o /tmp/hugo.deb \
    && apt-get install -y /tmp/hugo.deb \
    && rm -f /tmp/hugo.deb \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install pinned Node.js and npm
RUN curl -fL "https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-x64.tar.xz" -o /tmp/node.tar.xz \
    && tar -xJf /tmp/node.tar.xz -C /usr/local --strip-components=1 \
    && rm -f /tmp/node.tar.xz \
    && npm install -g npm@${NPM_VERSION}

# Set the default user
USER vscode