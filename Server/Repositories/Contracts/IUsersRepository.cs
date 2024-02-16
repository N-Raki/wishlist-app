using Server.Models;

namespace Server.Repositories.Contracts;

public interface IUsersRepository
{
	Task<User?> GetUserByIdAsync(Guid guid, CancellationToken cancellationToken = default);
}
