using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Server.Models;

namespace Server;

internal sealed class DatabaseContext(DbContextOptions<DatabaseContext> options) : IdentityDbContext<User, IdentityRole<Guid>, Guid>(options)
{
	public DbSet<Wishlist> Wishlists { get; set; }
	
	protected override void OnModelCreating(ModelBuilder modelBuilder)
	{
		base.OnModelCreating(modelBuilder);

		modelBuilder.Entity<Wishlist>()
			.HasOne(wishlist => wishlist.User)
			.WithMany(user => user.Wishlists)
			.HasForeignKey(wishlist => wishlist.UserId);
	}
}