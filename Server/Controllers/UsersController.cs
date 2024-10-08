﻿using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.Mappers.Contracts;
using Server.Models.Requests;
using Server.Services.Contracts;

namespace Server.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public sealed class UsersController(ILogger<UsersController> logger, IUsersService usersService, IUserMapper userMapper) : ControllerBase
{
	[HttpGet("me")]
	public async Task<IActionResult> GetMe()
	{
		var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
		if (userId is null)
		{
			logger.LogError("User ID is null");
			return BadRequest();
		}
		
		var guid = Guid.Parse(userId);
		var user = await usersService.GetUserByGuidAsync(guid, HttpContext.RequestAborted).ConfigureAwait(false);
		if (user is null)
		{
			logger.LogError("User with guid {Guid} not found", guid);
			return BadRequest();
		}

		var response = userMapper.MapToResponse(user);
		
		return Ok(response);
	}
	
	[HttpPut("me/displayname")]
	public async Task<IActionResult> UpdateDisplayName([FromBody] UpdateDisplayNameRequest request)
	{
		var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
		if (userId is null)
		{
			logger.LogError("User ID is null");
			return BadRequest();
		}
		
		var guid = Guid.Parse(userId);
		var user = await usersService.GetUserByGuidAsync(guid, HttpContext.RequestAborted).ConfigureAwait(false);
		if (user is null)
		{
			logger.LogError("User with guid {Guid} not found", guid);
			return BadRequest();
		}
		
		user.DisplayName = request.DisplayName;
		await usersService.UpdateUserAsync(user, HttpContext.RequestAborted).ConfigureAwait(false);
		
		return Ok();
	}
	
	[AllowAnonymous]
	[HttpGet("{userId:guid}/displayname")]
	public async Task<IActionResult> GetUsername([FromRoute] Guid userId)
	{
		var user = await usersService.GetUserByGuidAsync(userId, HttpContext.RequestAborted).ConfigureAwait(false);
		if (user is null)
		{
			return NotFound();
		}
		
		return Ok(user.DisplayName);
	}
}
