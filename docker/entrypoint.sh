#!/usr/bin/env bash

if [[ $LOCAL_USER_ID && $LOCAL_USER_ID -ne 0 ]]; then
    LOCAL_GROUP_ID=${LOCAL_GROUP_ID:-$LOCAL_USER_ID}
    export HOME=/home/node
    usermod --uid "$LOCAL_USER_ID" node
    groupmod --gid "$LOCAL_GROUP_ID" node
    chown -R node.node /home/node
    exec gosu node "$@"
fi

exec "@"
