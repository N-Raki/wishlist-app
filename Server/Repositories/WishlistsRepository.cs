using Microsoft.EntityFrameworkCore;
using Server.Models;
using Server.Repositories.Contracts;

namespace Server.Repositories;

internal sealed class WishlistsRepository(DatabaseContext databaseContext) : IWishlistsRepository
{
	public async Task<Wishlist?> GetWishlistByGuidAsync(Guid guid, CancellationToken cancellationToken = default)
	{
		return await databaseContext.Wishlists.FirstOrDefaultAsync(wishlist => wishlist.Id == guid, cancellationToken).ConfigureAwait(false);
	}
}
