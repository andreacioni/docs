---
date: "2019-09-10T23:43:48-05:00"
draft: false
title: "How to Format a Duration as a HH:MM:SS String"
versions: "1.9.1"
---

The shortest, most elegant and reliable way to get `HH:mm:ss` from a `Duration` is doing:

```dart
format(Duration d) => d.toString().split('.').first.padLeft(8, "0");
```

Example usage:

```dart
main() {
  final d1 = Duration(hours: 17, minutes: 3);
  final d2 = Duration(hours: 9, minutes: 2, seconds: 26);
  final d3 = Duration(milliseconds: 0);
  print(format(d1)); // 17:03:00
  print(format(d2)); // 09:02:26
  print(format(d3)); // 00:00:00
}
```

If we are dealing with smaller durations and needed only minutes and seconds:

```dart
format(Duration d) => d.toString().substring(2, 7);
```