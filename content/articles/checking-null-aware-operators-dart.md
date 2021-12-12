---
date: "2019-09-18"
draft: false
title: "Checking Nulls and Null-Aware Operators in Dart"
author: Frank Treacy
versions: "1.9.1"
tags: ["dart"]
---

What is the best practice for checking nulls in Dart?

```dart
var value = maybeSomeNumber();

if (value != null) {
  doSomething();
}
```

That's right. There is no shortcut like `if (value)` and truthy/falsey values in Javascript. Conditionals in Dart **only** accept `bool` values.

However! There are some very interesting null-aware operators.

## Default operator: `??`

In other languages we can use the logical-or shortcut. If `maybeSomeNumber()` returns null, assign a default value of `2`:

```ruby
value = maybeSomeNumber() || 2
```

In Dart we can't do this because the expression needs to be a boolean ("the operands of the `||` operator must be assignable to `bool`").

That's why the `??` operator exists:

```dart
var value = maybeSomeNumber() ?? 2;
```

Similarly, if we wanted to ensure a `value` argument was not-null we'd do:

```dart
value = value ?? 2;
```

But there's an even simpler way.

## Fallback assignment operator: `??=`

```dart
value ??= 2;
```

Much like Ruby's `||=`, it assigns a value if the variable is null.

Here's an example of a very concise cache-based [factory constructor](/articles/deconstructing-dart-constructors) using this operator:

```dart {hl_lines=[9]}
class Robot {
  final double height;

  static final _cache = <double, Robot>{};

  Robot._(this.height);

  factory Robot(height) {
    return _cache[height] ??= Robot._(height);
  }
}
```

More generally, `??=` is useful when defining computed properties:

```dart
get value => _value ??= _computeValue();
```

## Safe navigation operator: `?.`

Otherwise known as the Elvis operator. I first saw this in the Groovy language.

```groovy
def value = person?.address?.street?.value
```

If any of `person`, `address` or `street` are null, the whole expression returns null. Otherwise, `value` is called and returned.

In Dart it's exactly the same!

```dart
final value = person?.address?.street?.value;
```

If `address` was a method instead of a getter, it would work just the same:

```dart
final value = person?.getAddress()?.street?.value;
```

![groovy](https://media.giphy.com/media/1Bg8omsmc0ZXEsc67W/giphy.gif)

## Optional spread operator: `...?`

Lastly, this one only inserts a list into another only if it's not-null.

```dart
List<int> additionalZipCodes = [33110, 33121, 33320];
List<int> optionalZipCodes = fetchZipCodes();
final zips = [10001, ...additionalZipCodes, ...?optionalZipCodes];
print(zips);  /* [10001, 33110, 33121, 33320]  if fetchZipCodes() returns null */
```

## Tryin' it out

{{< dartpad 22cbcc98b8af3ea36f0f30faf4fe1ab8 70 300 >}}

## Non-nullable types

Right now, `null` can be assigned to any assignable variable.

There are plans to improve the Dart language and include NNBD ([non-nullable by default](https://github.com/dart-lang/language/issues/110)).

For a type to allow null values, a special syntax will be required.

The following will throw an error:

```dart
int value = someNumber();
value = null;
```

And fixed by specifying the `int?` type:

```dart
int? value = someNumber();
value = null;
```
