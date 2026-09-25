#!/bin/zsh
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"
cd "${0:A:h}"
if curl --silent --fail http://127.0.0.1:4317/api/health >/dev/null 2>&1; then
  open http://127.0.0.1:4317/
  exit 0
fi
if ! command -v node >/dev/null; then
  print 'WalletFlow needs Node.js 24 or newer. Install it from https://nodejs.org, then open this file again.'
  read -k 1
  exit 1
fi
print 'Starting WalletFlow. Keep this window open while collecting activity.'
node server/index.mjs &
walletflow_server_pid=$!
trap 'kill "$walletflow_server_pid" 2>/dev/null' EXIT INT TERM
for attempt in {1..30}; do
  if curl --silent --fail http://127.0.0.1:4317/api/health >/dev/null 2>&1; then
    open http://127.0.0.1:4317/
    break
  fi
  sleep 1
done
wait "$walletflow_server_pid"
