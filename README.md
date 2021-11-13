# Website

## Setup instructions
Install hugo. This is what is used to build the webpage.

Clone the github.io repository to a directory named public. Hugo builds the website to this
directory, and then we host it on the github.io repo.
```
git clone git@github.com:TimothyHyndman/timothyhyndman.github.io.git public
```

We need to clone the git submodule that contains our "AllinOne" theme
```
git submodule update --init --recursive
```

You can now preview the website locally with
```
hugo serve
```
and deploy with
```
source deploy.sh
```