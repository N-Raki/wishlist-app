using Microsoft.EntityFrameworkCore;
using Server.Extensions;
using Server.Models;
using Server.Repositories.Contracts;

namespace Server.Repositories;

internal sealed class UsersRepository(DatabaseContext databaseContext) : IUsersRepository
{
	public async Task<User?> GetUserByGuidAsync(Guid guid, CancellationToken cancellationToken = default)
	{
		return await databaseContext.Users.GetUserWithSortedWishlistsAsync(guid, cancellationToken).ConfigureAwait(false);
	}

	public async Task UpdateUserAsync(User user, CancellationToken cancellationToken = default)
	{
		databaseContext.Users.Update(user);
		await databaseContext.SaveChangesAsync(cancellationToken);
	}
}
