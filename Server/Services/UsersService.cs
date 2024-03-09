using Server.Models;
using Server.Repositories.Contracts;
using Server.Services.Contracts;

namespace Server.Services;

internal sealed class UsersService(IUsersRepository usersRepository) : IUsersService
{
	public async Task<User?> GetUserByGuidAsync(Guid guid, CancellationToken cancellationToken = default)
	{
		return await usersRepository.GetUserByGuidAsync(guid, cancellationToken).ConfigureAwait(false);
	}

	public async Task AddRecentWishlistAsync(Guid userId, Guid wishlistId, CancellationToken cancellationToken = default)
	{
		var user = await usersRepository.GetUserByGuidAsync(userId, cancellationToken).ConfigureAwait(false);
		if (user is null)
		{
			throw new ArgumentException("User not found");
		}
		user.RecentWishlistIds.Add(wishlistId);
		await usersRepository.UpdateUserAsync(user, cancellationToken);
	}
}
