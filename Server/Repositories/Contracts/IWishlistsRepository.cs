using Server.Models;

namespace Server.Repositories.Contracts;

public interface IWishlistsRepository
{
	Task<Wishlist?> GetWishlistByGuidAsync(Guid guid, CancellationToken cancellationToken = default);
	Task<Wishlist> CreateWishlistAsync(Wishlist wishlist, CancellationToken cancellationToken = default);
	Task DeleteWishlistAsync(Wishlist wishlist, CancellationToken cancellationToken = default);
}
