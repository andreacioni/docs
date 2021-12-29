---
title: Models
date: 2020-04-20T19:01:08-03:00
weight: 30
menu: docs
---

Flutter Data models are data classes that mix `DataModel` in:

```dart {hl_lines=[3]}
@DataRepository([TaskAdapter])
@JsonSerializable()
class Task with DataModel<Task> {
  @override
  final int? id;
  final String title;
  final bool completed;

  Task({this.id, required this.title, this.completed = false});
}
```

This enforces the implementation of the `id` getter. Use the type that better suits your data: `int?` and `String?` are the most common.

{{< notice >}}
The `json_serializable` library is helpful but not required.

- Model with `@JsonSerializable`? You don't need to declare `fromJson` or `toJson`
- Model without `@JsonSerializable`? You must declare `fromJson` and `toJson`

If you choose it, you can make use of `@JsonKey` and other configuration parameters as usual. A common use-case is having a different remote `id` attribute such as `_objectId`. Annotating `id` with `@JsonKey(name: '_objectId')` takes care of it.
{{< /notice >}}

## Extension methods

In addition, various useful methods become available on the class:

### init

The `init` call is necessary when using new models (and only then) in order to register them within Flutter Data. It takes a Riverpod `Reader` as sole argument, typically `ref.read` or `container.read`.

```dart
final user = User(id: 1, name: 'Frank').init(ref.read);
```

{{< notice >}}
**Important:** Any Dart file that wants to use these extensions **must import the library**!

```dart
import 'package:flutter_data/flutter_data.dart';
```

**VSCode protip!** Type `Command + .` over the missing method and choose to import!
{{< /notice >}}

### was

It `init`s a model copying the identity of supplied `model`.

Useful for model updates:

```dart
final steve = frank.copyWith(name: 'Steve').was(frank);
```

### save

```dart
final user = User(id: 1, name: 'Frank').init(ref.read);
await user.save();
```

The call is syntax-sugar for [Repository#save](/docs/repositories/#save) and takes the same arguments except the model: `remote`, `headers`, `params`, `onError`.

### delete

```dart
final user = await repository.findOne(1);
await user.delete();
```

It's syntax-sugar for [Repository#delete](/docs/repositories/#delete) and takes the same arguments (except the model).

Notice that `init` was not necessary here because the user already came from a repository.

### find

```dart
final updatedUser = await user.find();
```

It's syntax-sugar for [Repository#findOne](/docs/repositories/#findone) and takes the same arguments (except the ID).

## Freezed support

Here's an example:

```dart
@freezed
@DataRepository([JSONAPIAdapter, BaseAdapter])
class City with DataModel<City>, _$City {
  const City._();
  factory City({int id, String name}) = _City;
  factory City.fromJson(Map<String, dynamic> json) => _$CityFromJson(json);
}
```

Unions haven't been tested yet.

## Polymorphic models

An example where `Staff` and `Customer` are both `User`s:

```dart
abstract class User<T extends User<T>> with DataModel<T> {
  final String id;
  final String name;
  User({this.id, this.name});
}

@JsonSerializable()
@DataRepository([JSONAPIAdapter, BaseAdapter])
class Customer extends User<Customer> {
  final String abc;
  Customer({String id, String name, this.abc}) : super(id: id, name: name);
}

@JsonSerializable()
@DataRepository([JSONAPIAdapter, BaseAdapter])
class Staff extends User<Staff> {
  final String xyz;
  Staff({String id, String name, this.xyz}) : super(id: id, name: name);
}
```

{{< contact >}}