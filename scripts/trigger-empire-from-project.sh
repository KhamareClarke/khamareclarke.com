#!/usr/bin/env bash
# Trigger Empire from an external project (MyApproved, Flip Republic, etc.).
# Usage: ./scripts/trigger-empire-from-project.sh <projectId> [teamId] [runPending]
# Example: ./scripts/trigger-empire-from-project.sh myapproved SALES_TEAM 1
# Requires: EMPIRE_WEBHOOK_URL (e.g. https://khamareclarke.com/api/empire/webhook/trigger)
#           EMPIRE_WEBHOOK_SECRET (same as on Empire dashboard .env)

set -e
PROJECT_ID="${1:-myapproved}"
TEAM_ID="${2:-SALES_TEAM}"
RUN_PENDING="${3:-0}"
URL="${EMPIRE_WEBHOOK_URL:-https://khamareclarke.com/api/empire/webhook/trigger}"
SECRET="${EMPIRE_WEBHOOK_SECRET:-}"

if [ -z "$SECRET" ]; then
  echo "Set EMPIRE_WEBHOOK_SECRET (and optionally EMPIRE_WEBHOOK_URL)" >&2
  exit 1
fi

BODY=$(cat <<EOF
{"projectId":"$PROJECT_ID","teamId":"$TEAM_ID","runPending":$([ "$RUN_PENDING" = "1" ] && echo "true" || echo "false")}
EOF
)

curl -s -X POST "$URL" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $SECRET" \
  -d "$BODY" | jq . 2>/dev/null || cat
