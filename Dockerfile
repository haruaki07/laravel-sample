FROM node:16-alpine AS builder

ENV NODE_ENV=production

WORKDIR /usr/app

COPY package*.json \
  postcss.config.js \
  tailwind.config.js \
  vite.config.js \
  .

COPY resources ./resources

RUN npm ci --include=dev

RUN npm run build

FROM docker.io/amazonlinux:2

ARG USER=nobody

ENV APP_DEBUG=false
ENV APP_ENV=production

# install deps
RUN yum update -y \
  && amazon-linux-extras install php8.1 -y \
  && yum install -y \
    php-curl \
    php-openssl \
    php-mbstring \
    php-bcmath \
    php-xml \
    php-gd \
    httpd \
    unzip \
    python2-pip \
  && pip install supervisor --progress-bar off

# setup app dir
RUN usermod -aG apache $USER \
  && mkdir -p /var/www/app \
  && chown -R $USER:apache /var/www/app \
  && chmod -R 2775 /var/www/app \
  && find /var/www/app -type d -exec chmod 2775 {} \; \
  && find /var/www/app -type f -exec chmod 0664 {} \;

# install composer
RUN curl -fsSL https://getcomposer.org/installer \
  | php -- --install-dir=/usr/local/bin --filename=composer

COPY ./docker/httpd/0_app.conf /etc/httpd/conf.d/0_app.conf
RUN rm -f /etc/httpd/conf.d/welcome.conf

WORKDIR /var/www/app

COPY --chown=$USER:apache . .

USER $USER:apache

RUN composer install --no-interaction --ansi \
  && chown -R $USER:apache /var/www/app \
  && chmod -R 2775 /var/www/app/storage /var/www/app/bootstrap/cache

COPY --from=builder /usr/app/public/build ./public/build

USER root:root

COPY ./docker/supervisord.conf /etc/supervisord.conf
COPY ./docker/run.sh .

RUN chmod +x ./run.sh

EXPOSE 80

# run supervisor
CMD ["./run.sh"]
