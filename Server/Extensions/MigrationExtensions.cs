using Microsoft.EntityFrameworkCore;

namespace Server.Extensions;

internal static class MigrationExtensions
{
    public static void ApplyMigrations(this IApplicationBuilder app)
    {
        using var scope = app.ApplicationServices.CreateScope();
        using var databaseContext = scope.ServiceProvider.GetRequiredService<DatabaseContext>();
        databaseContext.Database.Migrate();
    }
}