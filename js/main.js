"use strict";

var textarea = document.getElementById('text-area');

function append(str) {
  textarea.innerHTML += str;
  // Add upp `rows` for every newline
  let count = (str.match(/\r/g) || []).length || (str.match(/\n/g) || []).length;
  textarea.rows += count;
}

function erase() { textarea.innerHTML = ''; }

(function ($) {
  $.ajax({
    url: '127.0.0.1:8000/data',
    type: 'GET',
    contentType: "application/json",
    success : function (data) {
      
    },
    error : function () {

    },
  });
}(this.jQuery));
