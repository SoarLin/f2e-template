module.exports = {
    bundle: {
        vendor: {
            scripts: [
                './assets/bower/jquery/dist/jquery.min.js',
                './assets/bower/bootstrap/dist/js/bootstrap.min.js',
                './assets/bower/loadcss/src/loadCSS.js'
            ],
            options: {
                rev: false
            }
        }
    }
};