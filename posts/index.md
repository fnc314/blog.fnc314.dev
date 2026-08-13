---
layout: home
home: true
title: Franco's Blog
description: Home of my thoughts, concepts, and ramblings.
hero:
  name: Franco's Blog
  tagline: Home of my thoughts, concepts, and ramblings.
features:
  - icon:
      src: ./public/taming-the-elephant-heard/gradle-logo.png
      alt: Gradle logo
    title: Taming the Elephant Heard
    details: A series following the modernation, stabilization, and the reworking of a decade-old Android codebase into a future-proof workhorse.
    link: ./posts/taming-the-elephant-heard/index
---

<style module>
  section {
    margin-block: var(--sizes-margin-xl);
    display: flex;
    justify-content: center;
    align-items: center;

    figure {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: var(--sizes-gap-m);

      picture {
        max-inline-size: var(--sizes-dynamic-width-xs);
      }
    }

  }
</style>

<section>
  <figure>
    <picture>
      <source
        type="image/webp"
        srcset="./../public/profile-photo/profile-photo-750.webp 750w, ./../public/profile-photo/profile-photo-1200.webp 1200w, ./../public/profile-photo/profile-photo-1500.webp"
        sizes="(max-width: 768px) 95vw, (max-width: 1200px) 50vw, 33vw"
      />
      <img
        type="image/webp"
        class="profile-picture"
        loading="eager"
        src="./../public/profile-photo/profile-photo-1200.webp"
        alt="Profile Photo of Franco N. Colaizzi with a blurred background of Abruzzo, Italy from 2025"
        fetchpriority="high"
        decoding="sync"
      />
    </picture>
    <figcaption class="md-typescale-title-medium profile-figcaption">Me in Abruzzo, Italy in 2025</figcaption>
  </figure>
</section>