
echo +------------------------------+
echo \|Building and deploying project\|
echo +------------------------------+
echo
echo Updating project..

echo - npm
npm install --silent
echo - bower
bower up --silent

echo
echo Building project..
polymer build

echo
echo Copying to buildpath..
cp -fr build/default/* ../the-accountant.github.io
cd ../the-accountant.github.io

echo
echo Pushing to deploy repository..
git commit -am "Automated build&deploy"
git push

echo
echo Removing build..
cd -
rm -fr build

echo
echo Done.
echo View the newly deployed source at:
echo  open https://the-accountant.github.io/
