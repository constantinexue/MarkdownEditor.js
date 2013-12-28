$(function(){
    var s = document.getElementById('target');
    var html = '<html><head><script src="http://cdn.bootcss.com/jquery/2.0.3/jquery.js"></script></head><body>111112222</body></html>';
    s.contentDocument.write(html);
    s.contentDocument.close();
});