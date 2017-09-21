# Howdy Site • 2.0.0

The Howdy marketing site. Written in Pug and deployed to Github pages. Caching/performance is provided by Cloudflare.

## Installation
 1. Install [node.js](https://nodejs.org/). You can get this from the official site, **or** via [homebrew](http://brew.sh/) using nvm - node version manager (recommended).
 2. Clone this project to your local machine with `git clone git@github.com:weareleaf/leaf-site.git` from your terminal.
 4. In your terminal `cd` into the `leaf-site` project
 5. Type `npm install` to install the node packages required to run the project.

## Working with the project
```
npm run start    // Start the development server with live rebuilding/reloading
npm run test     // Run any JS tests
npm run build    // Force a rebuild of all code
npm run deploy   // Deploy the site to Github pages
```

### Testing against the staging environment
So that you don't need to run the API locally to develop, if you include a `?staging=t` query string parameter in your URL when viewing the site locally, the snippet generator and all associated pages should use the staging API and show URLs to the staging clientside JS.

### Troubleshooting
If for whatever reason things won't work on your machine, it's most likely an issue with your node version or missing dependencies. Check your node version matches the version specified in `.nvmrc` using `node -v` and then reinstall your packages with `rm -rf node_modules && npm cache clear && npm i`.

### Automated building
Source code written in the `./code/` directory is converted and moved over to `./dist/` as part this template's build process. The following conversions are automated:

 - **Automatic compilation of Pug/Jade:** Any `.pug` or `.jade` files in `./code/` and its subdirectories will be converted.
 - **Automatic compilation of Sass:** Any `.scss` files in `./code/` and its subdirectories will be converted.
 - **Automatic compilation of JavaScript:** A JS module starting from `./code/scripts/index.js` will be webpacked and minified into a single bundle.
 - **Automatic optimisation of images:** Any `.jpg` files in `./code/` and its subdirectories will be optimised.