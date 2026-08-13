---
layout: doc
sequence: 6
title: Screaming and Scripted Architecture
description: The sixth of seven entries in the `Taming the Elephant Heard` series.
prev:
  text: 5 Right Tool for the Job
  link: ../05-right-tool-for-the-job
next:
  text: 7 To Future States and Beyond
  link: ../07-to-future-states-and-beyond
---

# \#{{ $frontmatter.sequence }} - {{ $frontmatter.title }}

<p class="frontmatter-description">{{ $frontmatter.description }}</p>

<!-- @include: ./../blog-introduction.md -->

1. [From Mayhem to Micro-Managed](../01-from-mayhem-to-micro-managed/)
2. [Establishing Existing Order](../02-establishing-existing-order/)
3. [Plugins Over Copy-Paste](../03-plugins-over-copy-paste/)
4. [Into the Wider Infrastructure](../04-into-the-wider-infrastructure/)
5. [Right Tool for the Job](../05-right-tool-for-the-job/)
6. Screaming and Scripted Architecture (this article)
7. [To Future States and Beyond](../07-to-future-states-and-beyond/)

## Screaming and Scripted Architecture

After many years and numerous iterations, the Android repository started to mature. There was hardly an execution context, user variation, or infrastructure change capable of impeding a successful build. Short of running the build offline (without an existing cache), exceptions thrown from the build became just that, exceptional circumstances. Issues that did come up were usually the result of a simple oversight or included extremely clear logs. There hadn’t been an Android developer in over 1.5 years that sustained an unstable environment (locally) for longer than half a day.

Likewise, onboarding times dropped to the length of request approvals being the main impact on overall wait-time. The setup process was so streamlined that senior developers rarely ever got involved in onboarding and it was seen as an excellent test for the second-most recent team additions to be responsible for helping the newest additions acclimate their machines.

