using Server.Models;

namespace Server.Services.Contracts;

public interface IWishlistsService
{
	Task<Wishlist?> GetWishlistByGuidAsync(Guid guid, CancellationToken cancellationToken = default);
}
