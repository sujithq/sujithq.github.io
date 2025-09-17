+++
title = 'Mastering Asynchronous Programming with C# async/await - Part 4: Patterns with Async'
slug = 'csharp-async-await-part4'
date = '2025-10-08 06:00:00Z'
lastmod = '2025-10-08 06:00:00Z'
draft = true
tags = ["CSharp", "Async", "Await", "Programming", "DevOps", "Security"]
categories = ["DevSecOps"]
series = ["CSharp Async Await"]
[params]
    cover = true
    author = "sujith"
    cover_prompt = '''Part 4 patterns illustration: depict parallel tasks fan-out/fan-in, cancellation token stop icon, async stream flowing items, and timeout/retry loop.
Dark IDE style with structured lanes and minimal blue/teal/orange accents. Labels: Parallel, Cancel, Stream, Retry. Clean and instructional.'''
description = "Async patterns in CSharp: parallel fan-out, cancellation, async streams, timeouts and retries for resilient asynchronous workflows."
part = 4
+++

## Part 4: Patterns with Async

So far, we’ve looked at the basics and pitfalls of `async`/`await`. Now let’s move to **patterns** that help you handle real-world scenarios like parallelism, cancellation, streaming, and timeouts.

---

## Pattern 1: Running Tasks in Parallel

Sometimes you want to start multiple operations and wait for all of them.

```csharp
public async Task FetchInParallelAsync()
{
    var client = new HttpClient();

    var task1 = client.GetStringAsync("https://example.com/page1");
    var task2 = client.GetStringAsync("https://example.com/page2");

    var results = await Task.WhenAll(task1, task2);

    Console.WriteLine($"Page1 length: {results[0].Length}");
    Console.WriteLine($"Page2 length: {results[1].Length}");
}
```

✅ **Use `Task.WhenAll`** when you need *all* tasks to finish.  
✅ **Use `Task.WhenAny`** when you only care about the first result:

```csharp
var firstFinished = await Task.WhenAny(task1, task2);
Console.WriteLine(await firstFinished);
```

---

## Pattern 2: Cancelling Tasks

Long-running operations should be cancellable. Enter `CancellationToken`.

```csharp
public async Task DoWorkAsync(CancellationToken token)
{
    for (int i = 0; i < 10; i++)
    {
        token.ThrowIfCancellationRequested();
        Console.WriteLine($"Step {i}");
        await Task.Delay(500, token);
    }
}
```

Usage:

```csharp
var cts = new CancellationTokenSource();
var task = DoWorkAsync(cts.Token);

// Cancel after 2 seconds
cts.CancelAfter(TimeSpan.FromSeconds(2));

try
{
    await task;
}
catch (OperationCanceledException)
{
    Console.WriteLine("Task was cancelled.");
}
```

---

## Pattern 3: Async Streams

Introduced in C# 8, `IAsyncEnumerable<T>` lets you stream data asynchronously.

```csharp
public async IAsyncEnumerable<int> GetNumbersAsync()
{
    for (int i = 1; i <= 5; i++)
    {
        await Task.Delay(500); // simulate delay
        yield return i;
    }
}
```

Usage:

```csharp
await foreach (var number in GetNumbersAsync())
{
    Console.WriteLine(number);
}
```

This is great for processing **large data sets** or **network streams** without loading everything into memory.

---

## Pattern 4: Timeouts with `Task.Delay`

---

You can combine `Task.Delay` with `Task.WhenAny` to implement timeouts:

```csharp
public async Task<string> FetchWithTimeoutAsync(string url, int timeoutMs)
{
    var client = new HttpClient();
    var fetchTask = client.GetStringAsync(url);
    var timeoutTask = Task.Delay(timeoutMs);

    var finished = await Task.WhenAny(fetchTask, timeoutTask);

    if (finished == timeoutTask)
        throw new TimeoutException("The request timed out");

    return await fetchTask; // Safe to await now
}
```

---

## Bonus: Retry Pattern

Transient failures (like network hiccups) are common. A simple retry looks like this:

```csharp
public async Task<T> RetryAsync<T>(Func<Task<T>> operation, int maxRetries = 3)
{
    for (int i = 0; i < maxRetries; i++)
    {
        try
        {
            return await operation();
        }
        catch when (i < maxRetries - 1)
        {
            await Task.Delay(500); // backoff
        }
    }
    throw new Exception("Operation failed after retries.");
}
```

---

## Key Takeaways

- Use `Task.WhenAll`/`Task.WhenAny` for parallelism.  
- Always provide cancellation with `CancellationToken`.  
- Use `IAsyncEnumerable<T>` for streaming async data.  
- Combine `Task.Delay` with `Task.WhenAny` for timeouts.  
- Add retries for resilient systems.  

---

👉 In **Part 5**, we’ll look at **real-world use cases**:  

- Calling web APIs with `HttpClient`  
- File I/O with async streams  
- Database queries with EF Core  
- Keeping UIs responsive  

---

### Series Navigation

Previous: Part 3 – Pitfalls & Best Practices (Releases 2025-10-01)
Series Index: [Overview](/posts/2025/09/csharp-async-await/)
Next: Part 5 – Real-World Use Cases (Releases 2025-10-15)