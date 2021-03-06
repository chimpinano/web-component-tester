// Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
// This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
// The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
// The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
// Code distributed by Google as part of the polymer project is also
// subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
(function() {

/**
 * A Mocha suite (or suites) run within a child iframe, but reported as if they
 * are part of the current context.
 */
function SubSuite(name, parentScope) {
  this.name        = name;
  this.parentScope = parentScope;
}
WCT.SubSuite = SubSuite;

/**
 * Loads a HTML document containing Mocha suites that should be injected into
 * the current Mocha environment.
 *
 * @param {string} url The URL of the document to load.
 * @param {function} done Node-style callback.
 * @return {!SubSuite}
 */
SubSuite.load = function load(url, done) {
  var subSuite = new this(url, window);
  subSuite.onload = function(error) {
    subSuite.onload = null;
    done(error, subSuite);
  };

  var iframe = document.createElement('iframe');
  iframe.src = url;
  iframe.subSuite = subSuite;
  iframe.classList.add('subsuite');
  iframe.onerror = done.bind(null, 'Failed to load document ' + iframe.src);
  document.body.appendChild(iframe);

  subSuite.iframe = iframe;
  return subSuite;
};

/**
 * @return {SubSuite} The `SubSuite` that was registered for this window.
 */
SubSuite.current = function() {
  return window.frameElement && window.frameElement.subSuite || null;
}

// Complete the load process, if we are within a sub suite.
var thisSubSuite = SubSuite.current();
if (thisSubSuite) {
  thisSubSuite.onload();
}

})();
