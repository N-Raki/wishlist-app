using Microsoft.EntityFrameworkCore;
using Server.Extensions;
using Server.Models;
using Server.Repositories.Contracts;

namespace Server.Repositories;

internal sealed class WishlistsRepository(DatabaseContext databaseContext) : IWishlistsRepository
{
	public async Task<Wishlist?> GetWishlistByGuidAsync(Guid guid, CancellationToken cancellationToken = default)
   {
      return await databaseContext.Wishlists.GetWishlistWithSortedItemsAsync(guid, cancellationToken).ConfigureAwait(false);
   }

	public async Task<IEnumerable<Wishlist>> GetWishlistsByGuidsAsync(IEnumerable<Guid> ids, CancellationToken cancellationToken = default)
   {
      return await databaseContext.Wishlists.GetWishlistsWithSortedItemsAsync(ids, cancellationToken).ConfigureAwait(false);
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
