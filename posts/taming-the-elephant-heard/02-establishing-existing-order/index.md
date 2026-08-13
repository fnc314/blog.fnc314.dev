---
layout: doc
sequence: 2
title: Establishing Existing Order
description: The second of seven entries in the `Taming the Elephant Heard` series.
prev:
  text: 1 From Mayhem to Micro-Managed
  link: ../01-from-mayhem-to-micro-managed
next:
  text: 3 Plugins Over Copy-Paste
  link: ../03-plugins-over-copy-paste
---

# \#{{ $frontmatter.sequence }} - {{ $frontmatter.title }}

<p class="frontmatter-description">{{ $frontmatter.description }}</p>

<!-- @include: ./../blog-introduction.md -->

1. [From Mayhem to Micro-Managed](../01-from-mayhem-to-micro-managed/)
2. Establishing Existing Order (this article)
3. [Plugins Over Copy-Paste](../03-plugins-over-copy-paste/)
4. [Into the Wider Infrastructure](../04-into-the-wider-infrastructure/)
5. [Right Tool for the Job](../05-right-tool-for-the-job/)
6. [Screaming and Scripted Architecture](../06-screaming-and-scripted-architecture/)
7. [To Future States and Beyond](../07-to-future-states-and-beyond/)

## Establishing Existing Order

With dependencies under control and updated toolkits, the actual experience of working with `build.gradle.kts` files improved drastically. This meant that more “project-wide, structural” refactorings were within reach of being automated (successfully) by Android Studio. Imbued with this new confidence, I took to the effort of drawing hard-and-fast “boundaries” (really, just directories) between code of a “certain type”. There were faint efforts of this with some vendor integrations, but they were not done consistently.

Therefore, the first thing I did was create a namespacing pattern. Luckily there are “universally practiced” standards to namespacing (which is good, considering naming things is by far the hardest part of dealing with code), and this particular firm took pride in how well it organized internally. The very nature of the place lent itself to a clean, direct namespace pattern that was unique (org-wide) and succinct. The pattern used is abstracted to

`com.company[.suborg][.mobile].android.*`

Where `.suborg` is useful where applicable, and `.mobile` helps identify constructs which may vary from a potential `.web` package while keeping potentially similar collections like `.android` and `.ios` together. The very root of the repository represents `com.company[.suborg][.mobile].android`, even though it produces no artifacts itself.

With a labeling pattern in hand, the next steps were simple: create “collection” directories like `libs`, `components`, and `modules`, declare what constitutes a candidate of a given directory, relocate existing candidates appropriately, autowire calls to `Settings#include` in `settings.gradle.kts`, and align `package` (and `namespace`) declarations accordingly. A key to this practice was meticulous use of plural directories (i.e. `libs`) but singular packages (i.e `com.company[.suborg][.mobile].android.lib.`). By mirroring regular grammar behavior, the paradigm was very easy to adopt and acclimate to.

## Word to the Wise

For those of use following at home, I must take this moment to discuss the `applicationId`. During this time, Google began to deprecate `package` within `AndroidManifest.xml` in favor of `namespace` in `build.gradle.kts` files. This is, however, **NOT** to be confused with the `applicationId`, which, in an ideal world, would align with `package` and `namespace` patterns. However, `applicationId`s are the unique identifier in `Google Play` and, considering the established user base and public face of the business, the implementation of our naming protocols stopped at the `com.android.application` module. We were able to repackage the code contributing to these modules, but we did not touch the `applicationId` or any externally-consumed identifier of the application. Net new APKs produced from the same repository, however, *did* extend the naming convention all the way to public identifier. This made parallel installations of `.debug` or some other `.internal` build dead simple and convenient.

## It Takes a Village

With there being a decent handful of vendor integrations with which established order could be used to demonstrate the new naming and “collections” paradigm, work items were drafted that succinctly captured the simple “refactoring” nature needed. The changes were tantamount to renaming directories and performing very specific find-and-replace queries. All changes stayed within `import` blocks and the testing strategy was even more straight-forward, if the work is incorrect or incomplete, Gradle would fail. Therefore, QA only had to focus on things like app launch or a very particular flow.

Larger buy-in was admittedly more difficult as the changes were seen as unnecessary risk. However, support was granted as the demonstration changes went off without a hitch. The bigger “issue” came when we ran out of existing modules to repackage and turned our eyes to the monolith `:app` module. The majority of this order-extracting effort focused on trying to gut the `:app` module. Ideal candidates of `modules` and `libs` and `components` were identified and migrated very, very slowly. Despite the unexpected benefits to parallel efforts relocating code caused, the further into the `:app` module the team ventured, the less likely we were going to be given priority.

As we took the effort as far as we reasonably could (or, actually, needed to), we also made sure to “leave future-proofing space” in our patterns. Every team member, at one point, proposed an alternative category or two and, while new categories were not added for a few years, almost all conversations covered a similar set of concerns. Clearly, this paradigm gave almost all of those exposed a flexible insight driven almost exclusively by domain experience.

## Neverending Affair

This great repackaging was always a neverending affair. Instead of putting a finite timeline on our goal, the entire suborganization adopted the objective as a low-hanging tech debt and a quick-win when capacity opened. If any work item incorporated changes (either directly or adjacently) to code previously or instantly identified as a candidate for repackaging, then the necessary repackaging work items (drafted from templates for user stories) were included in estimates and backlogs.

The more repackaging we completed, the easier repackaging became and the less pressing any remaining code eventually became. Furthermore, we exposed the exact constructs whose coupled nature represent the true roadblock stopping us from fully modularizing the existing codebase. Uncoupling these objects, at one point, was a collective dream of the entire team, however, the new clarity we had into these inherited black boxes lowered the precedence of this dream. We did not need an ideal version of what we had now that we could more easily see its shortcomings and abstract around them.

From a certain point, it was easier to add entire feature code as external modules than ever before. This sped up a plethora of parallel business efforts, present and to-be-started. It also revealed the next crucial piece our project required.

## When You Do Something Right

To this day, I’m not sure if the related complexities of the team’s achievements were ever properly associated with these unrelated benefits and if this association was ever made clear to those who did not spend their days in the repository. What is certain, however, is how crucial the next phase was for the success of the entire effort. The next series entry focuses on the subtle, almost invisible, infrastructure needed to tame the ever-growing number of `Gradle` sub-projects.
