---
title: "Custom Deserialization Adapter"
date: 2021-12-09T23:15:44-03:00
---

Example:

```dart
mixin AuthAdapter on RemoteAdapter<User> {
  Future<String> login(String email, String password) async {
    return sendRequest(
      baseUrl.asUri / 'token',
      method: DataRequestMethod.POST,
      body: json.encode({'email': email, 'password': password}),
      onSuccess: (data) => data['token'] as String,
    );
  }
}
```

and use it:

```dart
final token = await userRepository.authAdapter.login('e@mail, p*ssword');
```

Also see [JSONAPIAdapter](https://github.com/flutterdata/flutter_data_json_api_adapter/) for inspiration.
