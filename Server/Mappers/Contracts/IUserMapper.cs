using Server.Models;
using Server.Models.Responses;

namespace Server.Mappers.Contracts;

public interface IUserMapper
{
	UserResponse MapToResponse(User user);
}
