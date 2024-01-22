import { useEffect } from "react";

function useOutsideClick(ref, handler, deps, ignoreRefs) {
  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      if (ignoreRefs) {
        let isIgnored = false;
        ignoreRefs.forEach((ignoreRef) => {
          if (ignoreRef.current?.contains(event.target)) {
            isIgnored = true;
          }
        });
        if (isIgnored) return;
      }
      handler();
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, deps);
}

export default useOutsideClick;
