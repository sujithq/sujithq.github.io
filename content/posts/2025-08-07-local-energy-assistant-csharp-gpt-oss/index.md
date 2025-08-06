+++
title = '⚡ Local Energy Assistant: C# + GPT-OSS + RAG'
slug = 'local-energy-assistant-csharp-gpt-oss'
date = '2025-08-07 06:00:00Z'
lastmod = '2025-08-07 06:00:00Z'
draft = false
tags = [
  "C#",
  ".NET",
  "AI",
  "Local LLM",
  "RAG",
  "GPT-OSS",
  "Energy Management",
  "Privacy",
  "Tool Calling",
  "Console Application"
]
categories = [
  ".NET Development",
  "AI & Machine Learning",
  "Privacy & Security"
]

layout = 'single'
[params]
    cover = true
    author = 'sujith'
    cover_prompt = '''Create a clean, modern technical illustration for a blog post about building a local AI energy assistant with C# and GPT-OSS. Use .NET purple (#512BD4) and energy green (#4CAF50) as primary colours. Include visual elements representing local AI processing, energy data charts, solar panels, and privacy shields. Show C# code snippets, energy consumption graphs, and AI brain icons. Add subtle tech patterns with circuit lines and data flow arrows. Maintain a professional, enterprise-ready aesthetic that appeals to .NET developers and energy tech enthusiasts.'''
    
description = "Build a privacy-first AI energy assistant using C#, local GPT-OSS models, RAG, and tool calling. Analyse solar, gas, and weather data completely offline."
+++

## Introduction

Imagine having an AI assistant that understands your energy consumption patterns, solar production, and weather data — all running locally on your machine with zero cloud dependencies. No API keys, no subscription fees, no data leaving your premises.

In this hands-on guide, we'll build a **Local Energy Assistant** using C#, the open-source GPT-OSS-20B model, Retrieval-Augmented Generation (RAG), and custom tool calling. Perfect for privacy-conscious developers who want intelligent insights from their smart meter data.

## What We're Building

Our **AI Energy Copilot** will provide:

- **Solar Production Analysis**: Identify peak generation days and weather correlations
- **Gas Usage Intelligence**: Compare consumption patterns across weather conditions
- **Grid Import/Export Insights**: Calculate net usage and energy balance
- **Weather Context**: Link energy patterns to historical weather data
- **Tool-Based Actions**: Execute specific queries via natural language commands
- **Complete Privacy**: Everything runs locally with your own data

## Prerequisites

Before we begin, ensure you have:

