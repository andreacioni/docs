---
title: "Adapters"
weight: 20
menu: docs
---

Flutter Data is extremely customizable and composable thanks to adapters, Flutter Data's building blocks.

Adapters are essentially Dart mixins applied on `RemoteAdapter<T>`.

## Overriding basic behavior

Several parts are required, for example, to construct a remote `findAll` call on a `Repository<Task>`. The framework can take a sensible guess and make that `GET /tasks` by default – and it does.

Still, a base URL is necessary and the endpoint parts should be overridable.

The way we use these adapters is by declaring them on our `@DataRepository` annotation in the corresponding model. For example:

```dart {hl_lines=[1 2 3 4 7]}
mixin JSONServerTaskAdapter on RemoteAdapter<Task> {
  @override
  String get baseUrl => 'https://myapi.com/v1/';
}

@JsonSerializable()
@DataRepository([JSONServerTaskAdapter])
class Task with DataModel<Task> {
  final int? id;
  final String title;
  final bool completed;

  Task({this.id, required this.title, this.completed = false});
}
```

What if the endpoint actually is at `https://myapi.com/v1/todos/all`?

```dart
mixin JSONServerTaskAdapter on RemoteAdapter<Task> {
  @override
  String get baseUrl => 'https://myapi.com/v1/';

  @override
  String urlForFindAll(Map<String, dynamic> params) => 'todos/all';
}
```

Here's a non-exhaustive list of overridable members:

- `baseUrl`: must be implemented or it will throw an error
- `urlForFindAll`: defaults to `type`
- `methodForFindAll`: defaults to `DataRequestMethod.GET`
- `urlForFindOne`: defaults to `${type}/${id}`
- `methodForFindOne`: defaults to `DataRequestMethod.GET`
- `urlForSave`: defaults to `${type}/${id}` if updating
- `methodForSave`: defaults to `DataRequestMethod.PATCH` if updating
- `urlForDelete`: defaults to `${type}/${id}`
- `methodForDelete`: defaults to `DataRequestMethod.DELETE`
- `shouldLoadRemoteAll`: fine-grained control over the `remote` param on `findAll`
- `shouldLoadRemoteOne`: fine-grained control over the `remote` param on `findOne`
- `serialize`: can customize serialization (like the [JSON API Adapter](https://github.com/flutterdata/flutter_data_json_api_adapter/) does)
- `deserialize`: can customize deserialization (like the [JSON API Adapter](https://github.com/flutterdata/flutter_data_json_api_adapter/) does)
- `isNetworkError`: whether to retry a request when back online
- `type`

Every adapter has a `type` field which by default is a pluralized, camel-cased version of the model class name: `Task -> tasks`, `Sheep -> sheep`, `CreditCard -> creditCards`.

It is typically used when the frontend and the backend name classes differently.

And if we have multiple models that all share the same base URL? Isn't the above adapter constrained to `Task`?

We can simply make it generic and apply it to any `DataModel` in our app!

```dart {hl_lines=[1 2 3 4 7]}
mixin JSONServerAdapter<T extends DataModel<T>> on RemoteAdapter<T> {
  @override
  String get baseUrl => 'https://myapi.com/v1/';
}

@JsonSerializable()
@DataRepository([JSONServerAdapter])
class User with DataModel<User> {
  final int? id;
  final String name;
  final String? email;

  Task({this.id, required this.name, this.email});
}
```

{{< notice >}}
**Important**: As the repository is generated, any change in the list of adapters **must** be followed by a build in order to take effect.

```bash
flutter pub run build_runner build
```

Trouble generating code? [See here](/cookbook/#errors-generating-code).
{{< /notice >}}

Any number of adapters can be added and they will be applied in order.

That is:

```dart
@DataRepository([A, B, C, D, E])
```

after codegen will become:

```dart
RemoteAdapter<User> with A, B, C, D, E;
```

## Custom actions

Not every API perfectly aligns to CRUD endpoints. Here's an example on how to create a custom action, using the `sendRequest` API.

```dart
mixin PaymentAdapter on RemoteAdapter<Payment> {
  Future<Payment?> createManualPayment({
    required String paymentType,
    required double amount,
  }) async {
    final appConfig = read(appConfigProvider).instance;

    final payload = {
      'payment': {
        'app_id': appConfig.appId,
        'amount': amount,
        'name': paymentType,
        'provider': 'manual'
      },
    };

    return sendRequest(
      baseUrl.asUri / 'payments.json' & {'v': true},
      method: DataRequestMethod.POST,
      headers: await defaultHeaders & {'X-Client-Id': appConfig.appId},
      body: json.encode(payload),
      onSuccess: (data) {
        return deserialize(data as Map<String, dynamic>).model;
      },
    );
  }
}
```

Notice that a Riverpod `Reader` is available on every adapter as `read`, too.

The `createManualPayment` action can be invoked like:

```dart
onPressed: () async {
  final payment = await ref.payments.paymentAdapter.createManualPayment(
    paymentType: PaymentType.LIGHTNING_NETWORK,
    amount: amount,
  );
  // ...
}
```

{{< notice >}}
This is the signature for the `sendRequest` method, that performs an HTTP request and returns the result of type `R` via `onSuccess`:

```dart
FutureOr<R?> sendRequest<R>(
  final Uri uri, {
  DataRequestMethod method = DataRequestMethod.GET,
  Map<String, String>? headers,
  String? body,
  String? key,
  OnRawData<R>? onSuccess,
  OnDataError<R>? onError,
  DataRequestType requestType = DataRequestType.adhoc,
  bool omitDefaultParams = false,
})
```

- `uri` takes the full `Uri` (you must provider base URL and query parameters, too)
- `headers` takes the full headers (or `defaultHeaders` if omitted)

{{< /notice >}}

With all these building blocks adapters for Wordpress or Github REST access, or even JWT authentication are easy to build.

**Many more adapter examples can be found perusing the [articles](/articles).**

{{< contact >}}