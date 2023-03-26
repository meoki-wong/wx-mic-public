/**
 * @description
 *
 * @author zhouliang03
 * @name
 * @module
 * @param {}
 * @returns {}
 */

(function($) {
// 展开收起
$('body').delegate('.m-expansion a', 'click', function() {
    $(this).parent().toggleClass('open');
});
})(window.Zepto);