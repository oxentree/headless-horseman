FROM node:14.9.0

ARG ENV

WORKDIR /usr/node

COPY --chown=node:node package*.json ./

RUN if [ "$ENV" = "dev" ] ; then npm install ; else npm install --only=production ; fi

COPY --chown=node:node . .

# chrome stuff
USER root

RUN apt-get update \
    && apt-get install -y wget gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/* \
    # trying to avoid --no-sandbox in Chrome
    && chmod 4755 node_modules/puppeteer/.local-chromium/linux-782078/chrome-linux/chrome_sandbox \
    && cp -p node_modules/puppeteer/.local-chromium/linux-782078/chrome-linux/chrome_sandbox /usr/local/sbin/chrome-devel-sandbox \
    && chown node:node /usr/local/sbin/chrome-devel-sandbox \
    && export CHROME_DEVEL_SANDBOX=/usr/local/sbin/chrome-devel-sandbox \
    && echo 'kernel.unprivileged_userns_clone=1' > /etc/sysctl.d/userns.conf

EXPOSE 8080

USER node

CMD ["node"]