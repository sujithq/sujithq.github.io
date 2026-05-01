+++
title = '🎨 SkiaSharp 4.0 Preview 1 is Here'
slug = 'skiasharp-40-preview1'
date = '2026-05-01 08:00:00Z'
lastmod = '2026-05-01 08:00:00Z'
draft = true
tags = [
  ".NET",
  "CSharp",
  "SkiaSharp",
  "Graphics",
  "MAUI",
  "Cross-Platform",
  "NuGet"
]
categories = [
  ".NET Development",
  "Graphics",
  "Updates"
]
series = []

layout = "single"
[params]
    cover = true
    author = "sujith"
    cover_prompt = '''A clean, modern technical illustration for a blog post about SkiaSharp 4.0 Preview 1, the .NET binding for Google's Skia 2D graphics engine.
    Show a central rendering pipeline metaphor: a stylised canvas frame on the left feeding into a processing node (labelled SKCanvas) that fans out to platform targets (Android, iOS, Windows, WASM, Linux) represented by geometric platform shapes on the right.
    Include a version badge showing 4.0, a small Native AOT chip icon, and abstract 2D vector paths and bezier curves floating in the background as subtle decorative elements.
    Use a professional dark background with blue, teal, and white as primary colours, thin geometric grid lines, and a futuristic enterprise-ready aesthetic.
    No text overlays beyond concise labels, no real logos, no visual clutter.'''

description = "SkiaSharp 4.0 Preview 1 delivers a modernised API, updated Skia binaries, Native AOT support, and breaking changes. Here is what you need to know."
+++

