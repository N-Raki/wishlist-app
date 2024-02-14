using Server.Models;

namespace Server.Repositories.Contracts;

internal interface IUserRepository
{
	Task CreateAsync(User user, CancellationToken cancellationToken = default);
}
