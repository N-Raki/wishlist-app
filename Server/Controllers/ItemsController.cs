using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.Common;
using Server.Mappers.Contracts;
using Server.Models.Requests;
using Server.Services.Contracts;

namespace Server.Controllers;

[ApiController]
[Route(Routes.WishlistItems)]
[Authorize]
public sealed class ItemsController(IItemsService itemsService, IItemMapper itemMapper) : ControllerBase
{
	[HttpGet("{itemId:guid}")]
	public async Task<IActionResult> GetItem([FromRoute] Guid wishlistId, [FromRoute] Guid itemId)
	{
		var item = await itemsService.GetItemByGuidAsync(itemId, HttpContext.RequestAborted).ConfigureAwait(false);
		if (item == null || item.WishlistId != wishlistId)
		{
			return NotFound();
		}
		
		return Ok(itemMapper.MapToResponse(item));
	}

	[HttpPut("{itemId:guid}")]
	public async Task<IActionResult> UpdateItem([FromRoute] Guid wishlistId, [FromRoute] Guid itemId, [FromBody] CreateItemRequest createItemRequest)
	{
		try
		{
			await itemsService.UpdateItemAsync(wishlistId, itemId, createItemRequest, HttpContext.RequestAborted).ConfigureAwait(false);
			return NoContent();
		}
		catch (ArgumentException)
		{
			return NotFound();
		}
	}
	
	[HttpPost]
	public async Task<IActionResult> CreateItemAsync([FromRoute] Guid wishlistId, [FromBody] CreateItemRequest createItemRequest)
	{
		var item = await itemsService.CreateItemAsync(wishlistId, createItemRequest, HttpContext.RequestAborted).ConfigureAwait(false);
		return CreatedAtAction(nameof(GetItem), new { wishlistId, itemId = item.Id }, item);
	}
	
	[HttpDelete("{itemId:guid}")]
	public async Task<IActionResult> DeleteItemAsync([FromRoute] Guid wishlistId, [FromRoute] Guid itemId)
	{
		try
		{
			await itemsService.DeleteItemByGuidAsync(wishlistId, itemId, HttpContext.RequestAborted).ConfigureAwait(false);
			return NoContent();
		}
		catch (ArgumentException)
		{
			return NotFound();
		}
	}
}
