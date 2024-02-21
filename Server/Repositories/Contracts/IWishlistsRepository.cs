using Server.Models;

namespace Server.Repositories.Contracts;

public interface IWishlistsRepository
{
	Task<Wishlist?> GetWishlistByGuidAsync(Guid guid, CancellationToken cancellationToken = default);
}
