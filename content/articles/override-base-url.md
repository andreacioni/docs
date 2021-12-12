---
title: "Override Base URL Adapter"
date: 2021-12-03T18:45:45-03:00
---

Flutter Data is extended via [adapters](/docs/adapters).

```dart
mixin UserURLAdapter on RemoteAdapter<User> {
  @override
  String get baseUrl => 'https://my-json-server.typicode.com/flutterdata/demo';
}
```

Need to apply the adapter to all your models? Make it generic:

```dart
mixin UserURLAdapter<T extends DataModel<T>> on RemoteAdapter<T> {
  @override
  String get baseUrl => 'https://my-json-server.typicode.com/flutterdata/demo';
}
```