- [.NET SDK 9+](https://dotnet.microsoft.com/download) installed
- **For Testing/Development**: GitHub account with access to [GitHub Models](https://github.com/marketplace/models) (testing platform for comparing AI models)
- **For Production**: [Ollama](https://ollama.com) for running local LLMs
- Your energy data in JSON format (smart meter exports, solar inverter logs, etc.)
- Basic understanding of C# and JSON

## Why GPT-OSS for Energy Analysis?

[OpenAI's GPT-OSS](https://huggingface.co/openai/gpt-oss-20b) represents a breakthrough in open-source AI, specifically designed for local and specialized use cases like our energy assistant:

### Open and Permissive

- **Apache 2.0 License**: Build freely without copyleft restrictions or patent risk
- **Commercial Use**: Perfect for personal projects and commercial energy management tools
- **No Vendor Lock-in**: Complete control over your AI infrastructure

### Optimised for Local Deployment

- **20B Parameter Model**: Designed for consumer hardware (runs within 16GB memory)
- **Native MXFP4 Quantization**: Efficient memory usage through built-in quantization
- **Official Ollama Support**: Seamless integration with local deployment tools

### Advanced Capabilities for Energy Analysis

- **Native Tool Calling**: Built-in support for function calling and agentic operations
- **Configurable Reasoning**: Adjust reasoning effort (low, medium, high) based on query complexity
- **Full Chain-of-Thought**: Complete access to the model's reasoning process for debugging
- **Fine-tunable**: Customize for domain-specific energy analysis tasks

This makes GPT-OSS ideal for analyzing personal energy data while maintaining complete privacy and control.

## Setting Up LLM Options

### Option 1: Development Testing with GitHub Models

**Important**: GitHub Models is a testing platform/environment for developers to test and compare different AI models - not suitable for production workloads.

Get your GitHub Personal Access Token:

1. Visit [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. Create a token with `model` scope
3. Set environment variable:

```bash
# Windows
set GITHUB_TOKEN=your_token_here

# Linux/macOS
export GITHUB_TOKEN=your_token_here
```

### Option 2: Production Deployment with Ollama

For production deployment:

```bash
# Install and run GPT-OSS-20B locally
ollama pull gpt-oss:20b
ollama run gpt-oss:20b
```

This starts a local OpenAI-compatible API endpoint at `http://localhost:11434/v1`.

## Preparing Your Energy Dataset

Create a `data/energy.json` file with your energy consumption data. Here's a sample structure:

```json
{
  "2025-08-01": {
    "solar": 4.2,
    "grid_consumed": 5.1,
    "grid_injected": 1.8,
    "gas_m3": 2.4,
    "weather": {
      "temperature": 23.5,
      "condition": "sunny"
    }
  },
  "2025-08-02": {
    "solar": 0.3,
    "grid_consumed": 6.2,
    "grid_injected": 0.0,
    "gas_m3": 4.1,
    "weather": {
      "temperature": 16.0,
      "condition": "rainy"
    }
  },
  "2025-08-03": {
    "solar": 3.8,
    "grid_consumed": 4.9,
    "grid_injected": 1.2,
    "gas_m3": 1.8,
    "weather": {
      "temperature": 21.0,
      "condition": "partly_cloudy"
    }
  }
}
```

**Data Sources**: You can extract this from smart meter readings, solar inverter APIs, or manual logging. Many energy providers offer CSV exports that you can convert to this JSON format.

## Creating the Flexible Console Application

Let's set up our .NET project with support for both deployment modes:

```bash
dotnet new console -n EnergyAssistant
cd EnergyAssistant
dotnet add package Microsoft.Extensions.Configuration
dotnet add package Microsoft.Extensions.Configuration.Json
```

Create an `appsettings.json` configuration file:

```json
{
  "LlmProvider": "GitHub", // "GitHub" for model testing/comparison, "Ollama" for production
  "GitHub": {
    "BaseUrl": "https://models.inference.ai.azure.com",
    "Model": "gpt-4o-mini", // Try different models: gpt-4o, gpt-4o-mini, etc.
    "Token": "" // Set via environment variable GITHUB_TOKEN
  },
  "Ollama": {
    "BaseUrl": "http://localhost:11434/v1",
    "Model": "gpt-oss:20b",
    "Token": "local"
  }
}
```

## Building the Tool System

Create `Tools.cs` to handle energy-specific queries:

```csharp
using System.Text.Json;

namespace EnergyAssistant
{
    public static class Tools
    {
        private static readonly Dictionary<string, JsonElement> data =
            JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(
                File.ReadAllText("data/energy.json"))!;

        public static string PeakSolarDay()
        {
            var maxEntry = data
                .OrderByDescending(d => d.Value.GetProperty("solar").GetDouble())
                .First();

            var solar = maxEntry.Value.GetProperty("solar").GetDouble();
            var weather = maxEntry.Value.GetProperty("weather");
            var condition = weather.GetProperty("condition").GetString();
            var temp = weather.GetProperty("temperature").GetDouble();

            return $"☀️ Peak solar production: {solar} kWh on {maxEntry.Key} " +
                   $"(Weather: {condition}, {temp}°C)";
        }

        public static string CompareGasUsage()
        {
            var coldDays = data.Where(d =>
                d.Value.GetProperty("weather").GetProperty("temperature").GetDouble() < 15);
            var warmDays = data.Where(d =>
                d.Value.GetProperty("weather").GetProperty("temperature").GetDouble() >= 15);

            var coldAvg = coldDays.Any() ?
                coldDays.Average(d => d.Value.GetProperty("gas_m3").GetDouble()) : 0;
            var warmAvg = warmDays.Any() ?
                warmDays.Average(d => d.Value.GetProperty("gas_m3").GetDouble()) : 0;

            return $"🔥 Average gas usage: {coldAvg:F2} m³ (cold days < 15°C) vs " +
                   $"{warmAvg:F2} m³ (warm days ≥ 15°C)";
        }

        public static string NetUsage(string date)
        {
            if (!data.TryGetValue(date, out var day))
                return $"❌ No data available for {date}";

            var consumed = day.GetProperty("grid_consumed").GetDouble();
            var injected = day.GetProperty("grid_injected").GetDouble();
            var net = consumed - injected;

            var status = net > 0 ? "📈 Net consumer" : "📉 Net producer";
            return $"⚡ {date}: {Math.Abs(net):F2} kWh ({status})";
        }

        public static string DayDetails(string date)
        {
            if (!data.TryGetValue(date, out var day))
                return $"❌ No data available for {date}";

            var solar = day.GetProperty("solar").GetDouble();
            var consumed = day.GetProperty("grid_consumed").GetDouble();
            var injected = day.GetProperty("grid_injected").GetDouble();
            var gas = day.GetProperty("gas_m3").GetDouble();
            var weather = day.GetProperty("weather");
            var temp = weather.GetProperty("temperature").GetDouble();
            var condition = weather.GetProperty("condition").GetString();

            return $"📊 {date} Summary:\n" +
                   $"   Solar: {solar} kWh\n" +
                   $"   Grid In: {consumed} kWh\n" +
                   $"   Grid Out: {injected} kWh\n" +
                   $"   Gas: {gas} m³\n" +
                   $"   Weather: {condition}, {temp}°C";
        }

        public static string OverallStats()
        {
            var totalDays = data.Count;
            var totalSolar = data.Sum(d => d.Value.GetProperty("solar").GetDouble());
            var totalConsumed = data.Sum(d => d.Value.GetProperty("grid_consumed").GetDouble());
            var totalInjected = data.Sum(d => d.Value.GetProperty("grid_injected").GetDouble());
            var totalGas = data.Sum(d => d.Value.GetProperty("gas_m3").GetDouble());

            return $"📈 Overall Statistics ({totalDays} days):\n" +
                   $"   Total Solar: {totalSolar:F1} kWh\n" +
                   $"   Total Grid Consumed: {totalConsumed:F1} kWh\n" +
                   $"   Total Grid Injected: {totalInjected:F1} kWh\n" +
                   $"   Total Gas: {totalGas:F1} m³\n" +
                   $"   Net Grid Usage: {(totalConsumed - totalInjected):F1} kWh";
        }
    }
}
```

## Implementing Flexible RAG and Tool Calling

Now create the enhanced application logic in `Program.cs`:

```csharp
using System.Text.Json;

namespace EnergyAssistant
{
    public static class Tools
    {
        private static readonly Dictionary<string, JsonElement> data =
            JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(
                File.ReadAllText("data/energy.json"))!;

        public static string PeakSolarDay()
        {
            var maxEntry = data
                .OrderByDescending(d => d.Value.GetProperty("solar").GetDouble())
                .First();

            var solar = maxEntry.Value.GetProperty("solar").GetDouble();
            var weather = maxEntry.Value.GetProperty("weather");
            var condition = weather.GetProperty("condition").GetString();
            var temp = weather.GetProperty("temperature").GetDouble();

            return $"☀️ Peak solar production: {solar} kWh on {maxEntry.Key} " +
                   $"(Weather: {condition}, {temp}°C)";
        }

        public static string CompareGasUsage()
        {
            var coldDays = data.Where(d =>
                d.Value.GetProperty("weather").GetProperty("temperature").GetDouble() < 15);
            var warmDays = data.Where(d =>
                d.Value.GetProperty("weather").GetProperty("temperature").GetDouble() >= 15);

            var coldAvg = coldDays.Any() ?
                coldDays.Average(d => d.Value.GetProperty("gas_m3").GetDouble()) : 0;
            var warmAvg = warmDays.Any() ?
                warmDays.Average(d => d.Value.GetProperty("gas_m3").GetDouble()) : 0;

            return $"🔥 Average gas usage: {coldAvg:F2} m³ (cold days < 15°C) vs " +
                   $"{warmAvg:F2} m³ (warm days ≥ 15°C)";
        }

        public static string NetUsage(string date)
        {
            if (!data.TryGetValue(date, out var day))
                return $"❌ No data available for {date}";

            var consumed = day.GetProperty("grid_consumed").GetDouble();
            var injected = day.GetProperty("grid_injected").GetDouble();
            var net = consumed - injected;

            var status = net > 0 ? "📈 Net consumer" : "📉 Net producer";
            return $"⚡ {date}: {Math.Abs(net):F2} kWh ({status})";
        }

        public static string DayDetails(string date)
        {
            if (!data.TryGetValue(date, out var day))
                return $"❌ No data available for {date}";

            var solar = day.GetProperty("solar").GetDouble();
            var consumed = day.GetProperty("grid_consumed").GetDouble();
            var injected = day.GetProperty("grid_injected").GetDouble();
            var gas = day.GetProperty("gas_m3").GetDouble();
            var weather = day.GetProperty("weather");
            var temp = weather.GetProperty("temperature").GetDouble();
            var condition = weather.GetProperty("condition").GetString();

            return $"📊 {date} Summary:\n" +
                   $"   Solar: {solar} kWh\n" +
                   $"   Grid In: {consumed} kWh\n" +
                   $"   Grid Out: {injected} kWh\n" +
                   $"   Gas: {gas} m³\n" +
                   $"   Weather: {condition}, {temp}°C";
        }

        public static string OverallStats()
        {
            var totalDays = data.Count;
            var totalSolar = data.Sum(d => d.Value.GetProperty("solar").GetDouble());
            var totalConsumed = data.Sum(d => d.Value.GetProperty("grid_consumed").GetDouble());
            var totalInjected = data.Sum(d => d.Value.GetProperty("grid_injected").GetDouble());
            var totalGas = data.Sum(d => d.Value.GetProperty("gas_m3").GetDouble());

            return $"📈 Overall Statistics ({totalDays} days):\n" +
                   $"   Total Solar: {totalSolar:F1} kWh\n" +
                   $"   Total Grid Consumed: {totalConsumed:F1} kWh\n" +
                   $"   Total Grid Injected: {totalInjected:F1} kWh\n" +
                   $"   Total Gas: {totalGas:F1} m³\n" +
                   $"   Net Grid Usage: {(totalConsumed - totalInjected):F1} kWh";
        }
    }
}
```

## Testing Your Flexible Energy Assistant

Create the data directory and configuration:

```bash
mkdir data
# Add your energy.json file to the data directory
# Ensure appsettings.json is in your project root
```

### Testing with GitHub Models (Development Only)

**Note**: This is for development, testing, and comparing different AI models. Do not use in production.

Set your token and run:

```bash
# Set environment variable
set GITHUB_TOKEN=your_token_here

# Run with GitHub Models (model testing mode)
dotnet run
```

### Running with Self-Hosted Ollama (Production Ready)

Switch configuration and run:

```bash
# Start Ollama in one terminal
ollama run gpt-oss:20b

# Update appsettings.json to use "Ollama" provider, then run
dotnet run
```

### Runtime Provider Switching

You can switch between providers while the application is running:

```text
⚡ Flexible Energy Assistant
🔗 Using: GitHub (gpt-4o-mini)
Type 'switch' to change LLM provider
Type 'exit' to quit

💬 You: switch
🔄 Switched to Ollama (gpt-oss:20b)

💬 You: Show me my peak solar day
```

### Model Comparison on GitHub Models

One key advantage of the GitHub Models testing platform is the ability to easily compare different AI models. You can test the same queries against multiple models by updating your `appsettings.json`:

```json
// Test with GPT-4o for maximum capability
"Model": "gpt-4o"

// Test with GPT-4o-mini for speed and cost
"Model": "gpt-4o-mini"

// Test with other available models
"Model": "llama-3.1-405b" // Or other available models
```

This allows you to evaluate which model provides the best results for your specific energy analysis use case before committing to a production deployment.

## Sample Interactions

Here are some example conversations with your energy assistant:

**Query**: "When did I generate the most solar power?"

**Response**:

```text
🤖 Assistant: Let me check your solar production data. {{tool: peak-solar-day}}

🛠️ Tool Result:
☀️ Peak solar production: 4.2 kWh on 2025-08-01 (Weather: sunny, 23.5°C)
```

**Query**: "How does cold weather affect my gas usage?"

**Response**:

```text
🤖 Assistant: I'll analyse your gas consumption patterns across different temperatures. {{tool: compare-gas}}

🛠️ Tool Result:
🔥 Average gas usage: 4.10 m³ (cold days < 15°C) vs 2.10 m³ (warm days ≥ 15°C)
```

**Query**: "Show me details for August 2nd"

**Response**:

```text
🤖 Assistant: Here's your energy breakdown for that day. {{tool: day-details 2025-08-02}}

🛠️ Tool Result:
📊 2025-08-02 Summary:
   Solar: 0.3 kWh
   Grid In: 6.2 kWh
   Grid Out: 0.0 kWh
   Gas: 4.1 m³
   Weather: rainy, 16.0°C
```

## Security and Privacy Considerations

### 🔒 Data Privacy by Deployment Mode

**GitHub Models (Development/Testing Only)**:

- **Testing Platform**: Designed for developers to test and compare different AI models
- **Model Comparison**: Easy switching between GPT-4o, GPT-4o-mini, and other available models
- **Not for Production**: Should not be used with real customer or sensitive data
- Energy data sent to Microsoft's GitHub Models testing infrastructure
- Suitable only for synthetic or anonymised test data
- Use exclusively for proof-of-concept and feature development

**Self-Hosted Ollama (Production)**:

- **Complete Data Privacy**: All processing happens locally
- **No Data Transmission**: Your energy data never leaves your machine
- **No API Keys Required**: No registration with external services
- **Full Control**: You own and control your data pipeline

### 💰 Cost Comparison

**GitHub Models (Development/Testing)**:

- Free testing quota for development and model comparison
- **Testing platform only** - compare different models like GPT-4o vs GPT-4o-mini
- No infrastructure setup required for development
- Must transition to production solution for real deployments

**Self-Hosted Ollama (Production)**:

- **Zero API Costs**: No per-token billing or subscription fees
- **One-Time Setup**: Download model once, use indefinitely
- **Scalable**: Process unlimited queries without additional costs
- Infrastructure and maintenance costs

### ⚖️ Compliance Framework

**Development (GitHub Models Testing Platform)**:

- **Development Only**: Never use with real production data
- Use only synthetic test data or completely anonymised datasets
- Perfect for comparing different models (GPT-4o vs GPT-4o-mini vs others)
- Suitable exclusively for feature development and proof-of-concept
- Must migrate to self-hosted solution for any production use

**Production (Self-Hosted Only)**:

- **GDPR Compliant**: No personal data processing by third parties
- **Enterprise Suitable**: Meets strict data governance requirements
- **Audit Friendly**: Complete transparency in data handling

## Advanced Extensions

### Weather Integration

Add real-time weather forecasting to predict energy needs:

```csharp
public static async Task<string> GetWeatherForecast()
{
    // Integrate with local weather APIs
    // Predict solar generation potential
    // Suggest optimal energy usage timing
}
```

### Smart Home Integration

Connect with Home Assistant or IoT devices:

```csharp
public static string OptimiseDeviceScheduling()
{
    // Schedule high-consumption devices during peak solar
    // Recommend heating/cooling adjustments
    // Automate based on energy predictions
}
```

### Advanced Analytics

Implement machine learning for pattern recognition:

```csharp
public static string PredictMonthlyUsage()
{
    // Use historical patterns for forecasting
    // Identify anomalies in consumption
    // Suggest efficiency improvements
}
```

## Troubleshooting

### GitHub Models Issues

**Authentication Errors**:

```bash
# Verify your token is set
echo $GITHUB_TOKEN  # Linux/macOS
echo %GITHUB_TOKEN% # Windows
```

**Rate Limiting**:

- Testing quota has monthly limits in testing platform
- Testing platform not suitable for production workloads
- Switch to self-hosted for any production deployment

**Model Availability**:

- Check [GitHub Models marketplace](https://github.com/marketplace/models) for available models to test
- Testing platform - compare models like GPT-4o, GPT-4o-mini, Llama, and others

### Ollama Issues

**Connection Failed**:

```bash
# Ensure Ollama is running
ollama list
ollama run gpt-oss:20b
```

**Model Download Issues**:

```bash
# Check available space and network
ollama pull gpt-oss:20b --verbose
```

### Configuration Problems

**JSON Parsing Errors**:

- Validate your `appsettings.json` file structure
- Check for missing commas or brackets
- Use a JSON validator tool

**Missing Data Responses**:

- Verify date formats match exactly (YYYY-MM-DD)
- Ensure all required fields are present
- Check for typos in property names

### Performance Optimization

**GitHub Models (Development/Testing)**:

- Use appropriate model size for your development testing
- Testing platform only - compare different models (GPT-4o vs GPT-4o-mini)
- Implement response caching for repeated development queries
- Transition to self-hosted for any production deployment

**Self-Hosted Ollama**:

- Monitor system resources (CPU, Memory, GPU)
- Adjust model parameters for your hardware
- Use appropriate quantization levels

## Best Practices

### Data Management

- **Regular Backups**: Keep copies of your energy data
- **Data Validation**: Implement checks for reasonable values
- **Incremental Updates**: Add new data without regenerating everything

### Performance Optimisation

- **Data Caching**: Load JSON once and cache in memory
- **Batch Processing**: Group multiple queries efficiently
- **Resource Monitoring**: Watch CPU and memory usage

### Model Management

- **Version Control**: Track which model versions work best
- **Fine-tuning**: Consider domain-specific model training
- **Fallback Options**: Have backup models available

## Advanced GPT-OSS Features

### Configurable Reasoning Levels

GPT-OSS offers three reasoning levels that you can adjust based on your query complexity:

- **Low**: Fast responses for simple data lookups and general questions
- **Medium**: Balanced speed and detail for typical energy analysis queries  
- **High**: Deep, detailed analysis for complex pattern recognition and optimization

You can control this by adding a reasoning level to your system prompts:

```csharp
var systemPrompt = @"You are an energy assistant. Reasoning: high
Analyze the user's energy data and provide detailed insights about consumption patterns.";
```

### Chain-of-Thought Visibility

Unlike cloud-based models, GPT-OSS provides complete access to its reasoning process, making it easier to:

- **Debug Responses**: Understand how the model reached its conclusions
- **Build Trust**: See the logical steps in energy recommendations
- **Improve Accuracy**: Identify and correct reasoning errors
- **Learn Insights**: Understand energy analysis methodologies

## Conclusion

You now have a flexible, production-ready AI energy assistant that adapts to your deployment needs:

- **🧪 Development**: Use GitHub Models testing platform for rapid prototyping and model comparison (development only)
- **🏭 Production**: Deploy with self-hosted Ollama for privacy and production use
- **🔄 Migration Path**: Easy transition from model testing to production deployment

This architecture demonstrates how modern .NET applications can leverage testing platforms for development and model comparison, then transition to self-hosted solutions for production, ensuring you never deploy testing infrastructure to production.

The combination of C#, configurable LLM providers, and custom tooling creates a powerful foundation for energy management that scales from proof-of-concept testing to enterprise production deployment.

Whether you're optimising solar usage, reducing gas consumption, or understanding energy patterns, this assistant provides intelligent insights while giving you complete control over your data and infrastructure.

## Next Steps

- **🔧 Configuration Management**: Implement environment-specific settings for different deployment stages
- **📊 Enhanced Visualisation**: Build a Blazor front-end with charts and dashboards
- **🔗 Real-time Integration**: Connect with smart meter APIs and IoT devices for live updates
- **🤖 Advanced AI**: Implement model comparison and A/B testing capabilities
- **🏢 Enterprise Features**: Add multi-tenant support and advanced security
- **📱 Mobile Support**: Create companion mobile apps with offline sync

## Additional Resources

- [GitHub Models Documentation](https://docs.github.com/en/github-models)
- [GitHub Models Marketplace](https://github.com/marketplace/models)
- [GPT-OSS Model Card & Documentation](https://huggingface.co/openai/gpt-oss-20b)
- [OpenAI GPT-OSS Official Blog](https://openai.com/index/introducing-gpt-oss/)
- [GPT-OSS Cookbook & Guides](https://cookbook.openai.com/topic/gpt-oss)
- [Harmony Response Format](https://github.com/openai/harmony)
- [Ollama Documentation](https://ollama.com/docs)
- [.NET Configuration Guide](https://learn.microsoft.com/en-us/dotnet/core/extensions/configuration)
- [.NET JSON Handling Guide](https://learn.microsoft.com/en-us/dotnet/standard/serialization/system-text-json/overview)
- [Smart Meter Data Formats](https://www.gov.uk/guidance/smart-meter-data)
- [Home Energy Management Systems](https://www.home-assistant.io/)
