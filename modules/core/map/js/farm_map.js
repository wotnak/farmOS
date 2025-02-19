(function (Drupal, drupalSettings) {
  Drupal.behaviors.farm_map = {
    attach: function (context, settings) {
      context.querySelectorAll('[data-map-instantiator="farm_map"]').forEach(function (element) {

          // Only create a map once per element.
          if (element.getAttribute('processed')) return;
          element.setAttribute('processed', true);

          element.setAttribute('tabIndex', 0);

          const drupalSettingsKey = element.getAttribute('id');
          const mapInstanceOptions = {};
          Drupal.behaviors.farm_map.createMapInstance(context, element, drupalSettingsKey, mapInstanceOptions);
      });
    },

    createMapInstance: function(context, element, drupalSettingsKey, mapInstanceOptions) {

      // Get the units.
      let units = 'metric';
      if (!!drupalSettings.farm_map.units) {
        units = drupalSettings.farm_map.units;
      }

      // Build default options.
      const defaultOptions = {
        units,
        interactions: {
          onFocusOnly: true
        },
        // Allow to translate map ui.
        baseLayersGroupTitle: Drupal.t('Base layers', {}, { context: 'farm_map' }),
        zoomOptions: {
          zoomInTipLabel: Drupal.t('Zoom in', {}, { context: 'farm_map' }),
          zoomOutTipLabel: Drupal.t('Zoom out', {}, { context: 'farm_map' }),
        },
        rotateOptions: {
          tipLabel: Drupal.t('Reset rotation', {}, { context: 'farm_map' }),
        },
        attributionOptions: {
          tipLabel: Drupal.t('Attributions', {}, { context: 'farm_map' }),
        },
        fullScreenOptions: {
          tipLabel: Drupal.t('Toggle full-screen', {}, { context: 'farm_map' }),
        },
      };

      const mapOptions = {
        ...defaultOptions,
        ...drupalSettings.farm_map[drupalSettingsKey].instance,
        ...mapInstanceOptions
      };
      const instance = farmOS.map.create(element, mapOptions);

      // Expose settings on the instance so other behaviors don't need to know how to look them up in drupalSettings
      instance.farmMapSettings = drupalSettings.farm_map[drupalSettingsKey] || {};

      context.querySelectorAll('.ol-popup-closer').forEach(function (element) {
        element.onClick = function (element) {
          element.focus();
        };
      });

      // Update the map size when the wrapper element is resized.
      new ResizeObserver(() => instance.map.updateSize()).observe(element);

      return instance;
    }

  };
}(Drupal, drupalSettings));
