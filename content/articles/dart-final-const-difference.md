---
date: "2020-01-04T13:43:48-05:00"
draft: false
title: "Final vs const in Dart"
author: "Frank Treacy"
---

What's the difference between final and const in Dart?

Easy!

**Final means single-assignment.**

**Const means immutable.**

Let's see an example:

```dart
final _final = [2, 3];
const _const = [2, 3];
_final = [4,5]; // ERROR: can't re-assign
_final.add(6); // OK: can mutate
_const.add(6); // ERROR: can't mutate
```

{{< notice >}}
Want to know EVERYTHING about Dart constructors? Check out [Deconstructing Dart Constructors](/articles/deconstructing-dart-constructors)!
{{< /notice >}}
