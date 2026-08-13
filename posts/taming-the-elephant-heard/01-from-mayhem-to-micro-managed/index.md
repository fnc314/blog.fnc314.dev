---
layout: doc
sequence: 1
title: From Mayhem to Micro-Managed
series: Taiming the Elephant Heard
description: The first of seven entries in the `Taming the Elephant Heard` series.
next:
  text: 2 Establishing Existing Order
  link: ../02-establishing-existing-order
---

<style module>
  ol {
    margin-inline: auto;
    margin-block: 1.2rem;
  }
</style>

# \#{{ $frontmatter.sequence }} - {{ $frontmatter.title }}

<p class="frontmatter-description">{{ $frontmatter.description }}</p>

<!-- @include: ./../blog-introduction.md -->

1. From Mayhem to Micro-Managed (this article)
2. [Establishing Existing Order](../02-establishing-existing-order/)
3. [Plugins Over Copy-Paste](../03-plugins-over-copy-paste/)
4. [Into the Wider Infrastructure](../04-into-the-wider-infrastructure/)
5. [Right Tool for the Job](../05-right-tool-for-the-job/)
6. [Screaming and Scripted Architecture](../06-screaming-and-scripted-architecture/)
7. [To Future States and Beyond](../07-to-future-states-and-beyond/)

## From Mayhem to Micro-Managed

In a (corporate) tale as old as time, the state of the repository when I onboarded was dismal at best. Not only were conflicting versions of dependencies declared, but third party integrations resulted from copy-paste integrations instead of intentional changes. This project also suffered from undocumented, fragile infrastructure code and very manual production build protocols (also undocumented). Build times are equivalent to coffee refreshes and the out-of-date Android Studio takes longer still to complete a sync. Developers are unable to leverage the rapidly improving developer ecosystem and the `.gradle` file ending induced anxiety even when accidentally opened.

There were external ramifications to this too. The non-technical side of the business often viewed the platform, and team, as a liability. In the worst cases, giving rise to the opinion that "Android is a second class" citizen/customer/user. This did not represent an ideal work space, from a technical perspective, and since I wanted to spend a lot of time learning Android (and this project), I decided to take upon myself the driving force behind a full modernization of the Developer Experience for Android.

## Where the True Problems Lie

Originally, `Gradle` files were (and technically still are/can be) written in a syntax-flexible language known as `Groovy`, and the build scripts are `build.gradle` files. The `Groovy` language and `Gradle`'s `DSL` allowed for very declarative output that tended to work when hodged-podged together after years of blind copy-paste. This organizational resilience is a blessing and a curse and, in this instance, resulted in numerous declarations of conflicting dependencies and a general overworking of Gradle's `Dependency Resolution` process. The first step to modernizing anything was to know what Gradle is currently doing, justify what needs to stay, and fix what does not belong.

At the time of this effort, Gradle's `Version Catalogs` were still a pipe-dream, but the `Groovy` language let us draft a similar structure locally. This homegrown solution did not last long, thankfully, and as soon as `Version Catalogs` were available behind a flag, I immediately migrated to a multi-file solution. I avoided creating what would have been an extremely large `TOML` file and created several files named after the collection of libraries they declared and directories aligned to similar artifact groups. This helped separate 3rd-party dependencies by contributors (like `com.squareup` or `androidx` versus `some.vendor`), in turn significantly lowering the barrier for at-a-glance audits by "formerly technical" managers.

The final step in this initial migration of dependency management paradigms was to "bundle" the collection of `Version Catalogs` and expose them to "any `Gradle` project". Luckily, there was no real need for such a deliverable, so it was sufficient enough to isolate the Version Catalog creation into a simple `version-catalogs.settings.gradle.kts` script and apply it to the `Root Project` and any `Composite Build` as necessary. This came in handy when we introduced `buildSrc` toolkits.

## Dividing and Conquering

Once the dependencies were manageable and auditable, the painful tasks of removing redundancies and upgrading integrations were backlogged and prioritized across the full development team. Working closely with Business Analysts and Quality Assurance team members thoroughly articulated user stories were crafted, clear on expectations to both developers and testers. Product owners were brought into alignment during standard Agile ceremonies and over an impressively short period of time (less than a full fiscal quarter) the global dependency web of the Android application was up-to-date, type-checked, observable, and extremely easy to manage. New developers acclimated very easily to the approach and newer versions of Android Studio provided support for "Jump to Source" on dependencies blocks in `build.gradle.kts` scripts. The standardization of `Version Catalogs` in the time since has cemented this long-standing solution as the correct approach.

As dependencies were brought up-to-date, and new/modernized AndroidX libraries were pulled in to replace outgoing `com.android.support` set, I started the migration to `Kotlin Gradle` files. Using `Kotlin` with `Gradle` carries a small performance hit as `Kotlin` files need to be compiled to `JVM` code before Gradle can execute them, however, the 1–1 compatibility with any existing Gradle code coupled with the familiar Developer Experience as with editing code under `src/` outweighed any of these concerns. Simple tweaks to `org.gradle.jvmargs` reduced a lot of these tradeoffs as well. The current state of the repository meant that there were few build.gradle files to actually migrate, and even fewer settings.gradle. However, it was in this exercise where `buildSrc` was first introduced and the notion of defining project-specific utility Plugins began to naturally take shape.

In a parallel effort, I was able to work with the powers that be and guarantee a drastically shortened window between public Android Studio releases and the update being available within the organization. Unfortunately, Android Studio’s tendency to introduce time saving features like build file conversion and Version Catalog creation arrived too late for us, every other improvement was always welcome, such as the introduction of `R8` and newer `Android Gradle Plugin` versions.

## Immediate Next Steps

Within the first year of taking on this effort, the benefits are starting to become apparent. Developers have a more stable toolkit, with frequent updates. Gradle is not only doing less work, but exactly what it is doing is crystal clear, even to a non developer. This carries over to vendor integrations as well, providing even more stabilization to the final APK. Dependencies are auditable and easy to migrate.

What became clear at this point was that the project needed uniformity. The code was not organized and sometimes third-party namespaces would embed themselves within first-party code. It was very difficult to discern what code was vendor-supplied integration code or hand-written solutions from within. In the next entry, we review the process of extracting established order and how we can use that to define a template shape for the overall project.
