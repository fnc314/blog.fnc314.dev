---
layout: doc
sequence: 4
title: Into the Wider Infrastructure
description: The fourth of seven entries in the `Taming the Elephant Heard` series.
prev:
  text: 3 Plugins Over Copy-Paste
  link: ../03-plugins-over-copy-paste
next:
  text: 5 Right Tool for the Job
  link: ../05-right-tool-for-the-job
---

# \#{{ $frontmatter.sequence }} - {{ $frontmatter.title }}

<p class="frontmatter-description">{{ $frontmatter.description }}</p>

<!-- @include: ./../blog-introduction.md -->

1. [From Mayhem to Micro-Managed](../01-from-mayhem-to-micro-managed/)
2. [Establishing Existing Order](../02-establishing-existing-order/)
3. [Plugins Over Copy-Paste](../03-plugins-over-copy-paste/)
4. Into the Wider Infrastructure (this article)
5. [Right Tool for the Job](../05-right-tool-for-the-job/)
6. [Screaming and Scripted Architecture](../06-screaming-and-scripted-architecture/)
7. [To Future States and Beyond](../07-to-future-states-and-beyond/)

## Into the Wider Infrastructure

The greater organization has imposed its will and bestowed upon the mobile crews a platform agnostic new build tool aimed at streamlining key distribution processes, like building and signing artifacts to upload to platform stores. The open source tool, however, was still a bit nascent and, as it turned out, tended to rely upon non-public/non-documented solutions quite often. To compound on this inherited headache, we were not able to assure the same update frequency of this tool as I secured for Android Studio, so fixes that landed in future versions may not make their way to us for a long, long time.

This tool did provide a simplified way for team members with elevated privileges in key systems to step in, at the last minute, and help move a test artifact from CI/CD pipelines to an arbitrary testing environment. The ability to delegate the build to CI/CD machines meant the original developer can move on to other tickets and the team member with elevated privileges has a simple contribution that does not require much context switching nor that they check-out and build another branch locally. There was noticeable improvement in feedback cycles because of this.

Consequently, this lower-barrier-of-entry, as it were, to the “raw” build artifacts shed the light on how unhelpful certain default attributes of assembled APKs actually are. While considered an implementation detail, the `build` directory into which Android Gradle Plugin produces artifacts was necessary to know for CI/CD navigation or integration with an external tool. This means the ambiguousness of “any generic build artifact” is exposed to and relied upon by anything “downstream”. What was a boon for iterative testing became a nightmare for record keeping and artifact management.

## Making Better Output

My next dedicated task was to introduce traceable build artifacts by default. I wanted key information like build timestamp, commit hash, version code, and `buildVariant` to be “written on the tin”. Even more important, however, was how prominent this information was going to be for *everyone* who would come across an APK. While the verbosity was going to be very offputting, the implicit sequential ordering and guaranteed uniqueness made tracking down which build represented what as easy as a BINGO card.

A side effect of any artifact massaging is the influence it has on pushing builds to developer devices. Since my effort was dedicated to traceability and external validation/identification, it was sidestepped entirely for developer builds. Incidentally, this distinction helped catch a common pattern of production bugs that started appearing like clockwork on certain releases.

Over the past year, there were, more often than not, cases of builds working in QA but failing in Production. Upon investigating one such set of issues, we experimented by testing fully prod-hardened (i.e. fully minified by R8) builds within QA. As luck would have it, the issue appeared. It was apparent, then, that the entire QA process needed to be performed, not on developer debug builds, but on production-like hardened builds, but retain all of the internal QA testing tools.

We solved this problem with a dedicated `buildType` and clever `src/` defaults coming from existing `debug` code. Developers did not have to do anything net-new to support this new variant, except one thing: ensure their JSON models (often Kotlin `data class`es) were safe from R8 obfuscation. This oversight, normally caught in Pull Requests or saved by blanket `-keep` statements in the original monolith `:app` module, was almost always the culprit behind production incidents. Leveraging `@Keep` annotations (with the necessary `androidx` dependency) and project-wide agreement on packaging patterns for data models (i.e. always in `.data`), it was very easy for the team to course correct.

This new `buildVariant` was not meant for local developer use, as minification was time consuming. It was also decreed that QA could not test against any build **except** ones of this new `buildVariant`. Combining the traceable artifact work with requirements around this new `buildVariant` produced an instantly auditable system while simultaneously stopping an entire series of defects from making it beyond internal testing cycles. Records were immaculate and linked to pull requests connecting all documents with actual code changes. Accountability was at an all-time high.

## Ongoing Balancing Act

Within this phase of natural growth, the “physical limits” of the team’s hardware were all too apparent. Constantly trying to tweak `org.gradle.jvmargs` for Intel, Apple M Silicon, and unknown hardware (for CI/CD machines) was an almost impossible endeavor. The last solution I attempted was to include, in comments, alternative values depending on environment and desired build, and instructions for the user to try particular combinations for best results.

Nothing, however, was a sure fire solution, and there were no more unused integrations into our tools left to work around some of our limits. It was not going to be possible to build a QA build via terminal and try to push developer changes locally to a plugged in device. Android Studio (+ Gradle) and Gradle (standalone) required more resources than available to operate efficiently, let alone simultaneously.

These invaluable limits allowed us to influence, even if only slightly, those who would listen. As such, CI/CD machines were usually equipped with the specs to double or triple our requirements, though they might be shared with iOS runs. None of these issues were general blockers, in the end. Since the general need for many simultaneous builds to QA was rare, and the production protocol a bit more locked down, the biggest impact of our resource-intensive repository was on developers, locally. It was a trade-off well worth it.

Maintaining harmonious balance with internal and external concerns, as discussed in the next post, resulted in an expansion of the robustness of our internal build tools. The solutions we employed mirrored existing techniques but carried with them our intentional usage and exposure as an API contract of sorts. It was practically guaranteed that these “API contracts” were not going to change from original design any time soon.