using Server.Models;

namespace Server.Services.Contracts;

public interface IUserService
{
	Task CreateAsync(User user, CancellationToken cancellationToken = default);
}
