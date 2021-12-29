---
title: "Override findOne URL Adapter"
date: 2021-12-09T23:14:28-03:00
---

In this example we override URLs to hit finder endpoints with snake case, and for `save` to always use `HTTP PUT`:

```dart
mixin URLAdapter<T extends DataModel<T>> on RemoteAdapter<T> {
  @override
  String urlForFindAll(Map<String, dynamic> params) => type.snakeCase;

  @override
  String urlForFindOne(id, Map<String, dynamic> params) =>
      '${type.snakeCase}/$id';

  @override
  DataRequestMethod methodForSave(id, Map<String, dynamic> params) {
    return DataRequestMethod.PUT;
  }
}
```

{{< contact >}}