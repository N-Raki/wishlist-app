using Server.Models;
using Server.Models.Requests;

namespace Server.Services.Contracts;

public interface IWishlistsService
{
	Task<Wishlist?> GetWishlistByGuidAsync(Guid guid, CancellationToken cancellationToken = default);
	Task<Wishlist> CreateWishlistAsync(CreateWishlistRequest createWishlistRequest, CancellationToken cancellationToken = default);
	Task DeleteWishlistByGuidAsync(Guid guid, CancellationToken cancellationToken = default);
}
