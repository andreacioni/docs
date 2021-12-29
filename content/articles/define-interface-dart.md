---
date: "2020-01-04T13:43:48-05:00"
draft: false
title: "How To Define an Interface in Dart"
author: "Frank Treacy"
---

Dart defines _implicit_ interfaces. What does this mean?

In your app you'd have:

```dart
class Session {
  authenticate() { // impl }
}
```

or

```dart
abstract class Session {
  authenticate();
}
```

And for example in tests:

```dart
class MockSession implements Session {
  authenticate() { // mock impl }
}
```

No need to define a separate interface, just use regular or abstract classes!

{{< notice >}}
Want to know EVERYTHING about Dart constructors? Check out [Deconstructing Dart Constructors](/articles/deconstructing-dart-constructors)!
{{< /notice >}}

{{< contact >}}