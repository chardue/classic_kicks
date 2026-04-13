import { useEffect, useState } from "react";

export default function BackToTop() {
  const [showButton, setShowButton] = useState(false);
  const [scrollPercent, setScrollPercent] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollPercent(percent);
      setShowButton(scrollTop > 300);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <button
        id="back-to-top"
        className={`back-to-top ${showButton ? "show" : "hide"}`}
        aria-label="back-to-top"
        onClick={scrollToTop}
        type="button"
      >
        <span
          id="progress-bar"
          style={{ height: `${scrollPercent}%` }}
        ></span>
        <i className="bx bx-up-arrow-alt"></i>
      </button>

      <style>{`
        button.back-to-top i {
          position: relative;
          font-weight: 100;
        }

        button.back-to-top {
          position: fixed;
          bottom: 60px;
          inset-inline-end: 30px;
          z-index: 999;
          opacity: 0;
          visibility: hidden;
          font-size: 16px;
          line-height: 1;
          height: 40px;
          width: 40px;
          background-color: #ffffff;
          border-radius: 10px;
          transition: opacity 0.3s ease, visibility 0.3s ease;
          border: none;
          cursor: pointer;
        }

        .back-to-top.hide {
          opacity: 0;
          visibility: hidden;
        }

        .back-to-top.show {
          opacity: 1;
          visibility: visible;
        }

        #progress-bar {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 2px;
          background-color: #333333;
        }
      `}</style>
    </>
  );
}