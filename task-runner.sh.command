#!/bin/bash
###################
# Task Runner     #
# CLABE Validator #
###################

# To make this file runnable:
#     $ chmod +x *.sh.command

banner="CLABE Validator"
projectHome=$(cd $(dirname $0); pwd)

setupTools() {
   # Check for Node.js installation and download project dependencies
   cd $projectHome
   echo
   echo $banner
   echo $(echo $banner | sed s/./=/g)
   pwd
   echo
   echo "Node.js:"
   which node || { echo "Need to install Node.js: https://nodejs.org"; exit; }
   node --version
   npm install
   npm update --no-save
   npm outdated
   echo
   }

releaseInstructions() {
   cd $projectHome
   repository=$(grep repository package.json | awk -F'"' '{print $4}' | sed s/github://)
   package=https://raw.githubusercontent.com/$repository/master/package.json
   version=v$(grep '"version"' package.json | awk -F'"' '{print $4}')
   pushed=v$(curl --silent $package | grep '"version":' | awk -F'"' '{print $4}')
   released=$(git tag | tail -1)
   minorVersion=$(echo ${pushed:1} | awk -F"." '{ print $1 "." $2 }')
   echo "Local changes:"
   git status --short
   echo
   echo "Recent releases:"
   git tag | tail -5
   echo
   echo "Release progress:"
   echo "   $version (local) --> $pushed (pushed) --> $released (released)"
   echo
   echo "Next release action:"
   nextActionUpdate() {
      echo "   === Increment version ==="
      echo "   Edit pacakge.json to bump $version to next version number"
      echo "   $projectHome/package.json"
      }
   nextActionCommit() {
      echo "   === Commit and push ==="
      echo "   Check in changed source files for $version with the message:"
      echo "   Next release"
      }
   nextActionTag() {
      echo "   === Release checkin ==="
      echo "   Check in remaining changed files with the message:"
      echo "   Release $version"
      echo "   === Tag and publish ==="
      echo "   cd $projectHome"
      echo "   git tag --annotate --message 'Release' $version"
      echo "   git remote --verbose"
      echo "   git push origin --tags"
      echo "   npm publish"
      }
   checkStatus() {
      test "$version" ">" "$pushed" && nextActionCommit || nextActionUpdate
      }
   test "$pushed" ">" "$released" && nextActionTag || checkStatus
   echo
   }

buildProject() {
   cd $projectHome
   echo "Build:"
   npm test
   echo
   }

updateCdnVersion() {
   cd $projectHome
   updateVersion="s|clabe-validator@[.0-9]*|clabe-validator@$minorVersion|"
   sed -i "" $updateVersion README.md
   sed -i "" $updateVersion docs/index.html
   }

publishWebFiles() {
   cd $projectHome
   publishWebRoot=$(grep ^DocumentRoot /private/etc/apache2/httpd.conf | awk -F'"' '{ print $2 }')
   publishSite=$publishWebRoot/centerkey.com
   publishFolder=$publishSite/clabe
   cdnSrc=https://cdn.jsdelivr.net/npm/clabe-validator@$minorVersion/clabe.min.js
   publish() {
      echo "Publishing:"
      echo $publishFolder
      mkdir -p $publishFolder
      sed "s|clabe.js|$cdnSrc|" clabe.html > $publishFolder/index.html
      ls -o $publishFolder
      grep clabe.min.js $publishFolder/index.html
      echo
      }
   test -w $publishSite && publish
   }

setupTools
releaseInstructions
buildProject
updateCdnVersion
publishWebFiles
sleep 2
open clabe.html
