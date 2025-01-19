import {useEffect} from "react";
import {useLocation} from "react-router-dom";

export const CustomScrollRestoration = () => {
  const location = useLocation();
  useEffect(() => {
    const savedScrollPosition = sessionStorage.getItem(`scroll-position-${location.pathname}`);


    // Scroll to top if there's no saved position (first load of the path)
    if (!savedScrollPosition) {
      window.scrollTo({top: 0, behavior: 'instant'});
    } else {
      const {x, y} = JSON.parse(savedScrollPosition);
      window.scrollTo({top: y, left: x, behavior: 'auto'});
    }

    // Save the scroll position on unload
    const saveScrollPosition = () => {
      sessionStorage.setItem(
        `scroll-position-${location.pathname}`,
        JSON.stringify({x: window.scrollX, y: window.scrollY})
      );
    };

    window.addEventListener('beforeunload', saveScrollPosition);
    return () => {
      window.removeEventListener('beforeunload', saveScrollPosition);
    };
  }, [location]);

  return null;
};