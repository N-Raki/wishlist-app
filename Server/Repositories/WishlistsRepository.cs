using Microsoft.EntityFrameworkCore;
using Server.Models;
using Server.Repositories.Contracts;

namespace Server.Repositories;

internal sealed class WishlistsRepository(DatabaseContext databaseContext) : IWishlistsRepository
{
	public async Task<Wishlist?> GetWishlistByGuidAsync(Guid guid, CancellationToken cancellationToken = default)
	{
		return await databaseContext.Wishlists.FindAsync([guid], cancellationToken: cancellationToken).ConfigureAwait(false);
	}

	public async Task<Wishlist> CreateWishlistAsync(Wishlist wishlist, CancellationToken cancellationToken = default)
	{
		databaseContext.Wishlists.Add(wishlist);
		await databaseContext.SaveChangesAsync(cancellationToken).ConfigureAwait(false);
		return wishlist;
	}

	public async Task DeleteWishlistAsync(Wishlist wishlist, CancellationToken cancellationToken = default)
	{
		databaseContext.Wishlists.Remove(wishlist);
		await databaseContext.SaveChangesAsync(cancellationToken).ConfigureAwait(false);
	}
}
