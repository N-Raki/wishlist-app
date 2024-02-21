using Server.Models;
using Server.Repositories.Contracts;
using Server.Services.Contracts;

namespace Server.Services;

internal sealed class WishlistsService(IWishlistsRepository wishlistsRepository) : IWishlistsService
{
	public async Task<Wishlist?> GetWishlistByGuidAsync(Guid guid, CancellationToken cancellationToken = default)
	{
		return await wishlistsRepository.GetWishlistByGuidAsync(guid, cancellationToken).ConfigureAwait(false);
	}
}
