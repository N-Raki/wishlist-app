using Server.Models;

namespace Server.Services.Contracts;

public interface IUsersService
{
	Task<User?> GetUserByIdAsync(Guid guid, CancellationToken cancellationToken = default);
}
