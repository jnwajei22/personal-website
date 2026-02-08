import type React from "react";

export type ProjectStatus = "PROPOSED" | "IN_PROGRESS" | "FINISHED";

export type ProjectTag =
  | "Embedded"
  | "PCB"
  | "Hardware"
  | "Web"
  | "Backend"
  | "ML"
  | "Systems"
  | "Business"
  | "Research";

export type Project = {
  slug: string;
  title: string;
  status: ProjectStatus;
  summary: string;

  // CANONICAL field used by page.tsx + ProjectCard
  tags?: ProjectTag[];

  // Optional / future use (not required right now)
  domainTags?: ProjectTag[];
  stackTags?: string[];

  githubUrl?: string;
  mdx?: () => Promise<{ default: React.ComponentType }>;
};

export const projects: Project[] = [
  {
    slug: "homemade-sim-build",
    title: "Homemade Sim Build",
    status: "IN_PROGRESS",
    summary: "DIY sim racing setup: F1-style wheel, pedals, electronics, and integration.",
    tags: ["Hardware", "Embedded", "PCB"],
    domainTags: ["Hardware", "Embedded", "PCB"],
    stackTags: ["KiCad", "STM32", "Fusion 360"],
    mdx: () => import("./f1-sim-build.mdx"),
  },
  {
    slug: "flight-controller-drone",
    title: "Flight Controller Drone",
    status: "PROPOSED",
    summary: "Custom flight controller + drone with sensor fusion, lidar, autonomy, and follow/sentry modes.",
    tags: ["Embedded", "Hardware", "Systems"],
    domainTags: ["Embedded", "Hardware", "Systems"],
    stackTags: ["Sensor Fusion", "Lidar", "Control Loops"],
    mdx: () => import("./flight-controller-drone.mdx"),
  },
  {
    slug: "cellbox",
    title: "CellBOX",
    status: "PROPOSED",
    summary: "Portable micro cell tower concept with Starlink/satellite backhaul for remote coverage.",
    tags: ["Hardware", "Systems"],
    domainTags: ["Hardware", "Systems"],
    stackTags: ["Cellular", "Backhaul", "Networking"],
    mdx: () => import("./cellbox.mdx"),
  },
  {
    slug: "project-astro",
    title: "Project ASTRO",
    status: "IN_PROGRESS",
    summary: "Local-first OS-level assistant using offline Llama models with Hume AI voice and installable packaging.",
    tags: ["ML", "Systems"],
    domainTags: ["ML", "Systems"],
    stackTags: ["Llama", "Hume AI", "Automation"],
    mdx: () => import("./project-astro.mdx"),
  },
  {
    slug: "capacitive-keyboard-desk",
    title: "Capacitive Keyboard Desk",
    status: "PROPOSED",
    summary: "Evolves from a custom keyboard + touch bar into a full capacitive glass-desk interface with gesture control.",
    tags: ["Hardware", "Embedded"],
    domainTags: ["Hardware", "Embedded"],
    stackTags: ["Fusion 360", "Capacitive Sensing", "Firmware"],
    mdx: () => import("./capacitive-keyboard.mdx"),
  },
  {
    slug: "iot-dev-board",
    title: "IoT Dev Board",
    status: "PROPOSED",
    summary: "Prototype board supporting both bare-metal firmware work and Linux/SBC-class development.",
    tags: ["Embedded", "Hardware"],
    domainTags: ["Embedded", "Hardware"],
    stackTags: ["Linux", "SBC", "Prototyping"],
    mdx: () => import("./iot-dev-board.mdx"),
  },
  {
    slug: "carbon-fiber-scale-planes",
    title: "Carbon Fiber Scale Planes",
    status: "PROPOSED",
    summary: "Decorative scale aircraft builds in carbon fiber to stay sharp in Fusion 360 and fabrication.",
    tags: ["Hardware"],
    domainTags: ["Hardware"],
    stackTags: ["Fusion 360", "Carbon Fiber"],
    mdx: () => import("./carbon-fiber-scale-fighters.mdx"),
  },
  {
    slug: "ogwashi-uku-website",
    title: "Ogwashi-Uku Website",
    status: "IN_PROGRESS",
    summary: "Modern public site + member portal with auth/RBAC, chapters, events, and admin workflows.",
    tags: ["Web", "Backend", "Systems"],
    domainTags: ["Web", "Backend", "Systems"],
    stackTags: ["Next.js", "Postgres", "RBAC"],
    mdx: () => import("./ogwashi-uku-website.mdx"),
  },
  {
    slug: "hud-helmet",
    title: "HUD Helmet",
    status: "IN_PROGRESS",
    summary: "Motorsport-inspired HUD helmet with IMU tracking, Bluetooth hands-free controls, and sensor fusion.",
    tags: ["Hardware", "Embedded", "Systems"],
    domainTags: ["Hardware", "Embedded", "Systems"],
    stackTags: ["IMU", "Bluetooth", "Sensor Fusion"],
    mdx: () => import("./hud-helmet.mdx"),
  },

];

export const projectsBySlug = Object.fromEntries(
  projects.map((p) => [p.slug, p])
) as Record<string, Project>;
