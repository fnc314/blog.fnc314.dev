---
layout: doc
sequence: 3
title: Plugins Over Copy-Paste
description: The third of seven entries in the `Taming the Elephant Heard` series.
prev:
  text: 2 Establishing Existing Order
  link: ../02-establishing-existing-order
next:
  text: 4 Into the Wider Infrastructure
  link: ../04-into-the-wider-infrastructure
---

# \#{{ $frontmatter.sequence }} - {{ $frontmatter.title }}

<p class="frontmatter-description">{{ $frontmatter.description }}</p>

<!-- @include: ./../blog-introduction.md -->

1. [From Mayhem to Micro-Managed](../01-from-mayhem-to-micro-managed/)
2. [Establishing Existing Order](../02-establishing-existing-order/)
3. Plugins Over Copy-Paste (this article)
4. [Into the Wider Infrastructure](../04-into-the-wider-infrastructure/)
5. [Right Tool for the Job](../05-right-tool-for-the-job/)
6. [Screaming and Scripted Architecture](../06-screaming-and-scripted-architecture/)
7. [To Future States and Beyond](../07-to-future-states-and-beyond/)

## Plugins Over Copy-Paste

The explosive growth of new Gradle modules led to a rebirth of copy-paste behaviors, especially around `build.gradle.kts` files and the `dependencies` block therein. This was, however, an intentional thing in my overall plan. This behavior gave direct insight into the priority needs of the team and project as well as candidates for patterns to codify across the repo.

