module.exports = {
    devServer:{
        open:true,
        port:8082,
        host:'127.0.0.1',
        proxy:{
            '/api':{
                changeOrigin:true,
                
            }
        }
    },
    publicPath:'./',
    outputDir:'dist',
    assetsDir:'static'
}