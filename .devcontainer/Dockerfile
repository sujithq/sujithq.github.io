# Hugo Development Container
FROM mcr.microsoft.com/devcontainers/base:ubuntu-24.04@sha256:d94c97dd9cacf183d0a6fd12a8e87b526e9e928307674ae9c94139139c0c6eae

# Pinned versions (update intentionally)
ARG HUGO_VERSION=0.166.0
ARG NODE_VERSION=24.21.0
ARG NPM_VERSION=11.19.0

# Install pinned Hugo (extended)
RUN apt-get update \
    && apt-get upgrade -y --no-install-recommends \
    && apt-get install -y --no-install-recommends ca-certificates curl git xz-utils \
    && cd /tmp \
    && curl -fL "https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_extended_${HUGO_VERSION}_linux-amd64.deb" -o "hugo_extended_${HUGO_VERSION}_linux-amd64.deb" \
    && curl -fL "https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_${HUGO_VERSION}_checksums.txt" -o hugo-checksums.txt \
    && grep " hugo_extended_${HUGO_VERSION}_linux-amd64.deb$" hugo-checksums.txt | sha256sum --check --strict - \
    && apt-get install -y "/tmp/hugo_extended_${HUGO_VERSION}_linux-amd64.deb" \
    && rm -f "/tmp/hugo_extended_${HUGO_VERSION}_linux-amd64.deb" /tmp/hugo-checksums.txt \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install pinned Node.js and npm
RUN cd /tmp \
    && curl -fL "https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-x64.tar.xz" -o "node-v${NODE_VERSION}-linux-x64.tar.xz" \
    && curl -fL "https://nodejs.org/dist/v${NODE_VERSION}/SHASUMS256.txt" -o node-checksums.txt \
    && grep " node-v${NODE_VERSION}-linux-x64.tar.xz$" node-checksums.txt | sha256sum --check --strict - \
    && tar -xJf "node-v${NODE_VERSION}-linux-x64.tar.xz" -C /usr/local --strip-components=1 \
    && rm -f "node-v${NODE_VERSION}-linux-x64.tar.xz" node-checksums.txt \
    && npm install -g npm@${NPM_VERSION} --ignore-scripts --registry=https://packagefeedproxy.microsoft.io/npm/ \
    && npm install --prefix /tmp/npm-security --omit=dev --ignore-scripts --no-save --package-lock=false --registry=https://packagefeedproxy.microsoft.io/npm/ brace-expansion@5.0.9 tar@7.5.21 ip-address@10.3.1 undici@6.28.0 \
    && cp -a /tmp/npm-security/node_modules/. /usr/local/lib/node_modules/npm/node_modules/ \
    && rm -rf /tmp/npm-security \
    && npm --version

# Set the default user
USER vscode