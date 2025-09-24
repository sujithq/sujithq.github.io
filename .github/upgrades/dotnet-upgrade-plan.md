# .NET 10.0 Upgrade Plan

## Execution Steps

Execute steps below sequentially one by one in the order they are listed.

1. Validate that an .NET 10.0 SDK required for this upgrade is installed on the machine and if not, help to get it installed.
2. Ensure that the SDK version specified in global.json files is compatible with the .NET 10.0 upgrade.
3. Upgrade Crawler\Crawler.csproj

## Settings

This section contains settings and data used by execution steps.

### Aggregate NuGet packages modifications across all projects

NuGet packages used across all selected projects or their dependencies that need version update in projects that reference them.

| Package Name                                           | Current Version | New Version              | Description                         |
|:-------------------------------------------------------|:---------------:|:------------------------:|:------------------------------------|
| Microsoft.Extensions.Configuration                     |   9.0.8         | 10.0.0-rc.1.25451.107   | Recommended for .NET 10.0          |
| Microsoft.Extensions.Configuration.EnvironmentVariables|   9.0.8         | 10.0.0-rc.1.25451.107   | Recommended for .NET 10.0          |
| Microsoft.Extensions.Configuration.Json                |   9.0.8         | 10.0.0-rc.1.25451.107   | Recommended for .NET 10.0          |
| Microsoft.Extensions.Configuration.UserSecrets         |   9.0.8         | 10.0.0-rc.1.25451.107   | Recommended for .NET 10.0          |
| Microsoft.Extensions.Hosting                           |   9.0.8         | 10.0.0-rc.1.25451.107   | Recommended for .NET 10.0          |
| Microsoft.Extensions.Http                              |   9.0.8         | 10.0.0-rc.1.25451.107   | Recommended for .NET 10.0          |
| Microsoft.Extensions.Logging.Console                   |   9.0.8         | 10.0.0-rc.1.25451.107   | Recommended for .NET 10.0          |
| Microsoft.Extensions.Options                           |   9.0.8         | 10.0.0-rc.1.25451.107   | Recommended for .NET 10.0          |
| Microsoft.Extensions.Options.ConfigurationExtensions   |   9.0.8         | 10.0.0-rc.1.25451.107   | Recommended for .NET 10.0          |

### Project upgrade details

This section contains details about each project upgrade and modifications that need to be done in the project.

#### Crawler\Crawler.csproj modifications

Project properties changes:
  - Target framework should be changed from `net9.0` to `net10.0`

NuGet packages changes:
  - Microsoft.Extensions.Configuration should be updated from `9.0.8` to `10.0.0-rc.1.25451.107` (*recommended for .NET 10.0*)
  - Microsoft.Extensions.Configuration.EnvironmentVariables should be updated from `9.0.8` to `10.0.0-rc.1.25451.107` (*recommended for .NET 10.0*)
  - Microsoft.Extensions.Configuration.Json should be updated from `9.0.8` to `10.0.0-rc.1.25451.107` (*recommended for .NET 10.0*)
  - Microsoft.Extensions.Configuration.UserSecrets should be updated from `9.0.8` to `10.0.0-rc.1.25451.107` (*recommended for .NET 10.0*)
  - Microsoft.Extensions.Hosting should be updated from `9.0.8` to `10.0.0-rc.1.25451.107` (*recommended for .NET 10.0*)
  - Microsoft.Extensions.Http should be updated from `9.0.8` to `10.0.0-rc.1.25451.107` (*recommended for .NET 10.0*)
  - Microsoft.Extensions.Logging.Console should be updated from `9.0.8` to `10.0.0-rc.1.25451.107` (*recommended for .NET 10.0*)
  - Microsoft.Extensions.Options should be updated from `9.0.8` to `10.0.0-rc.1.25451.107` (*recommended for .NET 10.0*)
  - Microsoft.Extensions.Options.ConfigurationExtensions should be updated from `9.0.8` to `10.0.0-rc.1.25451.107` (*recommended for .NET 10.0*)