using Server.Models;

namespace Server.Services.Contracts;

public interface IUsersService
{
	Task<User?> GetUserByGuidAsync(Guid guid, CancellationToken cancellationToken = default);
	Task AddRecentWishlistAsync(Guid userId, Guid wishlistId, CancellationToken cancellationToken = default);
	Task UpdateUserAsync(User user, CancellationToken cancellationToken = default);
}
