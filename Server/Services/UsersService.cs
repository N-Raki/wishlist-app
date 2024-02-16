using Server.Models;
using Server.Repositories.Contracts;
using Server.Services.Contracts;

namespace Server.Services;

internal sealed class UsersService(IUsersRepository usersRepository) : IUsersService
{
	public async Task<User?> GetUserByIdAsync(Guid guid, CancellationToken cancellationToken = default)
	{
		return await usersRepository.GetUserByIdAsync(guid, cancellationToken).ConfigureAwait(false);
	}
}
