using Microsoft.EntityFrameworkCore;
using Server.Models;

namespace Server;

internal sealed class DatabaseContext(DbContextOptions<DatabaseContext> options) : DbContext(options)
{
	public DbSet<User> Users { get; init; } = null!;
	
	protected override void OnModelCreating(ModelBuilder modelBuilder)
	{
		modelBuilder
			.Entity<User>().HasKey(user => user.Guid);
	}
}
