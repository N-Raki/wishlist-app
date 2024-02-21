using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Server.Models;

namespace Server;

internal sealed class DatabaseContext(DbContextOptions<DatabaseContext> options) : IdentityDbContext<User, IdentityRole<Guid>, Guid>(options)
{
	public DbSet<Wishlist> Wishlists { get; init; } = null!;
	public DbSet<Item> Items { get; init; } = null!;
	
	protected override void OnModelCreating(ModelBuilder modelBuilder)
	{
		base.OnModelCreating(modelBuilder);

		modelBuilder.Entity<Wishlist>()
			.HasOne(wishlist => wishlist.User)
			.WithMany(user => user.Wishlists)
			.HasForeignKey(wishlist => wishlist.UserId);
		
		modelBuilder.Entity<Item>()
			.HasOne(item => item.Wishlist)
			.WithMany(wishlist => wishlist.Items)
			.HasForeignKey(item => item.WishlistId);
	}
}