The first solution was, admittedly, a lazy one. I drafted a reasonably detailed [`README.md`](http://README.md) file and included code blocks that developers were encouraged to copy and paste from. I tried to outline which errors were resolved by which dependencies, but the effort was a bit too verbose to be effective long term and at scale. The prior adoption of `Version Catalogs` guaranteed consistency and portability of code though, so copy-and-paste did not introduce version drift and rarely required updating.

It was clear, however, that the repository needed a suite of [Convention Plugins](https://docs.gradle.org/current/userguide/implementing_gradle_plugins_convention.html) further centralizing the essential configurations at the heart of the product. Since `buildSrc` was already in place, and Composite Builds were not yet stable, it was time to extend our packaging patterns to `com.company[.suborg][.mobile].android.build.*` packages and create what we needed.

## Location Location Location

Up to this point, almost every objective, at its core, focused on predictable locations and hierarchy of code. We defined a distinct hierarchy of abstraction layers, layered in arbitrary-but-agreed-upon categories for internal structure, and made it painfully easy to determine where a particular piece of code would/should be found within the repository. New code or relocated code automatically had a safe assumption for a default, expected, location. Every developer could expect the same thing and know what to do should their expectations not be met.

From the perspective of authoring Gradle Plugins, however, these assumptions carried over to easily abstracted build logic. While developers had to determine when to contribute a `.lib` versus a `.module`, build logic that had to work for either collection. The only expected change in behavior, from a Gradle Plugin, would be auto-generated values like `namespace`, where something in `.libs` would be namespaced `com.company[.suborg][.mobile].android.lib.something` but something in `.modules` would be namespaced `com.company[.suborg][.mobile].android.module.something`.

In Gradle’s perspective, and that of the `Android Gradle Plugin` in particular, any Gradle module is either a `com.android.application` or a `com.android.library`, and both types share an almost 90% (made up number) overlap of configurations. In the end, almost all of the logic in the Convention Plugin suite focuses on the subtle, typed, differences between `com.android.library` and `com.android.application` instances, treating directory location (i.e. implied packaging) as controlled input.

No more is this apparent than in the root `settings.gradle.kts` file, responsible for explicitly declaring which folder is included and how (sub-project versus composite project). Through this process, a `name` is defined for each inclusion, derived from the traversed directories. Gradle created an equivalent `Project` object for each-and-every `build.gradle.kts` file found in any given directory, granting existence/uniqueness to location within the overall build. By location agnostic plugins, concerned with `com.android.library` targets, most of the necessary work was created in an afternoon.

## Reduce Steps to Add Code

Since the scope was well defined and the target very small for any plugin (no artifact was published beyond the repository root build), I benefitted from rapid prototyping and a quick scaled roll-out. And, since these changes were to Gradle files, the feedback loop for broken changes was as immediate as possible. I never released something that “worked on my machine” without confidence it will work on any other machine, be it CI/CD or another developer.

The process of retrofitting new Convention Plugins revealed a few places in the repository that would benefit greatly from simple abstractions. At the time, developers adding new Gradle modules were directed to a simple module originally assembled as a guiding sample and “take what they needed” to get started. More often than not, developers would not be familiar enough with the directory patterns used in Gradle builds and forget to rename `src/` directories related to alternative `buildType`s or `productFlavor`s. No matter how “complete” a sample module was, it either overly obscured or insufficiently highlighted the necessary abstractions for assembling modules. In a similar point of glaring inefficiency, the single `settings.gradle.kts` file, responsible for an `include` call per sub-project, required manual edits for each new module. Since team convention aligned with system-file-order, the *expected* list of `include` calls was straight forward to declare, but every so often a careless merge would introduce easy-to-miss typos, old references, and potential hanging `git` refs.

Unfortunately, it would be a while before the entire “add new module” process was turned into an interactive shell script. What I needed to do next was introduce a stream-lined copy-paste example with intentionally unusable directory names as stand-ins for case-by-case requirements of new code. Developers would have to remove copied stuff and rename key directories after the name of their new code. For example, adding `.lib.vendorsdk` meant renaming the directories `com/company[/suborg][/mobile]/android/libs/vendor-sdk/src/[main|debug|release]/com/company[/suborg][/mobile]/android/lib/[name-after-lib.]/` manually. The process was tedious, but the accompanying documentation (as brief as it was) emphasized changes in the folder path and what they aligned to according to Gradle. These demonstrations also ensured the code followed assumptions made by the Convention Plugins.

## Settings For All

The final enhancement for overall DX and project stability was the sealing off of `settings.gradle.kts` from the entire development team. While draconian in appearance, the hard-and-fast approach was driven by the general lack of any real need to edit the file as well as its global ramifications. The chicken-and-egg problem of Version Catalogs also meant that some dependency versions were double-declared in the `settings.gradle.kts` file. Many times, junior developers would simply change a key version to fix their issue and remain painfully oblivious to any downstream effects. Sealing off the file pre-empted these non-sequitor solutions from forming.

My solution to making `settings.gradle.kts` frozen to necessary edits came down to Kotlin’s friendly functional extension methods and Gradle’s generous execution environment. With the repository root shrinking drastically and newer code, by default, being nested in at least one directory, from the project root, there were only 3 or 4 directories worth scanning by Gradle (not including `buildSrc`).

Predictable naming conventions and packaging patterns meant it was straight-forward to filter traversed directories as well. Therefore, by collecting the top-level directories explicitly (`modules/` or `libs/` or whatever) and simply iterating and filtering their content, every *expected* Gradle sub-project could be found without explicitly knowing any single sub-project name. It is also possible to control the sequence of inclusion, should that matter.

The long term reason why this solution was the best one was how easy it was to include not only new top-level directories, but how simple it was to add another layer of nesting in only one top-level directory. Current functionality is a perfect blueprint for a more nuanced solution, should the team see a need, and nothing existing will break when something new is added, so their code base retains stability. From this point on, developers added a new Gradle `build.gradle.kts` file within a directory aligned with current infrastructure, press `Sync` on Android Studio, and see their project where they expect it to be. It was error-proof.

::: tip
## Shameless Self-Plug

In fact, it was this very solution, once future requirements were subsequently baked in, that inspired an open-source contribution of mine developed much, much later. I crafted a [Gradle Settings Plugin](https://plugins.gradle.org/plugin/com.fnc314.gradle.plugins.settings.project-collections-gradle-settings-plugin) intended to wrap an easy-to-read, simple to utilize, and pleasure to maintain approach to managing `include` calls. Instead of maintaining the same assumptions as this project implied, the plugin’s configuration [allows for users to dictate the exact check performed, per potential sub-project, for fine-grain inclusion](https://www.fnc314.com/project-collections-gradle-settings-plugin/dokka/project-collections-gradle-settings-plugin/com.fnc314.gradle.plugins.settings.projectcollectionsgradlesettingsplugin/-project-collections-gradle-settings-extension/file-spec.html). Also, a [simple syntax and convenient extension operator function](https://www.fnc314.com/project-collections-gradle-settings-plugin/dokka/project-collections-gradle-settings-plugin/com.fnc314.gradle.plugins.settings.projectcollectionsgradlesettingsplugin/-project-collections-gradle-settings-extension/to-depth-of.html) result in clearer inclusion logic.
:::

## Stable on the Inside

With about two years and some change having passed since I set out to tame Android’s elephants, the repository was now in a steady state and could grow with business requirements at ease without sacrificing its own stability. At the organizational level, new processes and tools were being introduced with sub-orgs expected to adopt them in a timely manner. Luckily, a dedicated “team” (though it might have been just one individual) existed to streamline said adoption for this Android app and its iOS counterpart. Successful adoption by our crews was deemed an executive priority.

The tool at hand was an open-source darling whose integrations were expected to be “by-the-book”. Aside from a few organizational infrastructure nuances, this turned out to be the case. It wasn’t until maintenance of this new tool fell to our crews much later that I realized the smooth initial integration depended upon non-standard integrations between this new tool and a deprecating Android Gradle Plugin. From this point on, and starting in the next post, I set out to apply the same sense of rationale and reason to how the Android build interacts with the “outside” world.