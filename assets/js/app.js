$(document).ready(function(){
    'use strict';
    /* lazy loading css */
    loadCSS('./public/bower/font-awesome/css/font-awesome.min.css');
    loadCSS('./public/bower/Ionicons/css/ionicons.min.css');

    console.log('I am ready');
    $('#title').text('JS黨已經載入');
});

