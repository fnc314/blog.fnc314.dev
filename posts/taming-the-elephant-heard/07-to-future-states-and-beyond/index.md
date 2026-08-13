---
layout: doc
sequence: 7
title: To Future States and Beyond
description: The seventh of seven entries in the `Taming the Elephant Heard` series.
prev:
  text: 6 Screaming and Scripted Architecture
  link: ../06-screaming-and-scripted-architecture
next:
  text: Home
  link: ../index
---

# \#{{ $frontmatter.sequence }} - {{ $frontmatter.title }}

<p class="frontmatter-description">{{ $frontmatter.description }}</p>

<!-- @include: ./../blog-introduction.md -->

1. [From Mayhem to Micro-Managed](../01-from-mayhem-to-micro-managed/)
2. [Establishing Existing Order](../02-establishing-existing-order/)
3. [Plugins Over Copy-Paste](../03-plugins-over-copy-paste/)
4. [Into the Wider Infrastructure](../04-into-the-wider-infrastructure/)
5. [Right Tool for the Job](../05-right-tool-for-the-job/)
6. [Screaming and Scripted Architecture](../06-screaming-and-scripted-architecture/)
7. To Future States and Beyond (this article)

## To Future States and Beyond

The business determined it was time for a redesign and we needed to maintain the legacy codebase (and identity in published stores) while developing the new application, within the same git repository. Simultaneously, there were alternative code maintenance initiatives (like multiple repositories) that were being explored. And all of this was in parallel to maintaining two applications with a combined user base of almost 11 million users. There was work to be done to preserve the complexities of this ask, however, and it started with the biggest pain point of any legacy Android application, the legacy (monolith) `:app` module.

## Dealing with Legacy `:app`

As every long-running Android application repository will demonstrate, there almost always exists an `:app` module, a directory at the root level, next to `settings.gradle(.kts)`, with a `build.gradle.kts` file in which the `com.android.application` Android Gradle Plugin is applied. There is only *one* of these plugin instances within a given repository and it represents the final artifact as published to Google Play (or other stores).

In the initial days of the project, when development was not in-house, there was very little oversight into a flexible code structure. Almost no external `Gradle` modules were created, resulting in a tightly coupled collection of business logic, framework hooks, and SDK integrations spread everywhere. Coupled with the “artificial Fragment” architecture (a unique take on the MVP paradigm), it was almost impossible to reduce `:app` further than we have over the past 5+ years.

Since `:app` was, at this point, the *entire* existing product, we needed a way to preserve it, as is, and completely isolate it from any-and-all newly produced `.apk`s from the repository. It was clearly time to [make our \`:app\` module a \`com.android.library\`](https://developer.android.com/studio/projects/android-library#Convert).

## From `.apk` to `.aar`

Since *the `src`* from `:app` was to become the `src` for a new `com.android.library`, we had a great opportunity to extend our existing conventions to cover *any number of `apps`* to be produced by the repository. We chose to keep things straight forward and moved `app/src` into `apps/legacy/src`, creating `:apps:legacy` and the associated `.aar` representing the existing production product. Now, the repository would create an `.apk` that, in essence, is this `:apps:legacy` `.aar` while preserving the existing `app:assemble*` commands proliferated through-out the team.

In order to further isolate the existing project’s configurations, we leveraged `productFlavors` and the associated `Gradle Configurations` to link `:app` and `:apps:*` instances. In this case, `:app` would carry a `flavorLegacyImplementation` dependency upon `:apps:legacy` (which would only produce against the `flavorLegacy` `Configuration`). Subsequent `:apps` aligned with `productFlavors`, but all `productFlavors` used the shared `buildTypes` and thus hooked into all of the existing infrastructure seamlessly.

In a matter of moments, we moved our most maligned code into an isolated module coupled with dedicated dependency delivery mechanisms. This opened up `:apps:redesign` and `:apps:playground`; dedicated spaces for the next initiatives. All efforts were isolated, none were out-of-sync. All existing infrastructure was immediately available and the *actual* shared code, the `src` files to which `com.android.application` directly acted was reduced to an empty `AndroidManfiest.xml` file and *zero `.kt` or `.java` files*.

Not a single release was delayed, nor a quality assurance testing cycle missed while this migration took place. In fact, if memory serves me, the team worked through these tasks within a week. There were very few, if any, “decisions” to make after all… we were not undertaking a novel effort.

## Off Into The Unknown

Looking at the current landscape of approaches to native mobile application development, I cannot help but see a direct parallel with how this project’s `:apps` collection aligns with [the Jetbrains KotlinConf application structure](https://github.com/JetBrains/kotlinconf-app/tree/main/app). For `applicationId`s which were used internally, alignment with the `package` structure was natural; `com.company(.suborg)(.mobile).android.app.*`. The repository was officially positioned to handle almost anything the business (or infrastructure/architecture teams) required of it, and never once was the ability to provide stability and support to current users.

I like to think the project was ripe for a [Kotlin Multiplatform migration](https://developer.android.com/kotlin/multiplatform/migrate), although this is an avenue I will never get to explore. Having since moved on from this amazing opportunity, I’m not really sure what the most current state of the repository really is. All I am sure of is that, no matter how my years of architectural changes are reviewed, it is impossible to deny that I followed [Uncle Bob’s Boyscout Rule](https://biratkirat.medium.com/step-8-the-boy-scout-rule-robert-c-martin-uncle-bob-9ac839778385). Therefore, it’s safe to say, they are in an infinitely better place now than they ever were.
