using System.Text;
using System.Text.Json;

public static class MarkdownBuilder
{
    public static string TimeframeKey(DateTimeOffset dt, string timeframe)
        => timeframe.ToLowerInvariant() switch
        {
            "daily"  => dt.ToString("yyyy-MM-dd"),
            "weekly" => $"{dt:yyyy}-W{System.Globalization.ISOWeek.GetWeekOfYear(dt.DateTime)}",
            _        => dt.ToString("yyyy-MM") // monthly default
        };

    public static string BuildCategoryPage(string category, string timeframeKey, IEnumerable<DataRow> rows)
    {
        var sb = new StringBuilder();
        sb.AppendLine($"# {category} — {timeframeKey}");
        sb.AppendLine();
        foreach (var r in rows.OrderByDescending(r => r.published ?? DateTimeOffset.MinValue))
        {
            sb.AppendLine($"## [{r.title}]({r.link})");
            sb.AppendLine($"*Source:* {r.source}  •  *Published:* {(r.published?.ToString("yyyy-MM-dd HH:mm") ?? "n/a")}");
            sb.AppendLine();
            sb.AppendLine(r.llm.Summary);
            if (r.llm.Bullets?.Count > 0)
            {
                sb.AppendLine();
                foreach (var b in r.llm.Bullets) sb.AppendLine($"- {b}");
            }
            if (r.llm.Tags?.Count > 0)
            {
                sb.AppendLine();
                sb.AppendLine($"**Tags:** {string.Join(", ", r.llm.Tags.Select(t => $"`{t}`"))}");
            }
            sb.AppendLine();
        }
        return sb.ToString();
    }
}
