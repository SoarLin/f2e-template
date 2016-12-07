$(document).ready(function(){
    'use strict';
    /* lazy loading css */
    loadCSS('/bower/font-awesome/css/font-awesome.min.css');
    loadCSS('/bower/Ionicons/css/ionicons.min.css');

    console.log('I am ready');
    $('#title').text('JS黨已經載入');
});

