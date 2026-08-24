import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function usePageMotion() {
  const location = useLocation();

  useLayoutEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const context = gsap.context(() => {
      gsap.fromTo(
        ".page-content",
        { autoAlpha: 0, y: reduceMotion ? 0 : 10 },
        { autoAlpha: 1, y: 0, duration: reduceMotion ? 0 : 0.45, ease: "power2.out", clearProps: "transform" }
      );

      if (!reduceMotion) {
        gsap.utils.toArray("[data-reveal]").forEach((element) => {
          gsap.fromTo(
            element,
            { autoAlpha: 0, y: 24 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.7,
              ease: "power3.out",
              scrollTrigger: {
                trigger: element,
                start: "top 88%",
                once: true,
              },
            }
          );
        });
      } else {
        gsap.set("[data-reveal]", { autoAlpha: 1, clearProps: "all" });
      }
    });

    window.scrollTo({ top: 0, behavior: "auto" });
    return () => context.revert();
  }, [location.pathname]);
}
