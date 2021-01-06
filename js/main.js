"use strict";

var textarea = document.getElementById('text-area');
var tb_search = document.getElementById('tb-search');
var btn_search = document.getElementById('btn-search');
var info_version = document.getElementById('info-version');
var sherlock_data = { };
var version_info = "";

const query_count = 50;   // How many query per request.
const query_counter = 0;  // Current process to Sherlock

/* Utility */

function append(str) {
  textarea.innerHTML += str;
  // Add upp `rows` for every newline
  let count = (str.match(/\r/g) || []).length || (str.match(/\n/g) || []).length;
  textarea.rows += count;
}

function erase() { textarea.innerHTML = ''; textarea.rows = 0; }

function request(type, url, callback, body) {
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState != 4 || this.status != 200)
      return;
    callback(this);
  };
  xhttp.open(type, url, true);
  xhttp.send(body);
}

/**
 * Enable/Disable search area elements.
 * @param {boolean} enable - True to enable, False to disable.
 */
function enableSearch (enable) {
  tb_search.disabled = !enable;
  btn_search.disabled = !enable;
}

/* Preparation */

function init() {
  request("GET", "http://localhost:8000/data/", function (xhr) {
    sherlock_data = JSON.parse(xhr.response);
  });
  request("POST", "http://localhost:8000/cli/", function (xhr) {
    let result = JSON.parse(xhr.response);
    version_info = result['output'];
    if (SHOW_VERSION)
      info_version.innerHTML = version_info;
  }, JSON.stringify({ args: "--version" }));
}
init();

/* Core */

function search() {
  enableSearch(false);
  erase();
  let args = tb_search.value;
  request("POST", "http://localhost:8000/cli/", function (xhr) {
    enableSearch(true);
    let result = JSON.parse(xhr.response);
    append(result['output']);
  }, JSON.stringify({ args: args }));
}

/* Register */

tb_search.onkeyup = function(event) {
  if (event.keyCode === 13) { search(); }
};
btn_search.onclick = search;
