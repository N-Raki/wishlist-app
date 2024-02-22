using Server.Models;
using Server.Models.Responses;

namespace Server.Mappers.Contracts;

public interface IItemMapper
{
	ItemResponse MapToResponse(Item item);
}
