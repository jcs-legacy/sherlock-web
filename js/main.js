"use strict";

var textarea = document.getElementById('text-area');
var btn_search = document.getElementById('btn-search');
var tb_search = document.getElementById('tb-search');
var sherlock_data = { };

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

function init() {
  request("GET", "http://localhost:8000/data/", function (xhr) {
    sherlock_data = JSON.parse(xhr.response);
  });
}
init();

function search() {
  erase();
  let args = tb_search.value;
  request("POST", "http://localhost:8000/cli/", function (xhr) {
    let result = JSON.parse(xhr.response);
    append(result['output']);
  }, JSON.stringify({ args: args }));
}

tb_search.onkeyup = function(event) {
  if (event.keyCode === 13) { search(); }
};
btn_search.onclick = search;
