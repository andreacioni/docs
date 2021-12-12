---
date: "2020-01-04T13:43:48-05:00"
draft: false
title: "Dart Getter Shorthand to Cache Computed Properties"
author: "Frank Treacy"
---

An elegant Dart getter shorthand used to cache computed properties:

```dart
T get foo => _foo ??= _computeFoo();

// which depends on having
T _foo;
T _computeFoo() => /** ... **/;
```

It makes use of the fallback assignment operator `??=`.

{{< notice >}}
Check out [Null-Aware Operators in Dart](/articles/checking-null-aware-operators-dart) for a complete guide on dealing with `null`s in Dart!
{{< /notice >}}
