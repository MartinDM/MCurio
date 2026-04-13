#!/usr/bin/env bash
set -euo pipefail

# Load local environment variables
if [[ -f ".env.local" ]]; then
  source .env.local
fi

ENV_VARS="$(supabase status -o env)"
API_URL="$(echo "$ENV_VARS" | awk -F= '/^API_URL=/{print $2}' | tr -d '"')"
SECRET_KEY="$(echo "$ENV_VARS" | awk -F= '/^SECRET_KEY=/{print $2}' | tr -d '"')"

if [[ -z "${API_URL}" || -z "${SECRET_KEY}" ]]; then
  echo "Could not resolve API_URL/SECRET_KEY from supabase status"
  exit 1
fi

PRIMARY_MUSEUM_ID="11111111-1111-4111-8111-111111111111"

ensure_user() {
  local email="$1"
  local password="$2"

  local users_json
  users_json="$(curl -sS "${API_URL}/auth/v1/admin/users?per_page=1000&page=1" \
    -H "apikey: ${SECRET_KEY}" \
    -H "Authorization: Bearer ${SECRET_KEY}")"

  local user_id
  user_id="$(python3 - <<'PY' "$users_json" "$email"
import json
import sys

payload = json.loads(sys.argv[1] or "{}")
target_email = sys.argv[2].lower()

for user in payload.get("users", []):
    if (user.get("email") or "").lower() == target_email:
        print(user.get("id", ""))
        break
PY
)"

  if [[ -z "$user_id" ]]; then
    local create_json
    create_json="$(curl -sS -X POST "${API_URL}/auth/v1/admin/users" \
      -H "apikey: ${SECRET_KEY}" \
      -H "Authorization: Bearer ${SECRET_KEY}" \
      -H 'Content-Type: application/json' \
      -d "{\"email\":\"${email}\",\"password\":\"${password}\",\"email_confirm\":true}")"

    user_id="$(python3 - <<'PY' "$create_json"
import json
import sys

payload = json.loads(sys.argv[1] or "{}")
print(payload.get("id", ""))
PY
)"
  fi

  if [[ -z "$user_id" ]]; then
    echo "Failed to create or resolve user id for ${email}"
    exit 1
  fi

  curl -sS -X POST "${API_URL}/rest/v1/profiles?on_conflict=id" \
    -H "apikey: ${SECRET_KEY}" \
    -H "Authorization: Bearer ${SECRET_KEY}" \
    -H 'Content-Type: application/json' \
    -H 'Prefer: resolution=merge-duplicates,return=minimal' \
    -d "[{\"id\":\"${user_id}\",\"museum_id\":\"${PRIMARY_MUSEUM_ID}\"}]" > /dev/null

  echo "Ensured auth user: ${email}"
}

# Ensure environment variable is set
if [[ -z "${MARTIN_AUTH_PASSWORD:-}" ]]; then
  echo "Error: MARTIN_AUTH_PASSWORD environment variable is required"
  echo "Set it in .env.local or as an environment variable"
  exit 1
fi

ensure_user "martinonotts@gmail.com" "${MARTIN_AUTH_PASSWORD}"

echo "Auth user seeding complete."
