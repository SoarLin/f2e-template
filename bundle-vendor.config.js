module.exports = {
    bundle: {
        vendor: {
            scripts: [
                './public/bower/jquery/dist/jquery.min.js',
                './public/bower/bootstrap/dist/js/bootstrap.min.js',
                './public/bower/loadcss/src/loadCSS.js'
            ],
            options: {
                rev: false
            }
        }
    }
};