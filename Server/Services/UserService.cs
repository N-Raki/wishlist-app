using Server.Models;
using Server.Repositories.Contracts;
using Server.Services.Contracts;

namespace Server.Services;

internal sealed class UserService(IUserRepository userRepository) : IUserService
{
	public async Task CreateAsync(User user, CancellationToken cancellationToken = default)
	{
		await userRepository.CreateAsync(user, cancellationToken);
	}
}