The existing project layout was efficient at helping developers self-navigate, sternly implying ideal, logical homes for changes. We made [Uncle Bob very proud](https://blog.cleancoder.com/uncle-bob/2011/09/30/Screaming-Architecture.html) and gave senior developers the ability to spot-review PRs to determine if the contributions were put in the right spot of the codebase.

In the end, though, I still saw room for improvement. This time, however, the primary target of my refinements weren’t the codebase, primarily, but the developer’s environment and how resilient it really was.

## Get What From Where

Those familiar with `Gradle` will, no doubt, be aware of the plethora of ways a system can influence a `Gradle` build. And, as with any robust tool, the various configuration mechanisms influence `Gradle` in subtle, unique, and (most importantly) with a strict order-of-precedence. As outlined [on the site](https://docs.gradle.org/current/userguide/build_environment.html#available_mechanisms), and depending on the criticality a particular configuration does/does not take precedence, the proper `Gradle` configuration technique depends on the characteristic being influenced and the scope/severity of the influence at large.

As with most corporate environments, the source of external dependencies is a meticulously managed thing. While `androidx` and `org.jetbrains` dependencies are made available on industry leading repositories, everything our app intended to leverage had to be found in internal mirrors. This requirement meant almost every single online tutorial included an incompatible instruction team mates had to know to avoid. Since manual edits to `*.gradle.kts` files were at an all-time low, and the Version Catalogs had expanded to cover all existing dependencies (vendor or open source), the concept of `repositories` were not even found in the project files. Anyway, the only time the build process pulled from off-prem sources was to pull the Android SDKs which are exclusively hosted by Google. Every other dependency, including `Gradle` itself, came from internal mirrors.

To configure such global constraints effortlessly, `Gradle` has a powerful concept called [Init Scripts](https://docs.gradle.org/current/userguide/init_scripts.html). These scripts are a way to provide `Gradle` the first applied configurations. The obviousness of their utility is made evident in [the sample plugin](https://docs.gradle.org/current/userguide/init_scripts.html#sec:init_plugins) where they show how to use Init Scripts to filter project `repositories` and enforce a particular setup exclusively. Therefore, as part of the onboarding flow, a repo-managed `init.gradle.kts` file was injected into the `~/${user}/.gradle/init.d` directory as well as an organization-wide `gradle.properties` file.

With the repository code scrubbed of any external dependency source declaration, the portability of the project as a whole improved. As we soon learned, our CI/CD pipeline had grown frail because of silent errors when dependencies were pulled. With our `init.gradle.kts`\-driven approach, CI/CD machines, using the `--init-script` CLI flag, would provide their approved `init.gradle.kts` files without any potential drift between local and remote build environments.

## From Square One

Looking back, holistically, on the entire setup of this Android repository and it appears we have scattered responsibility across every available input for configuration. The truth, however, was quite the opposite. We leaned into the corporate landscape of ours such that we delegated *explicit* configuration responsibilities to dedicated mechanisms; `init.gradle.kts` files explaining precisely from where any given dependency is sourced, Version Catalog collections outlining the only consumed version of every dependency, and build logic exposed as isolated helper code.

This meant, if we looked through the lens of a new contributor, the “start here” `build.gradle.kts` file is practically empty with any changes supported by autocomplete, the bare-minimum bootstrap code for a new module was cookie-cutter, and any time gained by copy-paste was significantly offset by potential renaming requirements (done without the help of the IDE). Therefore, we successfully removed any friction for first time contributors, but, simultaneously, we did not provide a reasonable scaffold.

It was apparent that the team needed an automated way to produce, at least, a correctly placed `build.gradle.kts`. Extremely generic sample code, placed within `src/main`, `src/debug`, `src/release`, and `src/test` directories, a singular `<string>` containing the generated module’s unique name and an identifier in compliance with Content Management’s upcoming CMS system, and duplicated across both `res/values|values-es/strings.xml` files, and a single `res/layout/layout.xml` file containing an `com.google.android.material.textview` referencing the single `R.string` resource.

Empty (Kotlin) `object`s were placed in the lowest level of randomly named directories that started *after* packages aligned with the project’s location. For example, consider a collection of projects `.libs` and a developer aims to contribute a library `acme-sdk` into the project. The team definitions say that *code to wrap a third-party/vendor SDK, lives in `.libs` and borrows its name from the SDK, without the letters “SDK”*. The scripts, then, would produce

```kotlin
// File Path: $projectRoot/libs/acme/src/[main|debug|...]/com/company[/suborg][/mobile]/android/lib/acme/sub/package/AFile.kt

package com.company[.suborg][.mobile].android.lib.acme.some.package

interface SomeObject

// maybe?
class DebugSomeObject : SomeObject
```

The use of separate names allowed the project to compile without requiring a more complicated scaffolding to set up.

It was with this collection of utilities, the Android repository’s multi-year glow-up was approaching a never-technically-defined end. Our build, infrastructure integrations, and developer experience were some of the best within the entire organization and the perspective from non-technical teammates permanently shifted as if there was renewed faith in the Android team again.

## Back to the Start

The repository architecture resisted significant changes for a long time, and at the start of what would become one of my greatest success stories, the opportunity to lean into our existing work in a novel way was at hand. Over the first iteration of this C-Suite-observed project, the team’s integration blurred the lines of our existing collections.

As one under timelines always does, the project crew stuck to prevailing project conventions and added `Gradle` modules to no fewer than 3 root-level collections. Not only did any teammate have to navigate *around* these new additions, but team members working *on* the new code required drastic leaps across the project structure for related changes. Thankfully, Google published [in-depth guides](https://developer.android.com/topic/modularization/patterns) on ideal code-base layout. So, the team agreed on a “loose” term for the collection `.features` and the project team became the first contributors under this new paradigm.

In one straight-forward (and rather obvious [in hindsight](https://en.wikipedia.org/wiki/Conway%27s_law)) decision, concerns of scattered code and growing spaghetti code were eliminated. This new organizational dimension further inverted source-code ownership in favor of the `.features` team. So long as code existed within a given `.features/some-feature`, then it might as well live in a separate repository. What was *not* relinquished, however, was the entire project’s iron (but invisible) grip upon the build system and general environment (assumptions and all).

As the project team migrated to the first `./features` entry, some inexplicable issues started to spring up *only* for this team. And the errors were very weird, one time one developer was only able to use Android Studio or `Gradle`/Terminal to assemble the build, but never would they be able to use *both* at any given time. To add to the confusion, if the dev restarted the machine, it wasn’t guaranteed that functionality would switch from one tool to the other. It took a couple of weeks to trace down the issue, which I did by having a fit of rage and being too lazy to look at what key I pressed during an automated cleanup before it was too late.

I nuked my environment, by running `rm -rfv ~/.gradle`. The reason I say “nuked” is because the setup `init.gradle.kts` file was not replaced before another invocation to the `Gradle` Wrapper was fired. It took me longer than I care to admit to realize what files I needed to replace before the build was restored, but at the same moment I was able to repeat the exercise with the plagued developer. Lo-and-behold, once their environment was restored, not only did the developer gain the ability to use Terminal *and* Android Studio at any moment, but simple Android Studio features, such as device debugging and screen mirroring began to work reliably. The developer’s defect rate actually dropped because he was able to now use things like the Layout Inspector for the first time.

This is where I saw the last missing gap in our tool kit: nuking and restoring the entire environment. The objective was straightforward and when coupled with tiny tweaks to existing setup scripts (separating particular procedures more granularly), our repository was pretty-much Developer Experience complete. Through a handful of keystrokes, developers can on-board, off-board, or re-board to the project. Never again would Android Studio or a developer’s computer be a liability or hindrance.

## What to do Next

Without sounding like someone who goes *looking* for extra responsibilities, once the project felt relatively DX-Complete, I couldn’t help but have a nagging sensation that there was still functionality left on the table of which we were (maybe) not taking full advantage. The last post in this series discusses how the necessities of large-scale business initiatives was the final push I needed to really fine-tune the repository, ideally without a change below the `src/` line.