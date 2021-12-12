---
date: "2019-10-15T13:43:48-05:00"
draft: false
title: "The Ultimate Javascript vs Dart Syntax Guide"
author: Frank Treacy
versions: "1.9.1"
tags: ["dart", "javascript", "es6"]
---

![Photo by ipet photo on Unsplash](featured.jpg)

Nowadays, Dart is almost only used in the context of Flutter. This guide is exclusively focused in comparing Javascript and Dart's syntax.

(Pros and cons of choosing Flutter/Dart is outside the scope of this article.)

So if you have a JS background and want to build apps with this awesome framework, read on. **Let’s see how these two puppies fair against each other!**

## Variables and constants

```js
// js

var dog1 = "Lucy"; // variable
let dog2 = "Milo"; // block scoped variable

const maleDogs = ["Max", "Bella"]; // mutable single-assignment variable
maleDogs.push("Cooper"); // ✅
maleDogs = ["Cooper"]; // ❌

const femaleDogs = Object.freeze(["Luna", "Bella"]); // runtime constant
femaleDogs.push("Winona"); // ❌
femaleDogs = ["Winona"]; // ❌
```

And now in Dart:

```dart
// dart

main() {
  var dog1 = "Max"; // variable

  final maleDogs = ["Milo"]; // mutable single-assignment variable
  maleDogs.add("Cooper"); // ✅
  maleDogs = ["Cooper"]; // ❌

  const femaleDogs = ["Luna", "Bella"]; // compile time constant
  femaleDogs.add("Winona"); // ❌
  femaleDogs = ["Winona"]; // ❌

  // alternative const syntax without assignment
  walkingTimes(const [7, 9, 11]);  // ✅
  walkingTimes(const [DateTime.now()]);  // ❌
}
```

Unlike Javascript, `const` in Dart lives up to its meaning. The whole object is checked at compile time to ensure it's completely immutable.

Therefore any element inside `femaleDogs` has to be a `const` too. Not the case for the elements inside `maleDogs`, which are _not necessarily_ `final`.

Dart doesn't need `let` because lexical scope works correctly.

Trailing semicolons are required in Dart. In Javascript you can omit the `;` (you have to be careful, though!)

## Default assignment

Let's set a default value of 1 if `bones` is _falsey_ (in Javascript) or `null` (in Dart).

```js
// js

var bones;
bones = bones || 1;
console.log(bones); // 1
```

```dart
// dart

main() {
  var bones;
  bones ??= 1;  // OR: bones = bones ?? 1
  print(bones);  // 1
}
```

## Destructuring assignment

This is a great Javascript-only feature.

```js
// js

var [dog, owner] = ["Max", "Frank"];
console.log(dog); // Max
[owner, dog] = [dog, owner];
console.log(dog); // Frank
```

