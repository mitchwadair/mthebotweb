#!/usr/bin/env sh

# abort on errors
set -e

# build (prefer bun, fallback to npm)
if command -v bun >/dev/null 2>&1; then
  bun run build
else
  npm run build
fi

# navigate into the build output directory
cd dist

# GitHub Pages: ensure no Jekyll processing and custom domain
echo > .nojekyll
echo 'bot.mtheb.tv' > CNAME

git init
git add -A
git commit -m 'deploy'

# Determine repo URL (falls back to hardcoded if no origin)
REPO_URL=$(git -C .. config --get remote.origin.url || echo "git@github.com:mitchwadair/mthebotweb.git")

# Force the current HEAD to the gh-pages branch on remote
git push -f "$REPO_URL" HEAD:gh-pages

cd -
