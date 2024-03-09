using Server.Models;

namespace Server.Repositories.Contracts;

public interface IUsersRepository
{
	Task<User?> GetUserByGuidAsync(Guid guid, CancellationToken cancellationToken = default);
	Task UpdateUserAsync(User user, CancellationToken cancellationToken = default);
}
