---
date: "2020-02-12T13:43:48-05:00"
draft: false
title: "Deconstructing Dart Constructors"
author: Frank Treacy
versions: "1.12.13"
tags: ["dart"]
---

Ever confused by that mysterious syntax in Dart constructors? Colons, named parameters, asserts, factories...

Read this post and you will become an expert!

![Photo by Arseny Togulev on Unsplash](featured.jpg)

When we want an **instance** of a certain class we call a **constructor**, right?

```dart
var robot = new Robot();
```

In Dart 2 we can leave out the `new`:

```dart
var robot = Robot();
```

A constructor is used to ensure instances are created in a coherent state. This is the definition in a class:

```dart
class Robot {
  Robot();
}
```

This constructor has no arguments so we can leave it out and write:

```dart
class Robot {
}
```

The default constructor is implicitly defined.

{{< notice >}}
Did you know you can try out Dart and Flutter code in [DartPad](https://dartpad.dartlang.org/)?
{{< /notice >}}

## Initializing...

Most times we need to configure our instances. For example, pass in the height of a robot:

```dart
var r = Robot(5);
```

`r` is now a 5-feet tall `Robot`.

To write that constructor we include the `height` field after the colon `:`

```dart
class Robot {
  double height;
  Robot(height) : this.height = height;
}
```

or even

```dart
class Robot {
  double height;
  Robot(data) : this.height = data.physics.raw['heightInFt'];
}
```

This is called an **initializer**. It accepts a comma-separated list of expressions that initialize fields with arguments.

Fortunately, Dart gives us a shortcut. If the field name and type are the same as the argument in the constructor, we can do:

```dart
class Robot {
  double height;
  Robot(this.height);
}
```

Imagine that the `height` field is expressed in feet and we want clients to supply the height in meters. Dart also allows us to initialize fields with computations from static methods (as they don't depend on an _instance_ of the class):

```dart
class Robot {
  static mToFt(m) => m * 3.281;
  double height; // in ft
  Robot(height) : this.height = mToFt(height);
}
```

Sometimes we must call `super` constructors when initializing:

```dart
class Machine {
  String name;
  Machine(this.name);
}

class Robot extends Machine {
  static mToFt(m) => m * 3.281;
  double height;
  Robot(height, name) : this.height = mToFt(height), super(name);
}
```

Notice that `super(...)` must always be the last call in the initializer.

And if we needed to add more complex guards (than types) against a malformed robot, we can use `assert`:

```dart
class Robot {
  final double height;
  Robot(height) : this.height = height, assert(height > 4.2);
}
```

## Accessors and mutators

Back to our earlier robot definition:

```dart
class Robot {
  double height;
  Robot(this.height);
}

void main() {
  var r = Robot(5);
  print(r.height); // 5
}
```

Let's make it taller:

```dart
void main() {
  var r = Robot(5);
  r.height = 6;
  print(r.height); // 6
}
```

But robots don't grow, their height is constant! Let's prevent anyone from modifying the height by making the field **private**.

In Dart, there is no `private` keyword. Instead, we use a convention: field names starting with `_` are private (library-private, actually).

```dart
class Robot {
  double _height;
  Robot(this._height);
}
```

Great! But now there is no way to access `r.height`. We can make the `height` property read-only by adding a **getter**:

```dart
class Robot {
  double _height;
  Robot(this._height);

  get height {
    return this._height;
  }
}
```

Getters are functions that take no arguments and conform to the [uniform access principle](https://en.wikipedia.org/wiki/Uniform_access_principle).

We can simplify our getter by using two shortcuts: single expression syntax (fat arrow) and implicit `this`:

```dart
class Robot {
  double _height;
  Robot(this._height);

  get height => _height;
}
```

Actually, we can think of public fields as private fields with getters and setters. That is:

```dart
class Robot {
  double height;
  Robot(this.height);
}
```

is equivalent to:

```dart
class Robot {
  double _height;
  Robot(this._height);

  get height => _height;
  set height(value) => _height = value;
}
```

Keep in mind initializers only assign values to fields and it is therefore not possible to use a setter in an initializer:

```dart
class Robot {
  double _height;
  Robot(this.height); // ERROR: 'height' isn't a field in the enclosing class

  get height => _height;
  set height(value) => _height = value;
}
```

## Constructor bodies

![](https://media.giphy.com/media/iIAYEKtLy0yG7TacbC/giphy.gif)

If a setter needs to be called, we'll have to do that in a **constructor body**:

```dart
class Robot {
  double _height;

  Robot(h) {
    height = h;
  }

  get height => _height;
  set height(value) => _height = value;
}
```

We can do all sorts of things in constructor bodies, but we can't return a value!

```dart
class Robot {
  double height;
  Robot(this.height) {
    return this; // ERROR: Constructors can't return values
  }
}
```

## Final fields

**Final** fields are fields that can only be assigned once.

```dart
final r = Robot(5);
r = Robot(7); /* ERROR */
```

Inside our class, we won't be able to use the setter:

```dart
class Robot {
  final double _height;
  Robot(this._height);

  get height => _height;
  set height(value) => _height = value; // ERROR
}
```

{{< notice >}}
Just like with `var`, we can use `final` before any type definition:

```dart
var r;
var Robot r;

final r;
final Robot r;
```

{{< /notice >}}

The following won't work because `height`, being `final`, **must** be initialized. And initialization happens before the constructor body is run:

```dart
class Robot {
  final double height;

  Robot(double height) {
    this.height = height; // ERROR: The final variable 'height' must be initialized
  }
}
```

Let's fix it:

```dart
class Robot {
  final double height;
  Robot(this.height);
}
```

## Default values

If _most_ robots are 5-feet tall then we can avoid specifying the height each time. We can make an argument **optional** and provide a **default value**:

```dart
class Robot {
  final double height;
  Robot([this.height = 5]);
}
```

So we can just call:

```dart
void main() {
  var r = Robot();
  print(r.height); // 5

  var r2d2 = Robot(3.576);
  print(r2d2.height); // 3.576
}
```

![](https://media.giphy.com/media/l1KsGK43cTDF4VAsg/giphy.gif)

## Immutable robots

Our robots clearly have more attributes than a height. Let's add some more!

```dart
class Robot {
  final double height;
  final double weight;
  final String name;

  Robot(this.height, this.weight, this.name);
}

void main() {
  final r = Robot(5, 170, "Walter");
  r.name = "Steve"; // ERROR
}
```

As all fields are `final`, our robots are immutable! Once they are initialized, their attributes can't be changed.

Now let's imagine that robots respond to many different names:

```dart
class Robot {
  final double height;
  final double weight;
  final List<String> names;

  Robot(this.height, this.weight, this.names);
}

void main() {
  final r = Robot(5, 170, ["Walter"]);
  print(r.names..add("Steve")); // [Walter, Steve]
}
```

Dang, using a `List` made our robot mutable again!

We can solve this with a **`const` constructor**:

```dart
class Robot {
  final double height;
  final double weight;
  final List<String> names;

  const Robot(this.height, this.weight, this.names);
}

void main() {
  final r = const Robot(5, 170, ["Walter"]);
  print(r.names..add("Steve")); // ERROR: Unsupported operation: add
}
```

`const` can only be used with expressions that can be computed at compile time. Take the following example:

```dart
import 'dart:math';

class Robot {
  final double height;
  final double weight;
  final List<String> names;

  const Robot(this.height, this.weight, this.names);
}

void main() {
  final r = const Robot(5, 170, ["Walter", Random().nextDouble().toString()]); // ERROR: Invalid constant value
}
```

`const` instances are canonicalized which means that equal instances point to the same object in memory space when running.

For example this is a "cheap" operation:

```dart
void main() {
  [for(var i = 0; i < 20000; i += 1) Robot(5, 170, ["Walter"])];
}
```

And yes, using `const` constructors can improve performance in Flutter applications.

{{< middle-cta >}}

## Optional arguments always last!

If we wanted the `weight` argument to be **optional** we'd have to declare it at the end:

```dart
class Robot {
  final double height;
  final double weight;
  final List<String> names;

  const Robot(this.height, this.names, [this.weight = 170]);
}

void main() {
  final r = Robot(5, ["Walter"]);
  print(r.weight); // 170
}
```

## Naming things

Having to construct a robot like `Robot(5, ["Walter"])` is not very explicit.

Dart has named arguments! Naturally, they can be provided in any order and are all optional by default:

```dart
class Robot {
  final double height;
  final double weight;
  final List<String> names;

  Robot({ this.height, this.weight, this.names });
}

void main() {
  final r = Robot(height: 5, names: ["Walter"]);
  print(r.height); // 5
}
```

But we can annotate a field with `@required`:

```dart
class Robot {
  final double height;
  final double weight;
  final List<String> names;

  Robot({ this.height, @required this.weight, this.names });
}
```

(or use `assert(weight != null)` in the initializer for a runtime check!)

## Naming things with defaults

```dart
class Robot {
  final double height;
  final double weight;
  final List<String> names;

  Robot({ this.height = 7, this.weight = 100, this.names = const [] });
}

void main() {
  print(Robot().height); // 7
  print(Robot().weight); // 100
  print(Robot().names); // []
}
```

It's important to note that these default values **must be constant**!

Alternatively, we can use the [?? ("if-null") operator](/articles/checking-null-aware-operators-dart) in the assignment to provide any constant or static computation:

```dart
class Robot {
  final double height;
  final double weight;
  final List<String> names;

  Robot({ height, weight, this.names = const [] }) : height = height ?? 7, weight = weight ?? int.parse("100");
}

void main() {
  print(Robot().height); // 7
  print(Robot().weight); // 100
}
```

How about making the attributes private?

```dart
class Robot {
  final double _height;
  final double _weight;
  final List<String> _names;

  Robot({ this._height, this._weight, this._names }); // ERROR: Named optional parameters can't start with an underscore
}
```

It fails! Unlike with positional arguments, we need to specify the mappings in the initializer:

```dart
class Robot {
  final double _height;
  final double _weight;
  final List<String> _names;

  Robot({ height, weight, names }) : _height = height, _weight = weight, _names = names;

  get height => _height;
  get weight => _weight;
  get names => _names;
}

void main() {
  print(Robot(height: 5).height); // 5
}
```

## Mixing it up

Both positional and named argument styles can be used together:

```dart
class Robot {
  final double _height;
  final double _weight;
  final List<String> _names;

  Robot(height, { weight, names }) :
    _height = height,
    _weight = weight,
    _names = names;

  get height => _height;
  get weight => _weight;
}

void main() {
  var r = Robot(7, weight: 120);
  print(r.height); // 7
  print(r.weight); // 120
}
```

## Named constructors

Not only can arguments be named. We can give names to any number of constructors:

```dart
class Robot {
  final double height;
  Robot(this.height);

  Robot.fromPlanet(String planet) : height = (planet == 'geonosis') ? 2 : 7;
  Robot.copy(Robot other) : this(other.height);
}

void main() {
  print(Robot.copy(Robot(7)).height); // 7
  print(new Robot.fromPlanet('geonosis').height); // 2
  print(new Robot.fromPlanet('earth').height); // 7
}
```

What happened in `copy`? We used `this` to call the default constructor, effectively "redirecting" the instantiation.

(`new` is optional but I sometimes like to use it, since it clearly states the intent.)

Invoking named `super` constructors works as expected:

```dart
class Machine {
  String name;
  Machine();
  Machine.named(this.name);
}

class Robot extends Machine {
  final double height;
  Robot(this.height);

  Robot.named({ height, name }) : this.height = height, super.named(name);
}

void main() {
  print(Robot.named(height: 7, name: "Walter").name); // Walter
}
```

Note that named constructors require an unnamed constructor to be defined!

## Keeping it private

But what if we didn't want to expose a public constructor? Only `named`?

We can make a constructor private by prefixing it with an underscore:

```dart
class Robot {
  Robot._();
}
```

Applying this knowledge to our previous example:

```dart
class Machine {
  String name;
  Machine._();
  Machine.named(this.name);
}

class Robot extends Machine {
  final double height;
  Robot._(this.height, name) : super.named(name);

  Robot.named({ height, name }) : this._(height, name);
}

void main() {
  print(Robot.named(height: 7, name: "Walter").name); // Walter
}
```

The named constructor is "redirecting" to the private default constructor (which in turn delegates part of the creation to its `Machine` ancestor).

Consumers of this API only see `Robot.named()` as a way to get robot instances.

## A robot factory

![](https://media.giphy.com/media/12qq4Em3MVuwJW/giphy.gif)

We said constructors were not allowed to return. Guess what?

**Factory constructors** can!

```dart
class Robot {
  final double height;

  Robot._(this.height);

  factory Robot() {
    return Robot._(7);
  }
}

void main() {
  print(Robot().height); // 7
}
```

Factory constructors are syntactic sugar for the "factory pattern", usually implemented with `static` functions.

They appear like a constructor from the outside (useful for example to avoid breaking API contracts), but internally they can delegate instance creation invoking a "normal" constructor. This explains why factory constructors **do not** have initializers.

Since factory constructors can return other instances (so long as they satisfy the interface of the current class), we can do very useful things like:

- caching: conditionally returning existing objects (they might be expensive to create)
- subclasses: returning other instances such as subclasses

They work with both normal and named constructors!

Here's our robot warehouse, that only supplies one robot per height:

```dart
class Robot {
  final double height;

  static final _cache = <double, Robot>{};

  Robot._(this.height);

  factory Robot(height) {
    return _cache[height] ??= Robot._(height);
  }
}

void main() {
  final r1 = Robot(7);
  final r2 = Robot(7);
  final r3 = Robot(9);

  print(r1.height); // 7
  print(r2.height); // 7
  print(identical(r1, r2)); // true
  print(r3.height); // 9
  print(identical(r2, r3)); // false
}
```

Finally, to demonstrate how a factory would instantiate subclasses, let's create different robot brands that calculate prices as a function of height:

```dart
abstract class Robot {
  factory Robot(String brand) {
    if (brand == 'fanuc') return Fanuc(2);
    if (brand == 'yaskawa') return Yaskawa(9);
    if (brand == 'abb') return ABB(7);
    throw "no brand found";
  }
  double get price;
}

class Fanuc implements Robot {
  final double height;
  Fanuc(this.height);
  double get price => height * 2922.21;
}

class Yaskawa implements Robot {
  final double height;
  Yaskawa(this.height);
  double get price => height * 1315 + 8992;
}

class ABB implements Robot {
  final double height;
  ABB(this.height);
  double get price => height * 2900 - 7000;
}

void main() {
  try {
    print(Robot('fanuc').price); // 5844.42
    print(Robot('abb').price); // 13300
    print(Robot('flutter').price);
  } catch (err) {
    print(err); // no brand found
  }
}
```

## Singletons

Singletons are classes that only ever create one instance. We think of this as a specific case of caching!

Let's implement the singleton pattern in Dart:

```dart
class Robot {
  static final Robot _instance = new Robot._(7);
  final double height;

  factory Robot() {
    return _instance;
  }

  Robot._(this.height);
}

void main() {
  var r1 = Robot();
  var r2 = Robot();
  print(identical(r1, r2)); // true
  print(r1 == r2); // true
}
```

The factory constructor `Robot(height)` simply always returns the one and only instance that was created when loading the `Robot` class. (So in this case, I prefer not to use `new` before `Robot`.)
