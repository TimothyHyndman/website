#!/bin/sh

set -e

hugo

cd public

git add .

msg="rebuilding site $(date)"

git commit -m "$msg"

git push origin master

