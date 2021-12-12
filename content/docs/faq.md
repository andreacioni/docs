---
title: "FAQ"
weight: 60
menu: docs
---

## Why are `save` and other methods not available on my models?

`DataModel` extensions are syntax sugar and will **only** work when importing Flutter Data:

```dart
import 'package:flutter_data/flutter_data.dart';
```

## Errors generating code?

If you have trouble with the outputs, try:

```bash
flutter pub run build_runner build --delete-conflicting-outputs
```

{{< notice >}}
**VSCode users!**

If after generating code you still see errors in your files, try reopening the project. This is not a Flutter Data issue.
{{< /notice >}}

Also make sure your dependencies are up to date:

```bash
flutter pub upgrade
```

## Can I group multiple adapter mixins into one?

No. https://stackoverflow.com/questions/59248686/how-to-group-mixins-in-dart

## Does Flutter Data depend on Flutter?

No! Despite its name this library does not depend on Flutter at all.

See the `example` folder for an, uh, example.

It does depend on [Riverpod](https://pub.dev/packages/riverpod) but this library is exported.

## Where does Flutter Data generate code?

- in `*.g.dart` files (part of your models)
- in `main.data.dart` (as a library)
