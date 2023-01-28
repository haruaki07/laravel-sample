FROM docker.io/amazonlinux:2

ARG USER=nobody

ENV APP_NAME=lkskabweb
ENV APP_ENV=production
ENV APP_DEBUG=false
ENV APP_KEY

# install php and httpd
RUN yum update -y \
  && amazon-linux-extras install php8.1 -y \
  && yum install -y \
    php-curl \
    php-openssl \
    php-mbstring \
    php-bcmath \
    php-xml \
    httpd

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
  && chmod -R 2775 /var/www/app/storage /var/www/app/bootstrap/cache \
  && php artisan optimize --no-interaction --ansi \
  && php artisan migrate --force --no-interaction --ansi

COPY --chown=root:root ./docker/supervisord.conf /etc/supervisord.conf

EXPOSE 80

# run supervisor
CMD ["/usr/bin/supervisord", "-n", "-c", "/etc/supervisord.conf"]