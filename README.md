# Contact App • 0.0.1

## Introduction

The aim of this project is to create the simplest, most flexible contact forms possible for developers and designers to be able to drop into their site.

## Installation

 1. Install [node.js](https://nodejs.org/). You can get this from the official site, **or** via [homebrew](http://brew.sh/) using nvm - node version manager (recommended).
 2. Clone this project to your local machine with `git@github.com:leafagency/leaf-project-template.git`
 3. Rename the cloned folder to create your new site
 4. In your terminal `cd` into the project template
 5. Type `npm install`
 
## Working with the project

The following commands all need to be run from the root directory of your project, use `cd` to get there in your terminal of choice.
 
### Starting the project server

Once started, a browser window will open to the homepage of your site. Any changes to the `./code/` directory while the server is running will be automatically detected and trigger a rebuild of the sass/jade/js and cause the browser to refresh.

```
npm run start
```

### Running the tests (not yet implemented)

```
npm run test
```

### Forcing a rebuild of the code

```
npm run build
```

### Publishing the project to github pages

This assumes the project has a github origin. For more information on how these are deployed, see the [Github Pages](https://pages.github.com/) docs:

```
npm run deploy
```

## Under the hood

This project makes use of the following technologies:

 - [Jade](http://jade-lang.com/) - For markup
 - [Sass](http://sass-lang.com/) - For styles
 - [Browserify](http://browserify.org/) - For bundling JavaScript
 - [npm](https://www.npmjs.com/) - For managing dependencies & running scripts
 - [Gulp](http://gulpjs.com/) - For automating the development workflow

### Automated building

Source code written in the `./code/` directory is converted and moved over to `./dist/` as part this template's build process. The following conversions are automated:

 - **Automatic compilation of Jade:** Any `.jade` files in `./code/` and its subdirectories will be converted.
 - **Automatic compilation of Sass:** Any `.scss` files in `./code/` and its subdirectories will be converted.
 - **Automatic compilation of JavaScript:** Any `.js` files in `./code/scripts/app/` and its subdirectories will be browserified into a single bundle at `./dist/code/scripts/app/main.js`. Any `.js` files in `./code/scripts/lib` and its subdirectories will be minified but maintain their current directory structure.
 - **Automatic optimisation of images:** Any `.png`,`.jpg`,`.gif` or `.jpeg`files in `./code/` and its subdirectories will be optimised.

### Other features:

 - Automatic page refreshing.
 - Ability to build out either a regular HTML/CSS/JS site, or a single page app from the same template.
 - 1 command to deploy project to github pages
 - WIP: 1 command to generate screenshots of all pages.
 - WIP: 1 command to run automated tests for pages in supported browsers.
 - WIP: 1 command google page speed insights
