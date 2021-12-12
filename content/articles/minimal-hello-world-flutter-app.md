---
date: "2019-07-30T23:43:48-05:00"
draft: false
title: "Minimal Flutter Apps to Get Started"
author: Frank Treacy
versions: "1.12.13"
---

Every time I do a `flutter create project` I get the default "counter" sample app full of comments.

While it's great for the very first time, I now want to get up and running with a minimal base app that fits in my screen.

Here are a few options to copy-paste into `lib/main.dart`.

### Bare bones app

```dart
// lib/main.dart

import 'package:flutter/widgets.dart';

main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(context) => Center(
    child: Text('Hello Flutter!', textDirection: TextDirection.ltr)
  );
}
```

Can't get smaller than this!

See it live:

{{< dartpad eddb6cdb56662bf037b1501b60c300da 70 500 >}}

### *Material-style* minimal app

```dart
// lib/main.dart

import 'package:flutter/material.dart';

main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(context) {
    return MaterialApp(
      home: Scaffold(
        body: Center(
          child: Text('Hello World'),
        ),
      ),
    );
  }
}
```

See it live:

{{< dartpad a8e34f01a4cdad18a8de100a865e30c1 70 500 >}}


### Minimal *stateful* app

```dart
import 'package:flutter/material.dart';

main() => runApp(MinimalStatefulApp());

class MinimalStatefulApp extends StatefulWidget {
  @override
  _MinimalState createState() => _MinimalState();
}

class _MinimalState extends State<MinimalStatefulApp> {

  int _counter = 0;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onDoubleTap: () => setState(() => _counter++),
      child: Center(
        child: Text(
          'Counter: $_counter',
          textDirection: TextDirection.ltr,
        ),
      ),
    );
  }
}
```

See it live (double tap to increment):

{{< dartpad 017aa3e4b7b0ea403de1942bb5fd0472 70 500 >}}


### Minimal *stateful* app (with `flutter_hooks`)

```dart
// lib/main.dart

import 'package:flutter/widgets.dart';
import 'package:flutter_hooks/flutter_hooks.dart';

main() => runApp(MyApp());

class MyApp extends HookWidget {
  @override
  Widget build(context) {
    final counter = useState(0);
    return GestureDetector(
      onDoubleTap: () => counter.value++,
      child: Center(
        child: Text(
          'Counter: ${counter.value}',
          textDirection: TextDirection.ltr,
        ),
      ),
    );
  }
}
```

It uses [hooks](https://pub.dev/packages/flutter_hooks) which remove the boilerplate of a classic `StatefulWidget`. Make sure you add the `flutter_hooks` dependency to `pubspec.yaml`!