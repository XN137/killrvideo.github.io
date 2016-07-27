const resolve = require('resolve');
const path = require('path');
const pluginUtils = require('./plugins/utils');

const Funnel = require('broccoli-funnel');
const Sass = require('broccoli-sass');
const MergeTrees = require('broccoli-merge-trees');
const BrowserSync = require('broccoli-browser-sync');

const Context = require('./plugins/context');
const CollectionsPlugin = require('./plugins/collections');
const NunjucksRender = require('./plugins/nunjucks-render');

const Paths = {
  IMAGES: 'src/images',
  BULMA: path.dirname(resolve.sync('bulma')),
  FONT_AWESOME: path.dirname(resolve.sync('font-awesome/package.json')),
  HIGHLIGHT_JS: path.dirname(resolve.sync('highlight.js')),
  SASS: 'src/sass',
  SITE: 'src/site',
  LAYOUTS: 'src/layouts',
};

// Copy images to output as-is
const imageFiles = new Funnel(Paths.IMAGES, {
  destDir: 'images'
});

// Compile SASS to CSS
const cssFiles = new Sass([ 
  Paths.SASS, 
  Paths.BULMA, 
  path.join(Paths.FONT_AWESOME, 'css'),
  path.join(Paths.HIGHLIGHT_JS, '../styles'),
], 'bundle.scss', 'css/bundle.css');

// Copy fonts
const fontFiles = new Funnel(path.join(Paths.FONT_AWESOME, 'fonts'), {
  destDir: 'fonts'
});

// All files under the src/site folder
const siteFiles = new Funnel(Paths.SITE);

// Pages are all markdown and nunjucks files under the site node
const pageFiles = new Funnel(siteFiles, { include: [ '**/*.md', '**/*.nj' ] });

// Generate context for each page file to be used when rendering
const contextFiles = new Context(pageFiles, siteFiles);

// Use context to generate collections and create (possibly) new context for the pages that need it
const contextWithCollections = new CollectionsPlugin(siteFiles, contextFiles);

// Render all page files using context to produce pages
const pages = new NunjucksRender(pageFiles, Paths.LAYOUTS, contextWithCollections, {
  defaultLayout: 'base.nj',
  layouts: [
    { pattern: 'docs/**/*.md', layout: 'docs.nj' }
  ]
});

let output = [ imageFiles, cssFiles, fontFiles, pages ];

// Watch for changes if running serve
if (process.argv.indexOf('serve') > 0) {
  output.push(new BrowserSync(output.slice(0)));
}

// Merge output
module.exports = new MergeTrees(output); 
