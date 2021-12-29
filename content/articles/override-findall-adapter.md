---
title: "Override findAll Adapter"
date: 2021-12-09T23:14:28-03:00
---

In this example we completely override `findAll` to return random models:

```dart
mixin FindAllAdapter<T extends DataModel<T>> on RemoteAdapter<T> {
  @override
  Future<List<T>> findAll({
    bool? remote,
    Map<String, dynamic>? params,
    Map<String, String>? headers,
    bool? syncLocal,
    OnDataError<List<T>>? onError,
  }) async {
    // could use: super.findAll();
    return _generateRandomModels<T>();
  }
}
```

{{< contact >}}