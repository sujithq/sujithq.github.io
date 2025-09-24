+++
title = 'Mastering Asynchronous Programming with C# async/await - Part 3: Common Pitfalls and Best Practices'
slug = 'csharp-async-await-part3'
date = '2025-10-01 06:00:00Z'
lastmod = '2025-10-01 06:00:00Z'
draft = true
tags = ["CSharp", "Async", "Await", "Programming", "DevOps", "Security"]
categories = ["DevSecOps"]
series = ["CSharp Async Await"]
layout = "single"
[params]
    cover = true
    author = "sujith"
    cover_prompt = '''Part 3 pitfalls illustration: highlight common async hazards.
Show warning icons next to: async void, blocking .Result/.Wait(), deadlock loop, and context capture bubble.
Include a ConfigureAwait(false) tag as a performance/clarity badge and an exception bubble with stack trace brackets.
Dark professional background; accent hazard colours (amber/red) sparingly with blue/teal core theme. Minimal, educational.'''
description = "Async pitfalls in CSharp: avoiding async void, blocking waits, deadlocks, context capture issues, and robust exception handling patterns."
part = 3
+++

## Part 3: Common Pitfalls & Best Practices

By now, you know how `async`/`await` works and how to run tasks sequentially or in parallel. But async programming in C# has some traps that can lead to **deadlocks, unhandled exceptions, or subtle bugs**.

Let’s go through the most common pitfalls and how to avoid them.

---

## Pitfall 1: `async void`

```csharp
public async void DoWork()
{
    await Task.Delay(1000);
    throw new Exception("Boom!");
}
```

Why it’s bad:

- You **can’t await** it → no way to know when it’s done.  
- Exceptions go directly to the **synchronization context** (e.g., crash the app).  

✅ **Best practice**:  

- Use `async Task` instead.  
- Only use `async void` for **event handlers** (where the signature is fixed).  

```csharp
public async Task DoWorkAsync()
{
    await Task.Delay(1000);
    throw new Exception("Handled safely!");
}
```

---

## Pitfall 2: Blocking Async Code

Mixing sync and async is dangerous:

```csharp
// BAD
var result = GetDataAsync().Result;

// BAD
GetDataAsync().Wait();
```

This can cause a **deadlock** in UI apps (WinForms/WPF/ASP.NET classic) because:

- The calling thread is blocked.  
- The async method tries to resume on that same thread → stuck forever.  

✅ **Best practice**:  

- Always `await` async methods.  
- If you really must call async code synchronously, use `.GetAwaiter().GetResult()` in console apps — but avoid it in production.

---

## Pitfall 3: Context Capture & `ConfigureAwait(false)`

By default, `await` captures the **synchronization context** (e.g., UI thread) to resume on it:

```csharp
await Task.Delay(1000);
// Resumes on the original context (UI thread in WPF/WinForms)
```

This is useful in UI apps but unnecessary in library or backend code. It can also hurt performance.

✅ **Best practice**:  
Use `ConfigureAwait(false)` in libraries or background services:

```csharp
await Task.Delay(1000).ConfigureAwait(false);
// Resumes on a thread pool thread, not necessarily the UI thread
```

---

## Pitfall 4: Exception Handling in Async Code

Async exceptions propagate naturally, but you need to `await` to catch them:

```csharp
try
{
    await DoWorkAsync();
}
catch (Exception ex)
{
    Console.WriteLine($"Caught: {ex.Message}");
}
```

But what if you run multiple tasks?

```csharp
var task1 = DoWorkAsync();
var task2 = DoWorkAsync();

await Task.WhenAll(task1, task2);
```

If both throw exceptions, `Task.WhenAll` aggregates them into an `AggregateException`.  

✅ **Best practice**:  

- Always wrap `await` in `try/catch` if you expect exceptions.  
- Inspect `task.Exception.InnerExceptions` when using `Task.WhenAll`.

---

## Pitfall 5: Fire-and-Forget Tasks

Sometimes devs write:

```csharp
DoWorkAsync(); // No await
Console.WriteLine("Moving on...");
```

If `DoWorkAsync` fails, you’ll never know — the exception is lost.

✅ **Best practice**:  

- Only fire-and-forget if you *really* don’t care about the result.  
- If you must, handle exceptions explicitly:

```csharp
_ = Task.Run(async () =>
{
    try
    {
        await DoWorkAsync();
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Fire-and-forget error: {ex.Message}");
    }
});
```

---

## Key Takeaways

- Avoid `async void` except for event handlers.  
- Don’t block async code with `.Result` or `.Wait()`.  
- Use `ConfigureAwait(false)` in libraries and services.  
- Always handle exceptions with `try/catch` or aggregate checks.  
- Be cautious with fire-and-forget tasks.  

---

👉 In **Part 4**, we’ll cover async **patterns**:  

- Running multiple tasks in parallel (`Task.WhenAll`, `Task.WhenAny`)  
- Cancelling tasks with `CancellationToken`  
- Async streams (`IAsyncEnumerable<T>`, `await foreach`)  
- Timeouts and retries  

---

### Series Navigation

Previous: [Part 2 – Deep Dive](/posts/2025/09/csharp-async-await-part2/)
Series Index: [Overview](/posts/2025/09/csharp-async-await/)
Next: Part 4 – Patterns (Releases 2025-10-08)