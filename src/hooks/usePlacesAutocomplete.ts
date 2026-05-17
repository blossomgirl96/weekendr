import React from 'react';

export function usePlacesAutocomplete(
  inputRef: React.RefObject<HTMLInputElement | null>,
  onSelect: (address: string) => void
) {
  const onSelectRef = React.useRef(onSelect);
  onSelectRef.current = onSelect;
  const acRef = React.useRef<google.maps.places.Autocomplete | null>(null);

  React.useEffect(() => {
    const setup = () => {
      if (!inputRef.current || acRef.current) return;

      const ac = new google.maps.places.Autocomplete(inputRef.current, {
        types: ['geocode'],
        fields: ['formatted_address', 'name'],
      });
      acRef.current = ac;

      ac.addListener('place_changed', () => {
        const place = ac.getPlace();
        const address = place.formatted_address ?? place.name ?? '';
        if (address) onSelectRef.current(address);
      });
    };

    const teardown = () => {
      if (acRef.current) {
        google.maps.event.clearInstanceListeners(acRef.current);
        acRef.current = null;
      }
    };

    if (typeof google !== 'undefined' && google.maps?.places) {
      setup();
      return teardown;
    } else {
      const handler = () => setup();
      window.addEventListener('google-maps-ready', handler, { once: true });
      return () => {
        window.removeEventListener('google-maps-ready', handler);
        teardown();
      };
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
}