SkiaSharp 4.0 Preview 1 is the first major version release of the popular .NET binding for Google's
[Skia graphics library](https://skia.org/) in several years. It arrives with a modernised API surface,
updated native binaries, improved Native AOT compatibility, and a set of intentional breaking changes
that clean up long-standing deprecations from the 2.x series.

If you use SkiaSharp in a .NET MAUI, Uno Platform, Blazor WASM, or any other .NET project that does
2D rendering, this release is worth your attention now, while it is still a preview and you have time
to plan your migration.

## What is SkiaSharp?

SkiaSharp is the .NET wrapper around [Google Skia](https://skia.org/), the same 2D graphics engine
that powers Chrome, Android, Flutter, and Firefox. It exposes a rich set of APIs for drawing shapes,
text, images, paths, shaders, and effects across all major platforms from a single C# codebase.

It is maintained by Microsoft and is a core dependency in:

- .NET MAUI (and Xamarin.Forms before it)
- Uno Platform
- Avalonia UI
- LiveCharts2
- Telerik UI for .NET MAUI

## What is new in 4.0 Preview 1

### Updated Skia native binaries

The underlying native Skia library has been updated to a recent milestone build. This brings in
several years of upstream improvements including:

- Faster path rasterisation and anti-aliasing
- Improved colour management and wide-gamut colour space support
- Better shader compilation performance
- Updated PDF and SVG rendering fidelity

### Native AOT and trimming support

One of the headline investments in 4.0 is first-class support for .NET Native AOT compilation and
aggressive trimming. Previous SkiaSharp releases had limitations that made AOT-published applications
either fail or require significant workarounds.

Version 4.0 ships with:

- Trim-compatible annotations across the public API
- AOT-safe native interop that avoids runtime reflection
- Verified compatibility with `dotnet publish -p:PublishAot=true`

This is significant for MAUI workloads where binary size and startup time matter, and especially for
Blazor WASM deployments where every kilobyte counts.

### Modernised .NET targeting

SkiaSharp 4.0 targets .NET 8 and .NET 9 as its primary runtimes. .NET Standard 2.0 support is no
longer a first-class concern, which allows the library to take advantage of modern runtime APIs and
reduces compatibility shims throughout the codebase.

Supported targets in Preview 1 include:

- .NET 8 and .NET 9 (Windows, macOS, Linux)
- .NET for Android
- .NET for iOS, tvOS, and Mac Catalyst
- WASM (Blazor and emscripten)
- Tizen

### Cleaned-up API surface

The team has removed a large number of deprecated APIs that were marked as obsolete in SkiaSharp 2.x.
The most impactful change is the **text rendering API overhaul**.

In SkiaSharp 2.x, text drawing was migrated from `SKPaint`-centric to `SKFont`-centric. The old
`SKPaint` properties for text metrics (`TextSize`, `Typeface`, `TextEncoding`, etc.) were deprecated
but kept for backwards compatibility. In 4.0, those properties are removed.

**Before (2.x style, now removed):**

```csharp
using var paint = new SKPaint
{
    Color = SKColors.Black,
    TextSize = 24,
    Typeface = SKTypeface.FromFamilyName("Arial"),
    IsAntialias = true
};

canvas.DrawText("Hello, SkiaSharp!", x, y, paint);
```

**After (4.0 style):**

```csharp
using var font = new SKFont(SKTypeface.FromFamilyName("Arial"), size: 24);
using var paint = new SKPaint { Color = SKColors.Black, IsAntialias = true };

canvas.DrawText("Hello, SkiaSharp!", x, y, font, paint);
```

The `SKFont` type is now the sole owner of font metrics and shaping decisions. `SKPaint` retains its
role for colour, blending, and visual styling but is no longer involved in font selection or text
measurement.

### SKRuntimeEffect improvements

`SKRuntimeEffect` (the SkSL shader API) has been updated to align with the upstream Skia shader
language changes. If you write custom shaders, review the
[SkSL documentation](https://skia.org/docs/user/sksl/) for any syntax changes between the Skia
milestone your current version targets and the milestone shipped in 4.0.

### Reduced package size

By removing legacy compatibility layers and unused platform shims, the NuGet packages are
meaningfully smaller. This benefits CI restore times, Docker image sizes, and the published
application footprint.

## Breaking changes to plan for

This is a major version, so breaking changes are expected. The most significant ones to review:

| Area | Change |
|------|--------|
| Text API | `SKPaint` text properties removed; use `SKFont` |
| `SKCanvas.DrawText` | Overloads without `SKFont` removed |
| `SKBitmap` | Some rarely-used constructors removed |
| `SKImageInfo` | `WithColorType`/`WithAlphaType` naming aligned |
| Platform TFMs | .NET Standard 2.0 is no longer a primary target |
| Obsolete types | Several types marked `[Obsolete]` in 2.x are now removed |

The SkiaSharp team publishes a migration guide alongside the preview release. Check the
[SkiaSharp GitHub repository](https://github.com/mono/SkiaSharp) for the full list of API
removals and the recommended replacements.

## How to try Preview 1

Install the preview NuGet packages by enabling pre-release in your package manager:

```bash
dotnet add package SkiaSharp --prerelease
```

Or pin to the specific preview version in your `.csproj`:

```xml
<PackageReference Include="SkiaSharp" Version="4.0.0-preview.1.*" />
```

For platform-specific view packages (used in MAUI or Xamarin), also update:

```bash
dotnet add package SkiaSharp.Views.Maui.Controls --prerelease
dotnet add package SkiaSharp.Views.Blazor --prerelease
```

After upgrading, build your project and address any compiler errors caused by removed APIs. The
compiler messages will point directly to the relevant properties and methods that need updating.

## Checking your text rendering code

The most common migration task is updating text drawing code. Here is a quick reference for the
most frequent patterns:

**Measuring text width:**

```csharp
// 2.x
float width = paint.MeasureText("Hello");

// 4.0
float width = font.MeasureText("Hello");
```

**Getting font metrics:**

```csharp
// 2.x
SKFontMetrics metrics;
paint.GetFontMetrics(out metrics);

// 4.0
SKFontMetrics metrics;
font.GetFontMetrics(out metrics);
```

**Drawing text along a path:**

```csharp
// 4.0
canvas.DrawTextOnPath("Curved text", path, offset: 0, upward: false, font, paint);
```

## What is still to come before GA

Preview 1 is the first public cut. The team has indicated the following areas are still in progress:

- Additional API review and potential further removals
- Performance benchmarking and regression fixes
- Documentation updates
- API compatibility with the Uno Platform and Avalonia teams
- Final platform support matrix confirmation

Feedback during the preview period directly shapes the final release. Report issues and API
concerns on the [SkiaSharp GitHub issues](https://github.com/mono/SkiaSharp/issues) tracker.

## Why this matters for .NET MAUI

.NET MAUI ships SkiaSharp as a dependency for its `SKCanvasView` and `SKGLView` components.
Once SkiaSharp 4.0 reaches GA, expect a corresponding MAUI update that picks up the new binaries
and API. Start reviewing your custom drawing code now so you are not blocked when that update
ships.

For MAUI applications already using Native AOT publishing or targeting WASM via Blazor Hybrid, the
AOT improvements in 4.0 could meaningfully reduce published binary size and startup latency.

## Recap

SkiaSharp 4.0 Preview 1 is a well-considered major release that modernises a foundational library in
the .NET graphics ecosystem. The key takeaways are:

- Updated native Skia binaries with years of upstream improvements
- First-class Native AOT and trimming support
- Text API unified around `SKFont`; `SKPaint` text properties removed
- .NET 8 and .NET 9 as primary targets
- Smaller NuGet packages and reduced surface area

Try it today with `--prerelease`, migrate your text drawing code, and file feedback before the
release window closes.

## References

- [Welcome to SkiaSharp 4.0 Preview 1 (.NET devblogs)](https://devblogs.microsoft.com/dotnet/welcome-to-skia-sharp-40-preview1/)
- [SkiaSharp GitHub repository](https://github.com/mono/SkiaSharp)
- [SkiaSharp NuGet packages](https://www.nuget.org/packages/SkiaSharp)
- [Google Skia graphics library](https://skia.org/)
- [SkSL shader language documentation](https://skia.org/docs/user/sksl/)
- [.NET MAUI SkiaSharp views](https://learn.microsoft.com/en-us/dotnet/communitytoolkit/maui/views/drawingview)
