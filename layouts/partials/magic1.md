#### Understanding the magic ✨

**How exactly does Flutter Data resolve the `http://base.url/tasks` URL?**

Flutter Data [adapters](/docs/adapters) define functions and getters such as `urlForFindAll`, `baseUrl` and `type` among many others.

In this case, `findAll` will fetch data from `baseUrl` + `urlForFindAll` (which defaults to `type`, and `type` defaults to `tasks`).

Result? `http://base.url/tasks`.

**And, how exactly does Flutter Data instantiate `Task` models?**

Flutter Data ships with a built-in serializer/deserializer for [classic JSON](https://api.rubyonrails.org/classes/ActiveModel/Serializers/JSON.html). It means that the default serialized form of a `Task` instance looks like:

```json
{
  "id": 1,
  "title": "delectus aut autem",
  "completed": false
}
```

Of course, this too can be overridden like the [JSON API Adapter](https://github.com/flutterdata/flutter_data_json_api_adapter/) does.