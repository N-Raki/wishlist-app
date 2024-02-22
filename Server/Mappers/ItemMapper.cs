using Riok.Mapperly.Abstractions;
using Server.Mappers.Contracts;
using Server.Models;
using Server.Models.Responses;

namespace Server.Mappers;

[Mapper]
internal sealed partial class ItemMapper : IItemMapper
{
	public partial ItemResponse MapToResponse(Item item);
}
