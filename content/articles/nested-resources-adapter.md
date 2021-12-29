---
title: "Nested Resources Adapter"
date: 2021-12-09T23:17:30-03:00
draft: false
---

Here's how you could access nested resources such as: `/posts/1/comments`

```dart
mixin NestedURLAdapter on RemoteAdapter<Comment> {
  // ...
  @override
  String urlForFindAll(params) => '/posts/${params['postId']}/comments';

  // or even
  @override
  String urlForFindAll(params) {
    final postId = params['postId'];
    if (postId != null) {
      return '/posts/${params['postId']}/comments';
    }
    return super.urlForFindAll(params);
  }
}
```

and call it like:

```dart
final comments = await commentRepository.findAll(params: {'postId': post.id });
```

{{< contact >}}