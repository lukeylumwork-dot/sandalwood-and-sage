import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Route changes keep the previous scroll offset by default, which lands readers
 * halfway down a freshly-opened page. Reset on pathname change, but leave hash
 * links alone so /#episodes still jumps to its section.
 */
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
