import gsap from "gsap";
import SplitType from "split-type";
import CustomEase from "gsap/CustomEase";

gsap.registerPlugin(CustomEase);
CustomEase.create("hop", "0.9, 0, 0.1, 1");
CustomEase.create("glide", "0.8, 0, 0.2, 1");

document.addEventListener("DOMContentLoaded", () => {
  const backdropData = [
    {
      cols: [
        ["ARC//117 Delta Trace", "ARC//117 Delta Trace", "ARC//117 Delta Trace"],
        ["ARC//117 Delta Trace", "ARC//117 Delta Trace"],
        ["Sector / Hollow Frame", "0.392 02SD 008923"],
        ["Material / Unknown Fiber", "Status / Soft Resonance"],
        [":::..:::.::::...:::"]
      ]
    },
    {
      cols: [
        ["Surface Memory"],
        ["// / / ///// / / / ///"],
        ["Phase Offset > 17%"],
        ["Fragments Aligning", "Pattern Emerging"],
        ["Collapse Pending", "Return -- Layer Zero"],
        ["F-9"]
      ]
    }
  ];

  const backdrop = document.querySelector(".preloader-backdrop");
  if (backdrop) {
    backdrop.innerHTML = backdropData.map(row => `
      <div class="pb-row">
        ${row.cols.map(col => `
          <div class="pb-col">
            ${col.map(text => `<p>${text}</p>`).join("")}
          </div>
        `).join("")}
      </div>
    `).join("");
  }

  const preloader = document.querySelector(".preloader");
  if (preloader) {
    preloader.insertAdjacentHTML("afterbegin", `
      <div class="p-row"><p>Initiating</p></div>
      <div class="p-row">
        <div class="p-col">
          <div class="p-sub-col"><p>Phase 01</p><p>Sequence</p></div>
          <div class="p-sub-col"><p>Signal Scan</p><p>07 Layers</p></div>
        </div>
        <div class="p-col"><p>PX-17</p></div>
      </div>
    `);
  }

  let preloaderComplete = false;

  const preloaderTexts = document.querySelectorAll(".preloader p");
  const preloaderBtn = document.querySelector(".preloader-btn-container");
  const btnOutlineTrack = document.querySelector(".stroke-track");
  const btnOutlineProgress = document.querySelector(".stroke-progress");
  const svgPathLength = btnOutlineTrack.getTotalLength();

  gsap.set([btnOutlineTrack, btnOutlineProgress], {
    strokeDasharray: svgPathLength,
    strokeDashoffset: svgPathLength,
  });

preloaderTexts.forEach((p) => {
  new SplitType(p, {
    types: "lines",
    lineClass: "line",
    tagName: "span",
  });
});

new SplitType(".hero h1", {
  types: "words",
  wordClass: "word",
  tagName: "span",
});

const introTl = gsap.timeline({ delay: 1 });

introTl.to(".preloader .p-row p .line", {
  y: "0%",
  duration: 0.75,
  ease: "power3.out",
  stagger: 0.1,
}).to(
  btnOutlineTrack,
  {
    strokeDashoffset: 0,
    duration: 2,
    ease: "hop",
  },
  "<",
).to(
    ".pbc-svg-strokes svg",
    {
        rotation: 270,
        duration: 2,
        ease: "hop",
    },
    "<",
);

const progressStops = [0.2, 0.25, 0.85, 1].map((base, i) => {
  if (i === 3) return 1;
  return base + (Math.random() - 0.5) * 0.1;
});

progressStops.forEach((stop, i) => {
  introTl.to(btnOutlineProgress, {
    strokeDashoffset: svgPathLength - svgPathLength * stop,
    duration: 0.75,
    ease: "glide",
    delay: i === 0 ? 0.3 : 0.3 + Math.random() * 0.2,
  });
});

introTl.to(
    "#pbc-logo",
    {
        opacity: 0,
        duration: 0.35,
        ease: "power1.out",
    },
    "-=0.25",
).to(
  preloaderBtn,
  {
    scale: 0.9,
    duration: 1.5,
    ease: "hop",
  },
  "-=0.5",
)
.to(
  "#pbc-label .line",
  {
    y: "0%",
    duration: 0.75,
    ease: "power3.out",
    onComplete: () => {
      preloaderComplete = true;
    },
  },
  "-=0.75",
);

preloaderBtn.addEventListener("click", () => {
  if (!preloaderComplete) return;
  preloaderComplete = false;

  const exitTl = gsap.timeline();

  exitTl
    .to(".preloader", {
      scale: 0.75,
      duration: 1.25,
      ease: "hop",
    })
    .to(
      [btnOutlineTrack, btnOutlineProgress],
      {
        strokeDashoffset: -svgPathLength,
        duration: 1.25,
        ease: "hop",
      },
      "<",
    )
    .to(
      "#pbc-label .line",
      {
        y: "-100%",
        duration: 0.75,
        ease: "power3.out",
      },
      "-=1.25",
    )
    .to(
      "#pbc-outer-label .line",
      {
        y: "0%",
        duration: 0.75,
        ease: "power3.out",
      },
      "-=0.75",
    ).to(".preloader", {
  clipPath: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
  duration: 1.5,
  ease: "hop",
})
.to(
  ".preloader-revealer",
  {
    clipPath: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
    duration: 1.5,
    ease: "hop",
    onComplete: () => {
      gsap.set(".preloader", { display: "none" });
    },
  },
  "-=1.45",
).to(".hero", {
    scale: 1,
    duration: 1.25,
    ease: "hop",
})
.to(
    ".hero h1 .word",
    {
        y: "0%",
        duration: 1,
        ease: "glide",
        stagger: 0.05,
    },
    "-=1.750",
);
});
});