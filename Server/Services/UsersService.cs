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
}
