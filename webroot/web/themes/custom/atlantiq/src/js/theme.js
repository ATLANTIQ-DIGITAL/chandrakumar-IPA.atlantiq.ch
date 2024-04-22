(function (Drupal, once) {
  Drupal.behaviors.aqTheme = {
    attach: function (context, settings) {
      once('aqTheme', 'body', context).forEach(function (element) {

        // Add code here.

      });
    }
  };
})(Drupal, once);