**Not** possible in Dart [yet](https://github.com/dart-lang/language/issues/207).

## Falsey vs null

Let's go ahead and have a look at _falsey_ values that only exist in Javascript.

```js
// js

var collar = false,
  toys = null,
  amountOfMeals = 0 / 0, // NaN
  owner = "",
  age = 0,
  breed;

if (!collar) console.log("bark"); // bark
if (!toys) console.log("bark"); // bark
if (!amountOfMeals) console.log("bark"); // bark
if (!owner) console.log("bark"); // bark
if (!age) console.log("bark"); // bark
if (!breed) console.log("bark"); // bark
```

In Dart, undefined values are `null`. Expressions in conditionals may only be boolean.

```dart
// dart

main() {
  var collar = false,
    toys = null,
    amountOfMeals = 0 / 0, // NaN
    owner = "",
    age = 0,
    breed;

  if (!collar) print('bark'); // bark
  if (toys == null) print('bark'); // bark
  if (amountOfMeals.isNaN) print('bark'); // bark
  if (owner.isEmpty) print('bark'); // bark
  if (age == 0) print('bark'); // bark
  if (breed == null) print('bark'); // bark
}
```

In Dart, `'Rocky' - 2` is an error – not `NaN` 🤔 Fortunately Dart didn't pick up Javascript's 💩

## Function literals

```js
// js

function bark() {
  return "WOOF";
}

var bday = (age) => age + 1;
```

```dart
// dart

bark() {
  return "WOOF";
}

var bday = (age) => age + 1;
```

One-liner function syntax looks exactly the same in both languages! In JS, however, parenthesis are optional.

## Function defaults

```js
// js

var greet = (name = "Milo") => `Woof! My name is ${name}`;
console.log(greet()); // Woof! My name is Milo
```

```dart
// dart

main() {
  var greet = ({ name = 'Rocky' }) => "Woof! My name is ${name}";
  print(greet());  // Woof! My name is Rocky
}
```

Dart requires curly braces for optional arguments. String interpolation is practically the same.

## Spreading arguments

```js
// js

const sum = (...meals) => meals.reduce((sum, next) => sum + next, 0);
console.log(sum(1, 2, 3)); // 6
```

**Not** supported because a Dart function can't have a variable amount of positional arguments. The alternative is simply:

```dart
// dart

main() {
  final sum = (List<int> meals) => meals.reduce((sum, next) => sum + next);
  print(sum([1, 2, 3])); // 6
}
```

## Safe navigation

`name` should be returned unless `address` or `street` are `null`, in that case the whole expression should return `null`.

```js
// js
var name =
  person.address || person.address.street || person.address.street.name;
```

In Dart we have the safe navigation operator:

```dart
// dart
var name = address?.street?.name;
```

{{< notice >}}
Interested in Dart's amazing capabilities to deal with nulls? Read [Checking Nulls and Null-Aware Operators in Dart](/articles/checking-null-aware-operators-dart).
{{< /notice >}}

## Collection literals

An `Array` in Javascript is a `List` in Dart. An `Object` in Javascript is a `Map` in Dart.

```js
// js

var dogArray = ["Lucy", "Cooper", "Zeus"];
var dogObj = { first: "Lucy", second: "Cooper" };
var dogSet = new Set(["Lucy", "Cooper", "Zeus"]);

console.log(dogArray.length); // 3
console.log(Object.keys(dogObj).length); // 2
console.log(dogSet.size); // 3
```

```dart
// dart

main() {
  var dogList = ["Lucy", "Cooper", "Zeus"];
  var dogMap = { 'first': "Lucy", 'second': "Cooper" }; // could use #first symbol instead
  var dogSet = { "Lucy", "Cooper", "Zeus" };

  print(dogList.length); // 3
  print(dogMap.length); // 2
  print(dogSet.length); // 3
}
```

## Cascade operator

The value of the `array.push(element)` expression is always the value of `push(element)`. This is standard behavior.

In Javascript, the array `push` function returns the length of the array (go figure!). So we can't possibly have `console.log([1, 2, 3].push(4, 5))` result in `[1, 2, 3, 4, 5]`.

```js
// js

var parks = [1, 2, 3];
parks.push(4, 5);
console.log(parks); // [1, 2, 3, 4, 5]

var shelters = [1, 2, 3];
shelters[1] = 4;
shelters[2] = 5;
console.log(shelters); // [1, 4, 5]
```

In Dart we have the cascade operator `list..add()`, which allows us to return the list.

```dart
// dart

main() {
  print([1, 2, 3]..add(4)..add(5));  // [1, 2, 3, 4, 5]
  print([1, 2, 3]..[1]=4..[2]=5);  // [1, 4, 5]
}
```

A _fluent API_ is one that allows chaining. jQuery is a great example: `$('a').css("underline", "none").html("link!");` as every jQuery function call returns `this`.

This approach greatly reduces intermediate variables. However, not all APIs are designed this way. The cascade operator allows us to take a regular API and turn it into a _fluid API_, like what we did above with the list.

![](https://media.giphy.com/media/JOUbijCxtRDdS/giphy.gif)

## Array concatenation

```js
// js

var parks = [1, 2, 3];
parks = parks.concat([4, 5], [6, 7]);
console.log(parks); // [1, 2, 3, 4, 5, 6, 7]
```

To push or concatenate other arrays we can use `addAll` in the same fashion:

```dart
// dart

main() {
  print([1, 2, 3]..addAll([4, 5])..addAll([6, 7])); // [1, 2, 3, 4, 5, 6, 7]
}
```

But there's a cleaner way! Using spreads...

```js
// js

console.log([1, 2, 3, ...[4, 5], ...[6, 7]]); // [1, 2, 3, 4, 5, 6, 7]
```

```dart
// dart

main() {
  print([1, 2, 3, ...[4, 5], ...[6, 7]]); // [1, 2, 3, 4, 5, 6, 7]
}
```

Same same. Also for objects/maps:

```js
// js

const name = { name: "Luna" };
const age = { age: 7 };
console.log({ ...name, ...age }); // { name: "Luna", age: 7 }
```

(Notice that we have to use `let` or `const` in Javascript.)

```dart
// dart

main() {
  var name = { 'name': "Luna" };
  var age = { 'age': 7 };
  print({ ...name, ...age });  // { 'name': "Luna", 'age': 7 }
}
```

But what if `P2` has a value _sometimes_?

```js
// js

const P1 = [4, 5];
var P2 = Math.random() < 0.5 ? [6, 7] : null;

P2 = P2 || [];
console.log([1, 2, 3, ...P1, ...P2]); // [1, 2, 3, 4, 5] or [1, 2, 3, 4, 5, 6, 7]
```

```dart
// dart

import 'dart:math';

const P1 = [4, 5];
final P2 = Random().nextBool() ? [6, 7] : null;

main() {
  print([1, 2, 3, ...P1, ...?P2]); // [1, 2, 3, 4, 5] or [1, 2, 3, 4, 5, 6, 7]
}
```

The optional spread operator `...?` will only insert the array if it's not null.

Let's consider now this example:

```js
const A = 2;

var ages = [1];
if (Math.random() < 0.5) {
  ages.push(A);
}
console.log(ages); // [1] or [1, 2]
```

There is yet another way in Dart of including logic inside arrays:

```dart
import 'dart:math';
const A = 2;

main() {
  print([1, if (Random().nextBool()) A]);  // [1] or [1, 2]
}
```

It's called a "collection-if". There's also "collection-for":

```dart
main() {
  var ages = [1, 2, 3];
  print([
    1,
    for(int i in ages) i + 1,
    5
  ]);  // [1, 2, 3, 4, 5]
}
```

Extremely elegant! I can't really think of a Javascript equivalent 🤔

## Accessing properties in objects/maps

```js
// js

var first = { age: 7 };
console.log(first.age); // 7
```

```dart
// dart

main() {
  var first = { 'age': 7 };
  print(first['age']);  // 7
}
```

{{< middle-cta >}}

## Imports and exports

```js
// js

// module file
export const dog = "Luna";

export default function clean(dog) {
  return doCleaning(dog);
}

// import
import { dog } from "module";

import clean from "module";
```

Dart, on the other hand, does not need to specify the imports: everything is imported by default. Imports can have prefixes (`as`) and can "whitelist" (`show`) and "blacklist" (`hide`). Ultimately, through static analysis and tree-shaking, whatever is not used will be discarded.

```dart
// dart

// module file
final dog = "Luna";

clean(dog) => _doCleaning(dog);

// import
import 'module.dart';

// alternatively
import 'module.dart' as module;
```

## The Great Dane in the Room

![](https://media.giphy.com/media/tNuoOEz7cigvK/giphy.gif)

Dart is a **statically-typed language** with strong type inference.

{{< notice >}}
A comparison with [Typescript](http://www.typescriptlang.org/) would probably be fairer, but I'll leave that for next time. 😄
{{< /notice >}}

As we've seen so far, we almost never need to declare type annotations:

```dart
// dart

main() {
  var age = 1;
  var pets = ["Cooper", "Luna"];
  print(age.runtimeType); // int
  print(pets.runtimeType); // Array<String>
}
```

This means we leverage the power of types without stuffing our code with declarations! But of course we may:

```dart
// dart

main() {
  int age = 5;
  List<String> pets = ["Cooper", "Luna"];
  var pets2 = <String>["Cooper", "Luna"];
  List<String> pets3 = <String>["Cooper", "Luna"];
}
```

Specifying types can bring clarity to code. In our example above declarations are redundant (especially `pets3`).

Imagine a `walk` method with no typed arguments, assuming callers will pass an argument of type `Distance`:

```dart
// dart

walk(distance) {
  print('Walking ${distance.length} miles');
}

main() {
  print(walk("86"));  // 2
  print(walk(86)); // ERROR
  // ...
}
```

Gives all kind of weird behavior. The analyzer doesn't have enough information to infer a specific type for `distance` so it uses the `dynamic` type. It's equivalent to:

```dart
walk(dynamic distance) {
  print('Walking ${distance.length} miles');
}
```

In short: **argument types are very important!**

This is recommended, idiomatic Dart:

```dart
void walk(Distance distance) {
  print('Walking ${distance.length} miles');
}

String walk(int distance) => 'Walking $distance miles';
```

Type checking, however, can be explicitly "turned off" at a variable-level by declaring it as `dynamic`.

```dart
main() {
  dynamic dog = "Charlie";
  dog = ["char", "lie"];  // compiler NOT type checking!
  print(dog); // [char, lie]
}
```

## Object oriented breeds 🐩

Classes are relatively new in Javascript:

```js
// js

class Dog {
  constructor(name, phone) {
    this.name = name;
    this.phone = phone;
  }

  tag = () => `${this.name}\nIf you found me please call ${this.phone}!`;
}

console.log(new Dog("Luna", 6198887421).tag());
// Luna
// If you found me please call 6198887421!
```

In Dart:

```dart
// dart

class Dog {
  final String name;
  final int phone;
  Dog(this.name, { this.phone });

  String tag() => "${name}\nIf you found me please call ${phone}!";
}

main() {
  print(Dog('Luna', phone: 6198887421).tag());
  // Luna
  // If you found me please call 6198887421!
}
```

A few things to note about Dart classes & constructors!

- We can avoid using `new` when calling constructors – that is why I used `Dog()` (vs `new Dog()`)
- No need to use `this` to reference fields: it is only used to define constructors
- Factory and named constructors are a thing
- Dart supports mixins!

{{< notice >}}
Wanna know EVERYTHING about Dart constructors? Check out [Deconstructing Dart Constructors](/articles/deconstructing-dart-constructors).
{{< /notice >}}

## Checking types

We use `instanceof` in Javascript:

```js
// js

class Dog extends Animal {
  // ...
}

var animal = getAnimal();
if (animal instanceof Dog) {
  console.log("🐶");
}
```

And `is` in Dart:

```dart
// dart

class Dog extends Animal {
  // ...
}

main() {
  var animal = getAnimal();
  if (animal is Dog) {
    console.log('🐶');
  }
}
```

## Class & prototype extensions

These are methods that extend existing types. In Javascript a function can be added to a prototype:

```js
// js

Object.defineProperties(String.prototype, {
  kebab: {
    get: function () {
      return this.replace(/\s+/g, "-").toLowerCase();
    },
  },
});

console.log("This is Luna".kebab); // this-is-luna
```

In Dart:

```dart
// dart

extension on String {
  String get kebab => this.replaceAll(RegExp(r'\s+'), '-').toLowerCase();
}

main() {
  print("This is Luna".kebab);   // this-is-luna
}
```

Static extension members are available since Dart 2.6 and open up very interesting possibilities for API design, like the fantastic [time.dart](https://github.com/jogboms/time.dart) ⏰. Now we can do stuff like:

```dart
Duration timeOfSleep = 7.hours + 32.minutes + 8.seconds;
DateTime medicated = 5.minutes.ago;
```

## Parsing JSON 🐶 style

```js
// js

var dog = JSON.parse(
  '{ "name": "Willy", "medications": { "doxycycline": true } }'
);

console.log(Object.keys(dog.medications).lnegth); // undefined
```

Javascript is a dynamic language. Misspelling `length` just returns `undefined`.

{{< notice >}}
Checking for an empty list is easy in Dart: `list.isEmpty`, in Javascript we must use the length for this: `!array.length`.
{{< /notice >}}

In Dart:

```dart
// dart

import 'dart:convert';

main() {
  var dog = jsonDecode('{ "name": "Willy", "medications": { "doxycycline": true } }');
  print(dog.runtimeType); // _InternalLinkedHashMap<String, dynamic>
  print(dog['medications'].lnegth);  // NoSuchMethodError: Class '_InternalLinkedHashMap<String, dynamic>' has no instance getter 'lnegth'.
}
```

It is known that keys of a JSON object are strings, but values can be of many different types. Hence the resulting map is of type `<String, dynamic>`.

When we misspell `length` on a `dynamic` variable there is no type checking, so the error we get is at runtime.

## Equality to the bone 🦴

Another gigantic chaos in the world of Javascript. We won't get into it – just say that for equality we _only_ use `===` to tell if both objects are strictly the same.

If we need to verify equivalence of two different objects, we'd use a deep comparison like `_.isEqual` in Lodash.

```js
// js

class DogTag {
  constructor(id) {
    this.id = id;
  }
}

var tag1 = new DogTag(9);
var tag2 = new DogTag(9);

console.log(_.isEqual(tag1, tag2)); // true (same ID, same tag)
console.log(tag1 === tag2); // false (not the same object in memory)
```

In Dart, `===` is `identical` and `isEqual` is `==`. You can override the `==` operator to check for equality between two objects 🙌

```dart
// dart

class DogTag {
  int id;
  DogTag(this.id);
  operator ==(other) => this.id == other.id;
}

main() {
  var tag1 = DogTag(9);
  var tag2 = DogTag(9);

  print(tag1 == tag2);  // true (same ID, same tag)
  print(identical(tag1, tag2));  // false (not the same object in memory)
}
```

![](https://media.giphy.com/media/pXHeBVPUTiMO4/giphy.gif)

## Doggy privates

While a solution is being worked on for ESNext, there is currently no proper way of defining private properties in Javascript.

Dart uses a `_` prefix which makes the variable private. And we can use a standard getter to expose it to the outside world:

```dart
// dart

class Dog {
  String name;
  int _age;

  Dog(this.name, this._age);

  get age => _age;
}

main() {
  var zeus = new Dog("Zeus", 7);
  print(zeus.age);  // 7

  zeus.age = 8; // ERROR: No setter named 'age' in class 'Dog'
  zeus._age = 8;
  print(zeus.age); // 8
}
```

Makes sense?

Uhhmmm... we are setting the private variable and it actually works? 🤔

Private in Dart means _library-private_. If we placed the `Dog` class in `models.dart`:

```dart
// dart

import 'models.dart';

main() {
  var zeus = new Dog("Zeus", 7);
  print(zeus.age);  // 7

  zeus.age = 8; // ERROR: No setter named 'age' in class 'Dog'
  zeus._age = 8; // ERROR: The setter '_age' isn't defined for the class 'Dog'.
  print(zeus.age); // 7
}
```

Setters work in a similar way.

## Futuristic hounds 🐕

The `Promise` API in Javascript is analogous to the `Future` API in Dart.

Both languages support `then()` and `async/await`.

Let's appreciate the differences through a food dispenser that will pour out dog chow in 4 seconds.

```js
// js

function dispenseFood() {
  return new Promise((resolve) => setTimeout(resolve, 4000)).then(
    () => "DOG CHOW"
  );
}

async function main() {
  console.log("Idle.");
  var food = await dispenseFood();
  console.log(food); // DOG CHOW
}

main();

// or
dispenseFood().then(console.log); // .catch();
```

Very similar in Dart:

```dart
// dart

Future<String> dispenseFood() {
  return Future.delayed(Duration(seconds: 4), () => 'DOG CHOW');
}

main() async {
  print('Idle.');
  String food = await dispenseFood();
  print(food);  // DOG CHOW

  // or
  dispenseFood().then(print);  // .catchError();
}
```

## Is this really the definitive syntax guide?

Well... maybe 🤪 Pending for a next revision:

- Enums
- Annotations
- Streams & sync/async generators
- Workers vs isolates
- and more!

As you may have noticed we simply highlighted differences between syntaxes. Not comparing their merits, popularity, available libraries, and many other considerations. There will be another opinionated article discussing which is the best tool for which job.
