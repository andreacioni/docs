---
title: "Iterator Style Adapter"
date: 2021-12-09T23:13:36-03:00
---

```dart
mixin AppointmentAdapter on RemoteAdapter<Appointment> {
  Future<Appointment?> fetchNext() async {
    return await sendRequest(
      baseUrl.asUri / type / 'next',
      onSuccess: (data) => deserialize(data).model,
    );
  }
}
```

Using `sendRequest` we have both fine-grained control over our request while leveraging existing adapter features such as `type`, `baseUrl`, `deserialize` and any other customizations.

Adapters are applied on `RemoteAdapter` but Flutter Data will automatically create shortcuts to call these custom methods.

```dart
final nextAppointment = await appointmentRepository.appointmentAdapter.fetchNext();
```
