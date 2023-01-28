#!/bin/sh

cd /var/www/app

php artisan optimize:clear --no-interaction --ansi
php artisan optimize --no-interaction --ansi

/usr/bin/supervisord -n -c /etc/supervisord.conf