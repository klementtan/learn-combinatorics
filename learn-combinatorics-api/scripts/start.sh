#!/bin/bash -e

if [[ -a /tmp/pids/server.pid ]]; then
  rm /tmp/pids/server.pid
fi
echo $RAILS_ENV
if [[ $RAILS_ENV == "production" ]]; then
  echo "in prod"
  EDITOR="mate --wait" bundle exec rails credentials:edit
fi
bundle exec rails s -p 80 -b '0.0.0.0'
